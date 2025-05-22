import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlans } from "../../hooks/usePlans.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Reports() {
    const { data: plans = []} = usePlans();
    const [selectedPlan, setSelectedPlan] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const handleGenerateReport = (e) => {
        e.preventDefault();

        if (!selectedPlan) {
            toast.error("You must select a plan");
            return;
        }
        if ((!fromDate && toDate) || (fromDate && !toDate) || fromDate > toDate) {
            toast.error("You must select a valid date range");
            return;
        }

        toast.success("Report generation started");

        console.log({
            plan: selectedPlan,
            fromDate,
            toDate,
        });
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
                        {/* Plan/Category Selection */}
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

                        {/* From Date */}
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

                        {/* To Date */}
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

                        {/* Generate Report Button */}
                        <div className="flex flex-col w-1/5 mt-auto">
                            <button
                                type="submit"
                                className="bg-bgdark hover:opacity-80 text-white font-semibold px-4 py-2 rounded transition-opacity cursor-pointer duration-200 w-full"
                            >
                                Generate Report
                            </button>
                        </div>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}