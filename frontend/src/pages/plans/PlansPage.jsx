import React from 'react';
import { usePlans } from '../../hooks/usePlans';

export default function PlansPage() {
    const { data: plans = [], isLoading, isError, error } = usePlans();

    if (isLoading) return <p>Carregando planos...</p>;
    if (isError)   return <p>Erro: {error.message}</p>;

    return (
        <div>
            <h1>Meus Plans</h1>
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>{plan.name}</li>
                ))}
            </ul>
        </div>
    );
}