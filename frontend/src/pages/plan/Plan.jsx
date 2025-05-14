import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {FaInfoCircle} from "react-icons/fa";
import PlanAddEntry from "./PlanAddEntry";
import {getCategories, getExpensesByPlan} from "./Actions";

export default function Plan({data}) {
    const navigate = useNavigate();
    const [localData, setLocalData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [activeColumn, setActiveColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsAdding(false);
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

    const handleAddExpense = (newExpense) => {
        setExpenses((prev) => [...prev, newExpense]);
        setIsAdding(false);
    };

    const handleHeaderClick = (column) => {
        if (activeColumn === column) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setActiveColumn(column);
            setSortDirection("asc");
        }
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

    const ExpenseList = () => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-blue-700 transition-opacity hover:opacity-70 text-white px-4 py-2 rounded shadow cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "+ Add Entry"}
                        </button>
                    )}
                    {isAdding && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    document.getElementById("plan-entry-form")?.requestSubmit();
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="text-white px-4 py-2 rounded hover:underline"
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
                        <tr className="bg-blue-700 text-white cursor-pointer">
                            {[
                                { key: "date", label: "Date" },
                                { key: "description", label: "Description" },
                                { key: "category_name", label: "Category" },
                                { key: "amount", label: "Amount" },
                                { key: "is_recurring", label: "Recurring" },
                            ].map(({ key, label }) => (
                                <th
                                    key={key}
                                    className={`p-2 text-left ${
                                        activeColumn === key ? "bg-blue-900" : ""
                                    } ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={() => {
                                        if (isAdding) return;
                                        handleHeaderClick(key);
                                    }}
                                >
                                    {label}
                                    {activeColumn === key && (
                                        <span className="ml-1">{sortDirection === "asc" ? "▲" : "▼"}</span>
                                    )}
                                </th>
                            ))}
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
                        {sortedExpenses.map((expense) => (
                            <tr key={expense.id} className="odd:bg-zinc-900 even:bg-zinc-800 text-white">
                                <td className="p-2">{expense.date}</td>
                                <td className="p-2">{expense.description}</td>
                                <td className="p-2">{expense.category_name}</td>
                                <td className="p-2">R$ {Number(expense.amount).toFixed(2)}</td>
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
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{type: "tween", duration: 0.3}}
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
                                        <FaInfoCircle size={20}/>
                                    </div>
                                    {showTooltip && (
                                        <div
                                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-dark text-sm text-white p-2 rounded shadow-lg w-64">
                                            {localData.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-zinc-400">
                                Total: R$ {localData.totalAmount.toFixed(2)}
                            </p>
                        </div>
                        <ExpenseList/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
