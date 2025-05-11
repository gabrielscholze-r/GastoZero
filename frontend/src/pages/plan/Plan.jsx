import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";

export default function Plan({ data }) {
  const navigate = useNavigate();
  const [localData, setLocalData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      navigate("/home");
    } else {
      setLocalData(null);
      setTimeout(() => {
        setLocalData(data);
        setExpenses(data.expenses || []);
      }, 100);
    }
  }, [data, navigate]);

  if (!data || Object.keys(data).length === 0) return null;

  const handleAddEntry = () => {
    console.log("Add entry clicked");
  };

  const handleHeaderClick = (column) => {
    setActiveColumn(column);
  };

  const ExpenseList = () => {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddEntry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow cursor-pointer transition-colors"
          >
            + Add Entry
          </button>
        </div>

        <div className="overflow-x-auto max-h-[300px] overflow-y-auto rounded">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-800 text-white cursor-pointer">
                <th
                  className={`p-2 text-left ${
                    activeColumn === "date" ? "bg-blue-700" : ""
                  }`}
                  onClick={() => handleHeaderClick("date")}
                >
                  Date
                </th>
                <th
                  className={`p-2 text-left ${
                    activeColumn === "description" ? "bg-blue-700" : ""
                  }`}
                  onClick={() => handleHeaderClick("description")}
                >
                  Description
                </th>
                <th
                  className={`p-2 text-left ${
                    activeColumn === "category_id" ? "bg-blue-700" : ""
                  }`}
                  onClick={() => handleHeaderClick("category_id")}
                >
                  Category
                </th>
                <th
                  className={`p-2 text-left ${
                    activeColumn === "amount" ? "bg-blue-700" : ""
                  }`}
                  onClick={() => handleHeaderClick("amount")}
                >
                  Amount
                </th>
                <th
                  className={`p-2 text-left ${
                    activeColumn === "is_recurring" ? "bg-blue-700" : ""
                  }`}
                  onClick={() => handleHeaderClick("is_recurring")}
                >
                  Recurring?
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="odd:bg-zinc-900 even:bg-zinc-800 text-white"
                >
                  <td className="p-2">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{expense.description}</td>
                  <td className="p-2">{expense.category_id}</td>
                  <td className="p-2">R$ {expense.amount.toFixed(2)}</td>
                  <td className="p-2">{expense.is_recurring ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

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
                  <div
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <FaInfoCircle size={20} />
                  </div>
                  {showTooltip && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-dark text-sm text-white p-2 rounded shadow-lg w-64">
                      {localData.description}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                Total: R$ {localData.totalAmount.toFixed(2)}
              </p>
            </div>
            <ExpenseList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
