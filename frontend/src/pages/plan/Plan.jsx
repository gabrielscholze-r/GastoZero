import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGear } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PlanAddEntry from "./PlanAddEntry";
import {
  getCategories,
  getExpensesByPlan,
  deleteExpense,
  updatePlanAmout,
} from "./Actions";
import { useQueryClient } from "@tanstack/react-query";
import PlanEdit from "./PlanEdit.jsx";
import {formatDate} from "../../util/util.js";

export default function Plan({ data }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [localData, setLocalData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempList, setTempList] = useState([]);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  useEffect(() => {
    setIsAdding(false);
    setIsEditing(false);
    setTempList([]);

    if (!data || Object.keys(data).length === 0) {
      navigate("/home");
    } else {
      setLocalData(null);
      setTimeout(() => {
        setLocalData(data);
        loadExpenses(data.id);
        loadCategories();
      }, 100);
    }
  }, [data, navigate]);

  const loadExpenses = async (planId) => {
    const result = await getExpensesByPlan(planId);
    setExpenses(result.data ?? []);
  };

  const loadCategories = async () => {
    const result = await getCategories();
    setCategories(result ?? []);
  };

  const handleAddExpense = async (newExpense) => {
    const ok = await updatePlanAmout(
      newExpense.budget_id,
      newExpense.amount,
      true
    );
    if (!ok) {
      console.error("Error updating amount on server");
      return;
    }

    setExpenses((prev) => [...prev, newExpense]);
    setIsAdding(false);

    setLocalData((prev) => ({
      ...prev,
      totalAmount: prev.totalAmount + newExpense.amount,
    }));

    await queryClient.invalidateQueries(["plans"]);
    const allPlans = await queryClient.fetchQuery({ queryKey: ["plans"] });
    const updated = allPlans.find((p) => p.id === localData.id);
    if (updated) {
      setLocalData(updated);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      for (const item of tempList) {
        const [id, planId, amount] = item.split(":").map(Number);

        const success = await deleteExpense(id, planId);
        if (!success) throw new Error("Failed executing deleteExpense");

        await updatePlanAmout(planId, amount, false);

        setLocalData((prev) => ({
          ...prev,
          totalAmount: prev.totalAmount - amount,
        }));
      }

      await loadExpenses(localData.id);
      setTempList([]);
      setIsEditing(false);

      await queryClient.invalidateQueries(["plans"]);
      const allPlans = await queryClient.fetchQuery({ queryKey: ["plans"] });
      const updated = allPlans.find((p) => p.id === localData.id);
      if (updated) {
        setLocalData(updated);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleHeaderClick = (column) => {
    if (activeColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setActiveColumn(column);
      setSortDirection("asc");
    }
  };

  const handleTempList = (id, planID, amount) => {
    const identifier = `${id}:${planID}:${amount}`;
    setTempList((prev) =>
      prev.includes(identifier)
        ? prev.filter((item) => item !== identifier)
        : [...prev, identifier]
    );
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (!activeColumn) return 0;
    const valA = a[activeColumn];
    const valB = b[activeColumn];
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (!data || Object.keys(data).length === 0) return null;

  const ExpenseList = () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        {!isAdding && !isEditing && (
          <>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-bgdark hover:opacity-80 transition-opacity text-white px-4 py-2 rounded-md shadow cursor-pointer border-2 border-gold"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "+ Add Entry"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-bgdark hover:opacity-80 transition-opacity text-white px-4 py-2 rounded-md shadow cursor-pointer border-2 border-gold"
            >
              Edit
            </button>
          </>
        )}
        {isAdding && (
          <div className="flex gap-4">
            <button
              onClick={() =>
                document.getElementById("plan-entry-form")?.requestSubmit()
              }
              className="bg-bgdark hover:opacity-80 transition-opacity text-white px-4 py-2 rounded-md shadow border-2 border-gold"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-bgdark hover:opacity-80 transition-opacity text-white px-4 py-2 rounded-md hover:underline border-2 border-gold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
        {isEditing && (
          <div className="flex gap-4">
            <button
              onClick={handleDeleteExpense}
              className="bg-bgdark hover:opacity-80 transition-opacity text-white px-4 py-2 rounded-md shadow border-2 border-gold"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTempList([]);
              }}
              className="bg-bgdark hover:opacity-80 transition-opacity text-white px-4 py-2 rounded-md border-2 border-gold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>

      <div className="overflow-x-auto max-h-[300px] overflow-y-auto rounded">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-white cursor-pointer ">
              {[
                { key: "date", label: "Date" },
                { key: "description", label: "Description" },
                { key: "category_name", label: "Category" },
                { key: "amount", label: "Amount" },
                { key: "is_recurring", label: "Recurring" },
                isEditing
                  ? { key: "delete", label: "Delete" }
                  : { key: "", label: "" },
              ].map(
                ({ key, label }) =>
                  key &&
                  label && (
                    <th
                      key={key}
                      className={`py-2 text-center opacity-50 ${
                        activeColumn === key ? "opacity-100" : ""
                      } ${isAdding ? "opacity-90 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (!isAdding && !isEditing) handleHeaderClick(key);
                      }}
                    >
                      {label}
                      {activeColumn === key && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <PlanAddEntry
                onSave={handleAddExpense}
                onCancel={() => setIsAdding(false)}
                categories={categories}
                setIsAdding={setIsAdding}
                budgetId={localData.id}
                setCategories={setCategories}
              />
            )}
            {sortedExpenses.map((expense) => {
              const idf = `${expense.id}:${expense.budget_id}:${expense.amount}`;
              const sel = tempList.includes(idf);
              return (
                <tr
                  key={expense.id}
                  className={`bg-bgdark text-white text-center transition-colors duration-200 border-b-2 border-t-2 border-gold rounded-xl ${
                    isEditing && sel ? "bg-gray-dark opacity-60" : ""
                  }`}
                >
                  <td className="p-3">{formatDate(expense.date)}</td>
                  <td className="p-3">{expense.description}</td>
                  <td className="p-3">{expense.category_name}</td>
                  <td className="p-3">
                    R$ {Number(expense.amount).toFixed(2)}
                  </td>
                  <td className="p-3">{expense.is_recurring ? "Yes" : "No"}</td>
                  {isEditing && (
                    <td
                      className="p-2"
                      onClick={() =>
                        handleTempList(
                          expense.id,
                          expense.budget_id,
                          expense.amount
                        )
                      }
                    >
                      <div
                        className={`flex items-center justify-center p-2 rounded cursor-pointer transition-transform hover:scale-105 ${
                          sel ? "bg-gray-500" : "bg-red-500"
                        }`}
                      >
                        <MdDelete size={16} color="#ffffff" />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {localData && (
          <motion.div
            key={localData.id || localData.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-11/12 h-10/12 bg-containerbg rounded p-6 text-white z-50 shadow-lg overflow-visible"
          >

            <div className="flex justify-between mb-5">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold">{localData.name}</h2>
                <div className="relative flex items-center">
                  {(localData.description.length>0) && (<FaInfoCircle
                      size={20}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="cursor-pointer hover:scale-110 transition-transform"
                  />)}

                  {showTooltip && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-dark text-sm text-white p-2 rounded shadow-lg w-64">
                      {localData.description}
                    </div>
                  )}
                </div>
                <button disabled={isEditingPlan} onClick={() => {
                  setIsEditingPlan(true)
                }}>
                  <FaGear
                      size={20}
                      className="cursor-pointer hover:rotate-45 transition-transform"/>
                </button>
              </div>
              <p className="text-sm text-zinc-400">
                Total: R$ {localData.totalAmount.toFixed(2)}
              </p>
            </div>
            {isEditingPlan && (
                <PlanEdit setIsOpened={setIsEditingPlan} isOpened={isEditingPlan} data={localData} setLocalData={setLocalData}/>
            )}
            <ExpenseList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
