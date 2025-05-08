import { motion } from 'framer-motion';

export default function Plan({ data}) {
    return (
        <motion.div
            initial={{ x: '200%' }}
            animate={{ x: 0 }}
            exit={{ x: '200%' }}
            transition={{ type: 'tween', duration: 0.4}}
            className="fixed w-2/3 h-2/3 bg-zinc-900 rounded p-6 text-white z-50 shadow-lg overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{data.name}</h2>
            </div>
            <p className="mb-2 text-lg">{data.description}</p>
            <p className="text-sm text-zinc-400">Total: R$ {data.totalAmount.toFixed(2)}</p>
        </motion.div>
    );
}
