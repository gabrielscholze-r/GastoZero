import React, { useState } from 'react';
import { usePlans } from '../../hooks/usePlans';
import { FiPlus } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import createPlan from './Actions';
import { AnimatePresence, motion } from 'framer-motion';
import Plan from '../plan/Plan.jsx';

export default function PlansPage() {
    const { data: plans = [], isLoading, refetch } = usePlans();
    const [showModal, setShowModal] = useState(false);
    const [activePlan, setActivePlan] = useState(false);

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
            console.error('Error creating plan:', err);
        }
    };

    const handleOpenPlan = (plan) => {
        setActivePlan(plan);
    };

    const PlanItem = ({ data }) => (
        <div
            onClick={() => handleOpenPlan(data)}
            className="w-full bg-zinc-800 text-white p-4 rounded mb-2 shadow-md hover:cursor-pointer hover:opacity-90 transition-opacity"
        >
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
        <div className="h-screen w-full flex items-center justify-center font-display relative overflow-hidden">
            <AnimatePresence>
                {!activePlan && (
                    <motion.div
                        key="plans-page"
                        initial={{ x: 0 }}
                        animate={{ x: 0 }}
                        exit={{ x: '-200%' }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        className="absolute w-2/3 h-2/3 bg-containerbg rounded p-4 overflow-y-auto"
                    >
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
                    </motion.div>
                )}

                {activePlan && (
                    <Plan data={activePlan} onClose={() => setActivePlan(null)} />
                )}
            </AnimatePresence>


        </div>
    );
}
