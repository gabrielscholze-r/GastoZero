import React, { useState } from 'react';
import { usePlans } from '../../hooks/usePlans';
import { FiPlus } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import createPlan from './Actions'; // função POST

export default function PlansPage() {
    const { data: plans = [], isLoading, isError, error, refetch } = usePlans();
    const [showModal, setShowModal] = useState(false);

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
            console.error('Erro ao criar plano:', err);
        }
    };

    const PlanItem = ({ data }) => (
        <div className="w-full bg-zinc-800 text-white p-4 rounded mb-2 shadow-md">
            <h2 className="text-lg font-semibold">{data.name}</h2>
            <p>{data.description}</p>
            <p className="text-sm text-zinc-400">Total: R$ {data.totalAmount.toFixed(2)}</p>
        </div>
    );
    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center font-display">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex items-center justify-center font-display">
            <div className="w-2/3 h-2/3 bg-containerbg rounded p-4 overflow-y-auto relative">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-white">My Plans</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white"
                        title="Adicionar plano"
                    >
                        <FiPlus size={20} />
                    </button>
                </div>

                <ul>
                    {plans.map((plan) => (
                        <PlanItem data={plan} key={plan.id} />
                    ))}
                </ul>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-blue-dark/70 z-50">
                    <div className="bg-containerbg text-white p-6 rounded-lg w-full max-w-md shadow-lg h-2/4 w-2/4">
                        <h2 className="text-xl font-semibold mb-4">New Plan</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Name</label>
                            <div>
                                <input
                                    {...register('name', { required: true })}
                                    placeholder="Plan Name"
                                    className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
                                />
                                {errors.name && (
                                    <span className="text-red-400 text-sm">Name is mandatory.</span>
                                )}
                            </div>
                            <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Description</label>
                            <textarea
                                {...register('description')}
                                placeholder="Description"
                                className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold resize-none min-h-[100px]"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setShowModal(false);
                                    }}
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
        </div>
    );
}
