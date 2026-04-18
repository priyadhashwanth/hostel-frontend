import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import API from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";


export default function Reports() {
  const [report, setReport] = useState(null);
  const[monthlyData,setMonthlyData]=useState([]);

  //  Fetch report
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/reports");

        setReport(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReport();
  }, []);

  //monthly revenue

  useEffect(() => {
  const fetchMonthly = async () => {
    try {
      const res = await API.get("/reports/monthly-revenue");
      setMonthlyData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchMonthly();
}, []);

  //  Loading state
  if (!report) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
      </Layout>
    );
  }

  //  Bar chart data (normalized)
  const revenueData = [
    {
      name: "Revenue",
      value: report.revenue / 1000,
    },
    {
      name: "Expenses",
      value: report.totalExpenses / 1000,
    },
    {
      name: "Profit",
      value: report.profit / 1000,
    },
  ];

  //  Pie chart data (safe)
  const occupancyData = [
    {
      name: "Occupied",
      value: Number(report.occupancyRate.toFixed(2)),
    },
    {
      name: "Vacant",
      value: Number((100 - report.occupancyRate).toFixed(2)),
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"]; // green & red

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <h1 className="text-2xl font-bold">Reports 📊</h1>

        {/*  Financial Overview */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Financial Overview
          </h2>

         <BarChart
  width={600}
  height={350}
  data={revenueData}
  margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
>
  <XAxis dataKey="name" />
  <YAxis tickFormatter={(value) => `₹${value/100000}L`} />
  <Tooltip formatter={(value) => `₹${value}`} />
  <Bar dataKey="value" fill="#3b82f6" barSize={60} />
</BarChart>

        </div>

        {/*monthly revenue*/}

        <div className="bg-white p-6 rounded shadow">
  <h2 className="text-lg font-semibold mb-4">
    Monthly Revenue 📈
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={monthlyData}
    margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
  >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis  tickFormatter={(v)=>`₹${v/1000}k`}/>
      <Tooltip formatter={(value) => `₹${value}`} />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#3b82f6"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

        {/*  Occupancy */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Occupancy
          </h2>

          <PieChart width={500} height={350}>
            <Pie
              data={occupancyData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={({ name, value }) =>
                `${name}: ${value}%`
              }
            >
              {occupancyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </Layout>
  );
}