    import { useEffect, useState } from "react";
    import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, BarChart, Bar
    } from "recharts";
    import Layout from '../../components/Layout';
    import api from "../../utils/api";
    import "./Energi.css";

    export default function Energi() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/dashboard/stats")
        .then(res => {
            setData(res.data.data.chart || []);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    const total = data.reduce((sum, d) => sum + (d.energi_gwh || 0), 0);
    const rata = data.length ? (total / data.length).toFixed(1) : 0;
    const tertinggi = data.length ? Math.max(...data.map(d => d.energi_gwh || 0)).toFixed(1) : 0;

    if (loading) return <div className="energi-container">Memuat data...</div>;

    return (
        <Layout title="" subtitle="">
            {
            <div className="energi-container">
            <div className="energi-header">
                <h1>⚡ Monitor Konsumsi Energi</h1>
                <p>Data konsumsi energi kota per bulan dalam satuan GWh</p>
            </div>

            <div className="energi-stats">
                <div className="stat-box">
                <div className="nilai">{total.toFixed(1)}</div>
                <div className="label">Total GWh (2024)</div>
                </div>
                <div className="stat-box">
                <div className="nilai">{rata}</div>
                <div className="label">Rata-rata/Bulan</div>
                </div>
                <div className="stat-box">
                <div className="nilai">{tertinggi}</div>
                <div className="label">Konsumsi Tertinggi</div>
                </div>
            </div>

            <div className="energi-card">
                <h2>Grafik Konsumsi Energi Bulanan</h2>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                    <XAxis dataKey="bulan" stroke="#aaaaaa" />
                    <YAxis stroke="#aaaaaa" />
                    <Tooltip
                    contentStyle={{ background: "#0D1F3C", border: "1px solid #C9A84C" }}
                    labelStyle={{ color: "#C9A84C" }}
                    />
                    <Legend />
                    <Line
                    type="monotone"
                    dataKey="energi_gwh"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    dot={{ fill: "#C9A84C" }}
                    name="Energi (GWh)"
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="energi-card">
                <h2>Perbandingan Konsumsi Per Bulan</h2>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                    <XAxis dataKey="bulan" stroke="#aaaaaa" />
                    <YAxis stroke="#aaaaaa" />
                    <Tooltip
                    contentStyle={{ background: "#0D1F3C", border: "1px solid #C9A84C" }}
                    labelStyle={{ color: "#C9A84C" }}
                    />
                    <Bar dataKey="energi_gwh" fill="#C9A84C" name="Energi (GWh)" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
            }
        </Layout>
    );
    }