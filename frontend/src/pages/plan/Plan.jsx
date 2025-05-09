import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';

export default function Plan({data}) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) {
            navigate('/home');
        }
    }, [data, navigate]);

    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{type: 'tween', duration: 0.4}}
            className="h-screen w-full flex items-center justify-center"
        >
            <div className="w-2/3 h-2/3 bg-containerbg rounded p-6 text-white z-50 shadow-lg overflow-y-auto">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{data.name}</h2>
                </div>
                <p className="mb-2 text-lg">{data.description}</p>
                <p className="text-sm text-zinc-400">Total: R$ {data.totalAmount.toFixed(2)}</p>
            </div>
        </motion.div>
    );
}