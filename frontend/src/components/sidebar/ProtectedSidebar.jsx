import React, { useState } from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {IoIosArrowForward} from 'react-icons/io';
import {usePlans} from '../../hooks/usePlans.jsx';
import {useForm} from 'react-hook-form';
import createPlan from './Actions.jsx';

export default function ProtectedSidebar({setIsOpen, setPlan, selectedPlan}) {
    const navigate = useNavigate();
    const {data: plans = [], refetch} = usePlans();
    const [showModal, setShowModal] = useState(false);
    const [openPlan, setOpenPlan] = useState(false);
    const {register, handleSubmit, reset, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        try {
            await createPlan(data);
            reset();
            setShowModal(false);
            await refetch();
        } catch (err) {
            console.error('Error creating plan:', err);
        }
    };

    const handleSetPlan = (plan) => {
        setPlan(plan);
        navigate('/plan');
    };

    return (
        <>
            <NavLink
                to="/home"
                className="block text-xl font-bold transition hover:cursor-pointer hover:opacity-70"
                onClick={() => setIsOpen(false)}
            >
                Home
            </NavLink>
            <div>
                <div
                    className="block text-xl font-bold transition hover:cursor-pointer hover:opacity-70 items-center"
                    onClick={() => setOpenPlan(!openPlan)}
                >
                    <div className="flex items-center">
                        <h1 className="text-xl">Plans</h1>
                        <IoIosArrowForward className={`${openPlan ? 'rotate-90' : ''} transition-transform`} />
                    </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out my-2 ${
                    openPlan ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <p
                        className="indent-4 my-2 p-1 hover:cursor-pointer hover:opacity-70"
                        onClick={() => setShowModal(true)}
                    >
                        Add plan
                    </p>
                    {plans.map((planItem) => (
                        <div key={planItem.id} onClick={() => handleSetPlan(planItem)}>
                            <p
                                className={`indent-4 my-2 p-1 hover:cursor-pointer hover:opacity-70 ${
                                    planItem.id === selectedPlan.id ? 'underline font-bold' : ''
                                }`}
                            >
                                {planItem.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <NavLink
                to="/reports"
                className="block text-xl font-bold transition hover:cursor-pointer hover:opacity-70"
                onClick={() => setIsOpen(false)}
            >
                Reports
            </NavLink>

            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-dark/80">
                    <div className="bg-containerbg text-white p-6 rounded-lg max-w-md shadow-lg h-2/4 w-2/4 z-[10000]">
                        <h2 className="text-xl font-semibold mb-4">New Plan</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Name</label>
                            <input
                                {...register('name', { required: true })}
                                placeholder="Plan Name"
                                className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
                            />
                            {errors.name && <span className="text-red-400 text-sm">Name is mandatory.</span>}
                            <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Description</label>
                            <textarea
                                {...register('description')}
                                placeholder="Description"
                                className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold resize-none min-h-[100px]"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => { reset(); setShowModal(false); }}
                                    className="px-4 py-2 rounded bg-gray-600 hover:bg-red-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
