import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {FaGear} from "react-icons/fa6";
import {FaInfoCircle} from "react-icons/fa";
import {MdDelete} from "react-icons/md";
import PlanAddEntry from "./PlanAddEntry";
import {
    getCategories,
    getExpensesByPlan,
    deleteExpense,
    updatePlanAmout,
} from "./Actions";
import ExpenseList from './ExpenseList';

import {useQueryClient} from "@tanstack/react-query";
import PlanEdit from "./PlanEdit.jsx";
import {formatDate} from "../../util/util.js";
import {usePlans} from "../../hooks/usePlans.jsx";
import {toast} from "react-toastify";

export default function Plan({data}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {refetch} = usePlans()

    const [localData, setLocalData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [activeColumn, setActiveColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, _] = useState(false);
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

        await refetch();
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
                toast.success("Entry deleted");
            }

            await loadExpenses(localData.id);
            setTempList([]);
            setIsEditing(false);

            await queryClient.invalidateQueries(["plans"]);
            const allPlans = await queryClient.fetchQuery({queryKey: ["plans"]});
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


    return (
        <div className="h-screen w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                {localData && (
                    <motion.div
                        key={localData.id || localData.name}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{type: "tween", duration: 0.3}}
                        className="w-11/12 h-5/6 bg-containerbg rounded p-6 text-white shadow-lg flex flex-col overflow-hidden"
                    >

                        <div className="flex justify-between mb-5">
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-2xl font-bold">{localData.name}</h2>
                                <div className="relative flex items-center">
                                    {(localData.description.length > 0) && (<FaInfoCircle
                                        size={20}
                                        onMouseEnter={() => setShowTooltip(true)}
                                        onMouseLeave={() => setShowTooltip(false)}
                                        className="cursor-pointer hover:scale-110 transition-transform"
                                    />)}

                                    {showTooltip && (
                                        <div
                                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-dark text-sm text-white p-2 rounded shadow-lg w-64">
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
                                Total: $ {localData.totalAmount.toFixed(2)}
                            </p>
                        </div>
                        {isEditingPlan && (
                            <PlanEdit setIsOpened={setIsEditingPlan} isOpened={isEditingPlan} data={localData}
                                      setLocalData={setLocalData}/>
                        )}
                        <ExpenseList
                            isAdding={isAdding}
                            isEditing={isEditing}
                            isLoading={isLoading}
                            setIsAdding={setIsAdding}
                            setIsEditing={setIsEditing}
                            error={error}
                            activeColumn={activeColumn}
                            sortDirection={sortDirection}
                            categories={categories}
                            localData={localData}
                            setCategories={setCategories}
                            handleAddExpense={handleAddExpense}
                            handleDeleteExpense={handleDeleteExpense}
                            handleHeaderClick={handleHeaderClick}
                            handleTempList={handleTempList}
                            sortedExpenses={sortedExpenses}
                            tempList={tempList}
                            setTempList={setTempList}
                        />

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
