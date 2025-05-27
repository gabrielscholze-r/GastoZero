import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlans } from "../../hooks/usePlans.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReportGraph from "./ReportGraph.jsx";
import Cookies from "js-cookie";

const graphTypes = [
    { label: "Pie", value: "pie" },
    { label: "Bar", value: "bar" },
    { label: "Line", value: "line" },
    { label: "Area", value: "area" },
    { label: "Treemap", value: "treemap" },
    { label: "Radar", value: "radar" },
];

export default function Reports() {
    const { data: plans = [] } = usePlans();
    const [selectedPlan, setSelectedPlan] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [recurring, setRecurring] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [reportName, setReportName] = useState("");
    const [graphType, setGraphType] = useState(() => Cookies.get("graphType") || "pie");

    useEffect(() => {
        Cookies.set("graphType", graphType);
    }, [graphType]);

    const handleGenerateReport = (e) => {
        e.preventDefault();

        if (!selectedPlan) {
            toast.error("You must select a plan");
            return;
        }
        if ((!fromDate && toDate) || (fromDate && !toDate) || new Date(fromDate) > new Date(toDate)) {
            toast.error("You must select a valid date range");
            return;
        }

        toast.success("Report generation started");

        const filteredPlan = plans.find(p => p.id === parseInt(selectedPlan, 10));
        if (!filteredPlan) {
            toast.error("Plan not found.");
            return;
        }

        setReportName(filteredPlan.name);

        const filteredExpenses = filteredPlan.expenses.filter(exp => {
            const expenseDate = new Date(exp.date);
            return (!fromDate || expenseDate >= new Date(fromDate)) &&
                (!toDate || expenseDate <= new Date(toDate)) &&
                (recurring !== null ? exp.is_recurring === recurring : true);
        });

        const categoryAggregation = filteredExpenses.reduce((acc, exp) => {
            const category = exp.category_name;
            if (acc[category]) {
                acc[category] += exp.amount;
            } else {
                acc[category] = exp.amount;
            }
            return acc;
        }, {});

        const reportData = Object.entries(categoryAggregation).map(([name, value]) => ({
            name,
            value
        }));

        setReportData(reportData);
    };

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="w-11/12 h-10/12 bg-containerbg rounded p-6 text-white shadow-lg overflow-auto"
                >
                    <form
                        onSubmit={handleGenerateReport}
                        className="flex justify-evenly items-center gap-6 w-full"
                    >
                        <div className="flex flex-col w-1/5">
                            <label htmlFor="plan-select" className="mb-1 font-semibold text-sm">
                                Select a Plan:
                            </label>
                            <select
                                id="plan-select"
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="cursor-pointer bg-bgdark text-white rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            >
                                <option value="">Select a Option</option>
                                {plans.map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col w-1/5">
                            <label htmlFor="recur-select" className="mb-1 font-semibold text-sm">
                                Recurrent
                            </label>
                            <select
                                id="recur-select"
                                value={recurring === null ? "null" : recurring.toString()}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "true") setRecurring(true);
                                    else if (value === "false") setRecurring(false);
                                    else setRecurring(null);
                                }}
                                className="cursor-pointer bg-bgdark text-white rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            >
                                <option value="null">All</option>
                                <option value="true">Recurrent</option>
                                <option value="false">Not Recurrent</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-1/5">
                            <label htmlFor="from-date" className="mb-1 font-semibold text-sm">
                                From Date:
                            </label>
                            <input
                                type="date"
                                id="from-date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="cursor-pointer bg-bgdark text-white rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>

                        <div className="flex flex-col w-1/5">
                            <label htmlFor="to-date" className="mb-1 font-semibold text-sm">
                                To Date:
                            </label>
                            <input
                                type="date"
                                id="to-date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="cursor-pointer bg-bgdark text-white rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>

                        <div className="flex flex-col w-1/5 mt-auto">
                            <button
                                type="submit"
                                className="bg-bgdark hover:opacity-80 text-white font-semibold px-4 py-2 rounded transition-opacity cursor-pointer duration-200 w-full"
                            >
                                Generate Report
                            </button>
                        </div>
                    </form>

                    {reportData.length > 0 && (
                        <div className="mt-6 flex justify-center items-center gap-4">
                            <label htmlFor="graph-type" className="font-semibold text-sm">
                                Graph Type:
                            </label>
                            <select
                                id="graph-type"
                                value={graphType}
                                onChange={(e) => setGraphType(e.target.value)}
                                className="cursor-pointer bg-bgdark text-white rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {graphTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        {reportData.length > 0 && (
                            <ReportGraph name={reportName} data={reportData} type={graphType} />
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
