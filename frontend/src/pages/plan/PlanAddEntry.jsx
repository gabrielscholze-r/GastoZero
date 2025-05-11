import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { addExpense, addNewCategory } from "./Actions";
import { createPortal } from "react-dom";

export default function PlanAddEntry({
  onSave,
  onCancel,
  budgetId,
  categories,
  SetIsAdding,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const [categoryInput, setCategoryInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const inputRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(categoryInput.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categoryInput, categories]);

  useEffect(() => {
    if (showDropdown && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [showDropdown]);

  const onSubmit = async (data) => {
    let selectedCategory = categories.find((cat) => cat.name === categoryInput);
    if (!selectedCategory) {
      selectedCategory = await addNewCategory(categoryInput);
    }

    const result = await addExpense(
      {
        ...data,
        category_id: selectedCategory.id,
      },
      budgetId
    );

    if (result.success) {
      onSave(result.data);
      reset();
      setCategoryInput("");
      SetIsAdding(false);
    } else {
      console.error("Error saving expense:", result.error);
      alert(`Error: ${result.error}`);
    }
  };

  function DropdownPortal({ children }) {
    return createPortal(children, document.body);
  }

  return (
    <tr className="bg-zinc-800 relative z-50">
      <td className="p-2 w-[15%]">
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          className={`p-1 w-full rounded bg-bglight border ${
            errors.date ? "border-red-500" : "border-grayDark"
          } text-text`}
          form="plan-entry-form"
        />
        {errors.date && (
          <span className="text-red-500 text-xs">{errors.date.message}</span>
        )}
      </td>

      <td className="p-2 w-[30%]">
        <input
          type="text"
          placeholder="Description"
          {...register("description", {
            required: "Description is required",
          })}
          className={`p-1 w-full rounded bg-bglight border ${
            errors.description ? "border-red-500" : "border-grayDark"
          } text-text`}
          form="plan-entry-form"
        />
        {errors.description && (
          <span className="text-red-500 text-xs">
            {errors.description.message}
          </span>
        )}
      </td>

      <td className="p-2 w-[20%] relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Category"
          value={categoryInput}
          onChange={(e) => {
            setCategoryInput(e.target.value);
            setValue("category_input", e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className="p-1 w-full rounded bg-bglight border border-grayDark text-text"
          form="plan-entry-form"
        />

        {showDropdown && filteredCategories.length > 0 && (
          <DropdownPortal>
            <ul
              className="absolute z-50 bg-zinc-800 border border-gray-600 rounded shadow-lg max-h-40 overflow-y-auto"
              style={{
                position: "absolute",
                top: `${dropdownPos.top}px`,
                left: `${dropdownPos.left}px`,
                width: `${dropdownPos.width}px`,
              }}
            >
              {filteredCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="p-2 hover:bg-zinc-700 cursor-pointer"
                  onMouseDown={() => {
                    setCategoryInput(cat.name);
                    setValue("category_input", cat.name);
                    setShowDropdown(false);
                  }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </DropdownPortal>
        )}
      </td>

      <td className="p-2 w-[15%]">
        <input
          type="number"
          placeholder="R$ 0,00"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be greater than 0" },
          })}
          className={`p-1 w-full rounded bg-bglight border ${
            errors.amount ? "border-red-500" : "border-grayDark"
          } text-text`}
          form="plan-entry-form"
        />
        {errors.amount && (
          <span className="text-red-500 text-xs">{errors.amount.message}</span>
        )}
      </td>

      <td className="p-2 w-[20%]">
        <select
          {...register("is_recurring", {
            required: "Recurring option is required",
          })}
          className={`p-1 w-full rounded bg-bglight border ${
            errors.is_recurring ? "border-red-500" : "border-grayDark"
          } text-text`}
          form="plan-entry-form"
        >
          <option value="">Select...</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        {errors.is_recurring && (
          <span className="text-red-500 text-xs">
            {errors.is_recurring.message}
          </span>
        )}
      </td>

      <td className="hidden">
        <form id="plan-entry-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("category_input")} />
        </form>
      </td>
    </tr>
  );
}
