import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useEffect, useState } from "react";

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#AF19FF", "#FF4560", "#4CAF50", "#FF66C4"
];

export default function ReportGraph({ name, data }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = data.reduce((acc, curr) => acc + curr.value, 0);
        setTotal(newTotal);
    }, [data]);

    return data && data.length > 0 ? (
        <div className="w-full h-[calc(100vh-500px)] mt-8">
            <h1 className="text-2xl text-center">{name}</h1>
            <h1 className="text-xl text-center mb-4">Total: $ {total.toFixed(2)}</h1>
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            cursor="pointer"
                            dataKey="value"
                            data={data}
                            innerRadius="30%"
                            outerRadius="80%"
                            label={({ name, percent, value }) =>
                                `${name}: ${(percent * 100).toFixed(0)}% | $ ${value.toFixed(2)}`
                            }
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`$ ${value.toFixed(2)}`, name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    ) : (
        <div className="text-center text-gray-500 mt-8">No data available to display.</div>
    );
}
