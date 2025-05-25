import {
    PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area,
    Treemap, ResponsiveContainer, Tooltip, Cell,
    XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { useEffect, useState } from "react";

const COLORS = [
    '#4E79A7', '#F28E2B', '#E15759', '#76B7B2',
    '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7',
    '#9C755F', '#BAB0AC', '#1B9E77', '#D95F02',
    '#7570B3', '#E7298A', '#66A61E', '#E6AB02'
];

const textColor = '#ffffff'; // Changed to white
const axisColor = '#ffffff'; // Changed to white
const gridColor = '#444444'; // Darker grid for better contrast with white text

export default function ReportGraph({ name, data, type }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = data.reduce((acc, curr) => acc + curr.value, 0);
        setTotal(newTotal);
    }, [data]);

    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 mt-8">No data available to display.</div>;
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const renderChart = () => {
        switch (type) {
            case "pie":
                return (
                    <PieChart>
                        <Pie
                            dataKey="value"
                            data={data}
                            innerRadius="35%"
                            outerRadius="80%"
                            label={renderCustomizedLabel} // Using the custom label function
                            labelLine={false}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#ffffff"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #555555',
                                borderRadius: '4px',
                                color: '#ffffff'
                            }}
                        />
                        <Legend
                            wrapperStyle={{ color: '#ffffff' }}
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                        />
                    </PieChart>
                );
            case "bar":
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: axisColor }}
                            tickMargin={10}
                        />
                        <YAxis
                            tick={{ fill: axisColor }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #555555',
                                borderRadius: '4px',
                                color: '#ffffff'
                            }}
                        />
                        <Legend
                            wrapperStyle={{ color: '#ffffff' }}
                        />
                        <Bar dataKey="value">
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#ffffff"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                );
            case "line":
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: axisColor }}
                            tickMargin={10}
                        />
                        <YAxis
                            tick={{ fill: axisColor }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #555555',
                                borderRadius: '4px',
                                color: '#ffffff'
                            }}
                        />
                        <Legend
                            wrapperStyle={{ color: '#ffffff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={COLORS[0]}
                            strokeWidth={2}
                            dot={{ fill: COLORS[0], strokeWidth: 1, r: 4 }}
                            activeDot={{ r: 6, stroke: COLORS[0], strokeWidth: 2 }}
                        />
                    </LineChart>
                );
            case "area":
                return (
                    <AreaChart data={data}>
                        <defs>
                            {data.map((_, index) => (
                                <linearGradient key={`gradient-${index}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS[index]} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={COLORS[index]} stopOpacity={0}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: axisColor }}
                            tickMargin={10}
                        />
                        <YAxis
                            tick={{ fill: axisColor }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                            contentStyle={{
                                backgroundColor: '#333333',
                                border: '1px solid #555555',
                                borderRadius: '4px',
                                color: '#ffffff'
                            }}
                        />
                        <Legend
                            wrapperStyle={{ color: '#ffffff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={COLORS[0]}
                            fill={`url(#color-0)`}
                            fillOpacity={1}
                        />
                    </AreaChart>
                );
            case "treemap":
                return (
                    <Treemap
                        data={data}
                        dataKey="value"
                        ratio={4 / 3}
                        stroke="#ffffff"
                        content={({ x, y, width, height, name, value }) => (
                            <g>
                                <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    fill={COLORS[data.findIndex(item => item.name === name) % COLORS.length]}
                                    stroke="#ffffff"
                                />
                                <text
                                    x={x + width / 2}
                                    y={y + height / 2}
                                    textAnchor="middle"
                                    fill="#ffffff"
                                    fontSize={14}
                                    fontWeight="bold"
                                >
                                    {`${name}`}
                                </text>
                            </g>
                        )}
                    />
                );
            default:
                return <div className="text-center text-gray-400">Unknown chart type</div>;
        }
    };

    return (
        <div className="w-full h-[calc(100vh-500px)] mt-8">
            <h1 className="text-2xl text-center font-bold text-white">{name}</h1>
            <h1 className="text-xl text-center mb-4 font-semibold text-white">Total: ${total.toFixed(2)}</h1>
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}