import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import Papa from "papaparse";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#0ea5e9", "#3b82f6", "#34d399", "#818cf8", "#60a5fa", "#a78bfa",
  "#38bdf8", "#22d3ee", "#2dd4bf", "#a5b4fc", "#93c5fd", "#67e8f9"
];

const CustomTooltip = memo(({ active, payload }) => {
  if (!active || !payload || !payload.length || !payload[0]?.payload) return null;

  const data = payload[0].payload;
  const { Pollution_Type, Amount_Tonnes, percentage } = data;

  return (
    <div
      className="bg-[#031a24] border border-cyan-500/50 rounded-lg p-3 shadow-xl backdrop-blur-sm"
      style={{
        background: 'radial-gradient(circle at top left, rgba(6,78,118,0.3) 0%, rgba(3,26,36,0.9) 70%)',
        boxShadow: '0 0 15px rgba(14,165,233,0.4)',
        border: '1px solid rgba(14,165,233,0.3)',
        minWidth: '160px',
      }}
    >
      <div className="text-cyan-300 font-bold text-sm mb-1">{Pollution_Type || 'Unknown'}</div>
      <div className="text-white text-base font-semibold">
        {(Amount_Tonnes || 0)?.toLocaleString()} Tonnes
      </div>
      {percentage !== undefined && !isNaN(percentage) && (
        <div className="text-cyan-100 text-xs mt-1">
          {percentage.toFixed(2)}% of total
        </div>
      )}
    </div>
  );
});

const OceanP = memo(() => {
  const [rawData, setRawData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndParseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/ocean_pollution.csv");
      if (!res.ok) {
        throw new Error("Failed to fetch data.");
      }
      const csv = await res.text();
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => {
          setRawData(data);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error loading data:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndParseData();
  }, [fetchAndParseData]);

  const { chartData, totalAmount } = useMemo(() => {
    const parsed = rawData
      .map((d) => ({
        Pollution_Type: d.Pollution_Type,
        Amount_Tonnes: parseInt(d.Amount_Tonnes),
      }))
      .filter((d) => d.Pollution_Type && !isNaN(d.Amount_Tonnes));

    const total = parsed.reduce((acc, d) => acc + d.Amount_Tonnes, 0);
    const enriched = parsed.map((d) => ({
      ...d,
      percentage: (d.Amount_Tonnes / total) * 100,
    }));

    return { chartData: enriched, totalAmount: total };
  }, [rawData]);

  const handleEnter = useCallback((data, index) => {
    setHovered(data);
    setActiveIndex(index);
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(null);
    setActiveIndex(null);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden rounded-lg border border-cyan-400 bg-gradient-to-br from-[#001728] to-[#003050] text-white shadow-xl flex flex-col p-2 relative">
      <div className="absolute top-2 left-3 z-10">
        <h2 className="text-sm md:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 inline">
          Ocean Pollutants
        </h2>
      </div>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex justify-center items-center">
          <p className="text-cyan-200/80 text-sm">No data available</p>
        </div>
      ) : (
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 1 }]}
                dataKey="value"
                outerRadius="60%"
                fill="#00233b"
                stroke="#0c4a6e"
                strokeWidth={1}
                isAnimationActive={false}
              />
              <Pie
                data={chartData}
                dataKey="Amount_Tonnes"
                nameKey="Pollution_Type"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                isAnimationActive
                animationDuration={400}
              >
                {chartData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                    stroke={activeIndex === idx ? "#ecfeff" : "#0891b2"}
                    strokeWidth={activeIndex === idx ? 2 : 1}
                    style={{
                      filter: activeIndex === idx
                        ? `drop-shadow(0 0 8px ${COLORS[idx % COLORS.length]})`
                        : "none",
                      transform: activeIndex === idx ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center center",
                      transition: "transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease",
                      opacity: activeIndex === null ? 1 : activeIndex === idx ? 1 : 0.5,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#f0f9ff"
                fontSize={hovered ? 18 : 22}
                fontWeight="bold"
              >
                {hovered ? hovered.Amount_Tonnes?.toLocaleString() : totalAmount?.toLocaleString()}
              </text>
              <text
                x="50%"
                y="50%"
                dy="1.5em"
                textAnchor="middle"
                fill="#a5f3fc"
                fontSize={hovered ? 11 : 13}
              >
                {hovered ? hovered.Pollution_Type : "Total Tonnes"}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-1 mt-2 overflow-auto text-xs">
        {chartData.map((entry, idx) => (
          <div
            key={`legend-${idx}`}
            className="flex items-center px-2 py-1 rounded-full border cursor-default transition-all duration-200"
            style={{
              backgroundColor: activeIndex === idx ? "#083344" : "#082f49",
              borderColor: activeIndex === idx ? "#06b6d4" : "#164e63",
            }}
            onMouseEnter={() => handleEnter(entry, idx)}
            onMouseLeave={handleLeave}
          >
            <div
              className="w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            ></div>
            {entry.Pollution_Type}
          </div>
        ))}
      </div>
    </div>
  );
});

export default OceanP;