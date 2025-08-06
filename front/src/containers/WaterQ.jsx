import React, { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dateLabel = new Date(label).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return (
      <div className="bg-[#031a24] p-4 rounded-md border border-cyan-400 text-white shadow-lg text-sm">
        <p className="text-cyan-300 font-bold mb-2">{`📅 ${dateLabel}`}</p>
        <hr className="border-[#0f2f3d] mb-2" />
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="mb-1">
            {`${entry.name}: ${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WaterQ() {
  const [data, setData] = useState([]);
  const [visibleLines, setVisibleLines] = useState({
    temperature: true,
    salinity: true,
    oxygen: true,
    ph: true,
  });

  useEffect(() => {
    fetch("/water_quality.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => {
            const formatted = data
              .map((row) => {
                const date = new Date(row["Date"]);
                if (isNaN(date)) return null;
                return {
                  date: date.getTime(),
                  temperature: parseFloat(row["Temperature(°C)"]),
                  salinity: parseFloat(row["Salinity(PSU)"]),
                  oxygen: parseFloat(row["Dissolved_Oxygen(mg/L)"]),
                  ph: parseFloat(row["pH"]),
                };
              })
              .filter(Boolean)
              .sort((a, b) => a.date - b.date);
            setData(formatted);
          },
        });
      });
  }, []);

  const handleLineToggle = useCallback((dataKey) => {
    setVisibleLines((prev) => ({ ...prev, [dataKey]: !prev[dataKey] }));
  }, []);

  return (
    <div className="h-full w-full p-7 rounded-lg border border-cyan-400 bg-[#010e13]  shadow-xl overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-4 text-center">
        🌊 Water Quality Trends
      </h2>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[
          { key: "temperature", label: "🌡 Temp (°C)", color: "bg-rose-600" },
          { key: "salinity", label: "🧂 Salinity (PSU)", color: "bg-blue-600" },
          { key: "oxygen", label: "💧 Oxygen (mg/L)", color: "bg-emerald-500" },
          { key: "ph", label: "⚗️ pH", color: "bg-yellow-500" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => handleLineToggle(key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              visibleLines[key]
                ? `${color} text-white`
                : "bg-gray-700 text-gray-400 border border-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-full min-h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              type="number"
              domain={["auto", "auto"]}
              scale="time"
              tickFormatter={(tick) =>
                new Date(tick).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })
              }
              stroke="#94a3b8"
              angle={-30}
              height={60}
              textAnchor="end"
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              label={{
                value: "Date",
                position: "insideBottom",
                dy: 30,
                fill: "#94a3b8",
                fontWeight: 600,
                fontSize: 14,
              }}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              label={{
                value: "Parameter Value",
                angle: -90,
                position: "insideLeft",
                dx: -10,
                fill: "#94a3b8",
                fontSize: 14,
                fontWeight: 600,
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#0ea5e9", strokeWidth: 1.5 }}
            />

            {visibleLines.temperature && (
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={false}
                name="Temperature (°C)"
              />
            )}
            {visibleLines.salinity && (
              <Line
                type="monotone"
                dataKey="salinity"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                name="Salinity (PSU)"
              />
            )}
            {visibleLines.oxygen && (
              <Line
                type="monotone"
                dataKey="oxygen"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                name="Dissolved Oxygen"
              />
            )}
            {visibleLines.ph && (
              <Line
                type="monotone"
                dataKey="ph"
                stroke="#eab308"
                strokeWidth={3}
                dot={false}
                name="pH"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
