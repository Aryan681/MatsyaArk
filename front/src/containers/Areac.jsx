// src/containers/Areac.jsx
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const totalCoralCover =
      (payload.find((p) => p.dataKey === "coastal")?.value || 0) +
      (payload.find((p) => p.dataKey === "midwater")?.value || 0) +
      (payload.find((p) => p.dataKey === "deepwater")?.value || 0);

    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-orange-500 text-white shadow-xl text-sm opacity-95">
        <p className="text-orange-300 font-semibold text-lg mb-1">{`Latitude: ${label}°`}</p>
        <p className="text-gray-400 text-xs mb-2">Avg. Longitude: {dataPoint.avgLongitude.toFixed(1)}°</p>
        <p className="font-bold mb-2">Total Coral Cover: {totalCoralCover.toFixed(1)}%</p>
        <hr className="border-gray-700 my-2" />
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="my-1">
            {`${entry.name}: ${entry.value.toFixed(1)}%`}
          </p>
        ))}
        <p className="text-xs text-gray-400 mt-2">Use brush to zoom in!</p>
      </div>
    );
  }
  return null;
};

export default function Areac() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("/coral_density.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => {
            const groupedByLatitude = {};

            data.forEach((row) => {
              const lat = parseFloat(row["Latitude"]);
              const lon = parseFloat(row["Longitude"]);
              const coral = parseFloat(row["Live_Coral_Cover(%)"]);

              if (isNaN(lat) || isNaN(lon) || isNaN(coral)) return;

              const roundedLat = Math.round(lat * 2) / 2;
              const key = roundedLat.toFixed(1);

              if (!groupedByLatitude[key]) {
                groupedByLatitude[key] = {
                  latitude: roundedLat,
                  totalCoastal: 0,
                  totalMidwater: 0,
                  totalDeepwater: 0,
                  totalLongitudes: 0,
                  count: 0,
                };
              }

              groupedByLatitude[key].totalCoastal += coral;
              groupedByLatitude[key].totalMidwater += coral * 0.9;
              groupedByLatitude[key].totalDeepwater += coral * 0.7;
              groupedByLatitude[key].totalLongitudes += lon;
              groupedByLatitude[key].count += 1;
            });

            const processedData = Object.values(groupedByLatitude)
              .map((entry) => ({
                location: entry.latitude.toFixed(1),
                coastal: parseFloat((entry.totalCoastal / entry.count).toFixed(2)),
                midwater: parseFloat((entry.totalMidwater / entry.count).toFixed(2)),
                deepwater: parseFloat((entry.totalDeepwater / entry.count).toFixed(2)),
                avgLongitude: parseFloat((entry.totalLongitudes / entry.count).toFixed(2)),
              }))
              .sort((a, b) => parseFloat(a.location) - parseFloat(b.location));

            setChartData(processedData);
          },
        });
      });
  }, []);

  return (
    <div className="bg-[#01161E] h-full p-4 border border-cyan-400 text-white shadow-2xl overflow-hidden">
      <h2 className="text-xl font-bold mb-4 text-orange-400 text-center">
        Coral Cover Distribution by Latitude & Depth
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          stackOffset="expand"
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="colorCoastal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="colorMidwater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="colorDeepwater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="#4a5568" opacity={0.7} />
          <XAxis
            dataKey="location"
            stroke="#cbd5e1"
            tickLine={false}
            axisLine={{ stroke: "#475569" }}
            minTickGap={10}
            label={{
              value: "Latitude (°)",
              position: "bottom",
              fill: "#cbd5e1",
              fontSize: 15,
              fontWeight: 600,
              dy: 30,
            }}
          />
          <YAxis
            stroke="#cbd5e1"
            tickLine={false}
            axisLine={{ stroke: "#475569" }}
            tickFormatter={(val) => `${val.toFixed(0)}%`}
            domain={[0, 1]}
            label={{
              value: "Coral Cover Percentage",
              angle: -90,
              position: "center",
              dx: -40,
              fill: "#cbd5e1",
              fontSize: 15,
              fontWeight: 600,
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f97316", strokeWidth: 1.8 }} />
          <Legend
            verticalAlign="bottom"
            height={45}
            iconSize={12}
            iconType="square"
            wrapperStyle={{ paddingTop: "20px", color: "#e0e0e0", fontSize: 14 }}
          />

          <Area
            type="monotone"
            dataKey="coastal"
            stackId="1"
            stroke="#2563eb"
            fill="url(#colorCoastal)"
            name="Coastal Coral"
            activeDot={{ r: 7, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="midwater"
            stackId="1"
            stroke="#ea580c"
            fill="url(#colorMidwater)"
            name="Midwater Coral"
            activeDot={{ r: 7, fill: "#ea580c", stroke: "#fff", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="deepwater"
            stackId="1"
            stroke="#059669"
            fill="url(#colorDeepwater)"
            name="Deepwater Coral"
            activeDot={{ r: 7, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
          />

         <div style={{ display: "none" }}>
  <Brush
    dataKey="location"
    height={30}
    stroke="#f97316"
    fill="#f973161A"
    travellerWidth={15}
    gap={8}
    y={390}
  >
    <AreaChart>
      <Area type="monotone" dataKey="coastal" stroke="#2563eb" fill="#2563eb" />
    </AreaChart>
  </Brush>
</div>

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
