import React, {useState, useEffect} from 'react';
import {MdClose, MdDelete, MdEdit, MdSave} from "react-icons/md";
import PlanAddEntry from "./PlanAddEntry";
import {updateExpense} from "./Actions";
import { formatDate } from "../../util/util.js";
import {toast} from "react-toastify";
import {usePlans} from "../../hooks/usePlans.jsx";

export default function ExpenseList ({
                                         isAdding,
                                         isEditing,
                                         isLoading,
                                         setIsAdding,
                                         setIsEditing,
                                         error,
                                         activeColumn,
                                         sortDirection,
                                         categories,
                                         localData,
                                         setCategories,
                                         handleAddExpense,
                                         handleDeleteExpense,
                                         handleHeaderClick,
                                         sortedExpenses: propsSortedExpenses,
                                         tempList,
                                         setTempList,
                                         handleTempList,
                                     })  {
    const [editingExpense, setEditingExpense] = useState(null);
    const [editForm, setEditForm] = useState({
        date: '',
        description: '',
        category_name: '',
        amount: '',
        is_recurring: false
    });
    const {refetch}= usePlans()
    const [localSortedExpenses, setLocalSortedExpenses] = useState(propsSortedExpenses);

    useEffect(() => {
        setLocalSortedExpenses(propsSortedExpenses);
    }, [propsSortedExpenses]);

    const handleEditClick = (expense) => {
        if (isAdding || isEditing) {
            toast.info("Finish current operation before editing");
            return;
        }
        if (editingExpense && editingExpense !== expense.id) {
            toast.info("Please finish editing the current expense first");
            return;
        }
        setEditingExpense(expense.id);
        setEditForm({
            date: expense.date,
            description: expense.description,
            category_name: expense.category_name,
            amount: expense.amount,
            is_recurring: expense.is_recurring
        });
    };

    const handleSaveEdit = async (expenseId) => {
        try {
            const formattedAmount = parseFloat(editForm.amount.toString().replace(',', '.'));

            const updatedData = {
                ...editForm,
                amount: formattedAmount
            };

            const r = await updateExpense(expenseId, updatedData);
            if (r) {
                await refetch()
                setEditingExpense(null);
                toast.success("Expense updated successfully");
            } else {
                toast.error("Error updating expense");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update expense");
        }
    };

    const handleCancelEdit = () => {
        setEditingExpense(null);
        setEditForm({
            date: '',
            description: '',
            category_name: '',
            amount: '',
            is_recurring: false
        });
    };

    return (
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
                            Delete Expenses
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
            <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto rounded">
                <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                    <tr className="bg-primary text-white cursor-pointer">
                        {[
                            {key: "date", label: "Date"},
                            {key: "description", label: "Description"},
                            {key: "category_name", label: "Category"},
                            {key: "amount", label: "Amount"},
                            {key: "is_recurring", label: "Recurring"},
                            isEditing
                                ? {key: "delete", label: "Delete"}
                                : {key: "actions", label: "Actions"},
                        ].map(
                            ({key, label}) =>
                                key &&
                                label && (
                                    <th
                                        key={key}
                                        className={`py-2 text-center opacity-70 ${
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
                    {localSortedExpenses.map((expense) => {
                        const idf = `${expense.id}:${expense.budget_id}:${expense.amount}`;
                        const sel = tempList.includes(idf);
                        const isEditingThis = editingExpense === expense.id;

                        return (
                            <tr
                                key={expense.id}
                                className={`bg-bgdark text-white text-center transition-colors duration-200 border-b-2 border-t-2 border-gold rounded-xl ${
                                    isEditing && sel ? "bg-gray-dark opacity-60" : ""
                                }`}
                            >
                                <td className="p-3">
                                    {isEditingThis ? (
                                        <input
                                            type="date"
                                            value={editForm.date}
                                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                                            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                                        />
                                    ) : formatDate(expense.date)}
                                </td>
                                <td className="p-3">
                                    {isEditingThis ? (
                                        <input
                                            type="text"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                                        />
                                    ) : expense.description}
                                </td>
                                <td className="p-3">
                                    {isEditingThis ? (
                                        <select
                                            value={editForm.category_name}
                                            onChange={(e) => setEditForm({...editForm, category_name: e.target.value})}
                                            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    ) : expense.category_name}
                                </td>
                                <td className="p-3">
                                    {isEditingThis ? (
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={editForm.amount}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^\d.,]/g, "");
                                            }}
                                            onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                                            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                                        />
                                    ) : `$ ${Number(expense.amount).toFixed(2)}`}
                                </td>
                                <td className="p-3">
                                    {isEditingThis ? (
                                        <input
                                            type="checkbox"
                                            checked={editForm.is_recurring}
                                            onChange={(e) => setEditForm({...editForm, is_recurring: e.target.checked})}
                                            className="w-4 h-4"
                                        />
                                    ) : expense.is_recurring ? "Yes" : "No"}
                                </td>
                                <td className="p-2">
                                    {isEditing ? (
                                        <div
                                            className={`flex items-center justify-center p-2 rounded cursor-pointer transition-transform hover:scale-105 ${
                                                sel ? "bg-gray-500" : "bg-red-500"
                                            }`}
                                            onClick={() => handleTempList(
                                                expense.id,
                                                expense.budget_id,
                                                expense.amount
                                            )}
                                        >
                                            <MdDelete size={16} color="#ffffff"/>
                                        </div>
                                    ) : isEditingThis ? (
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleSaveEdit(expense.id)}
                                                className="p-1 bg-green-600 rounded hover:opacity-80 transition-opacity cursor-pointer"
                                            >
                                                <MdSave size={16} />
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="p-1 bg-red-600 rounded hover:opacity-80 transition-opacity cursor-pointer"
                                            >
                                                <MdClose size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick(expense)}
                                            className={`p-1 rounded hover:opacity-80 transition-opacity ${
                                                editingExpense || isAdding || isEditing
                                                    ? "bg-gray-600 cursor-not-allowed hover:opacity-100"
                                                    : "bg-blue-600 cursor-pointer"
                                            }`}                                            disabled={!!editingExpense || isAdding || isEditing}
                                        >
                                            <MdEdit size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};