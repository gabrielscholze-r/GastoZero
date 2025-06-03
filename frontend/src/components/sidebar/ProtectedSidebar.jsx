import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { usePlans } from "../../hooks/usePlans.jsx";
import { useForm } from "react-hook-form";
import createPlan from "./Actions.jsx";
import { MdAdd, MdOutlineAccountCircle } from "react-icons/md";

export default function ProtectedSidebar({ setIsOpen, setPlan, selectedPlan }) {
  const navigate = useNavigate();
  const { data: plans = [], refetch } = usePlans();
  const [showModal, setShowModal] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createPlan(data);
      reset();
      setShowModal(false);
      await refetch();
    } catch (err) {
      console.error("Error creating plan:", err);
    }
  };

  const handleSetPlan = (plan) => {
    setPlan(plan);
    navigate("/plan");
    setIsOpen(false);
  };

  return (
    <>
      <NavLink
        to="/home"
        className="flex items-center gap-2 text-xl font-bold transition hover:opacity-70 cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <MdOutlineAccountCircle className="text-2xl" />
        Home
      </NavLink>

      <div>
        <button
          className="w-full flex items-center justify-between text-xl font-bold transition hover:opacity-70 py-1 cursor-pointer"
          onClick={() => setOpenPlan(!openPlan)}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗓️</span>
            <h1>Plans</h1>
          </div>
          <IoIosArrowForward
            className={`${
              openPlan ? "rotate-90" : ""
            } transition-transform text-2xl`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 my-2 ${
            openPlan
              ? "max-h-[500px] opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <button
            className="w-full text-left flex items-center gap-2 text-lg font-medium py-1 transition hover:opacity-70 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <MdAdd className="text-xl" /> Add plan
          </button>
          <div className="space-y-1 mt-2">
            {plans.map((planItem) => (
              <button
                key={planItem.id}
                onClick={() => handleSetPlan(planItem)}
                className={`w-full text-left py-1 text-lg font-medium transition hover:opacity-70 cursor-pointer
                                ${
                                  planItem.id === selectedPlan?.id
                                    ? "underline font-bold"
                                    : ""
                                }`}
              >
                {planItem.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <NavLink
        to="/reports"
        className="flex items-center gap-2 text-xl font-bold transition hover:opacity-70 cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <span className="text-2xl">📊</span>
        Reports
      </NavLink>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-containerbg text-textcontainerbg p-6 rounded-lg max-w-md w-full shadow-lg h-max z-[10000]">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-textcontainerbg border-opacity-20">
              New Plan
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div>
                <label
                  htmlFor="planName"
                  className="block text-textcontainerbg mb-1 font-semibold text-sm"
                >
                  Name
                </label>
                <input
                  id="planName"
                  {...register("name", { required: true })}
                  placeholder="Plan Name"
                  className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold transition duration-200 border border-transparent focus:border-gold"
                />
                {errors.name && (
                  <span className="text-red-400 text-sm mt-1 block">
                    Name is mandatory.
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="planDescription"
                  className="block text-textcontainerbg mb-1 font-semibold text-sm"
                >
                  Description
                </label>
                <textarea
                  id="planDescription"
                  {...register("description")}
                  placeholder="Description"
                  className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold resize-y min-h-[100px] transition duration-200 border border-transparent focus:border-gold"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowModal(false);
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-600 hover:opacity-80 transition duration-200 text-textcontainerbg font-semibold shadow-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:opacity-80 transition duration-200 text-textcontainerbg font-semibold shadow-md cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
