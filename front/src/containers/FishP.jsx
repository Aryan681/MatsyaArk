import React, { useEffect, useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalPopulation = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
    const visiblePayload = payload.filter(entry => entry.value > 0);

    return (
      <div className="bg-gray-800 p-3 rounded-md border border-cyan-500 text-white shadow-xl text-sm opacity-95 max-w-sm">
        <p className="text-cyan-300 font-semibold">{`Region: ${label}`}</p>
        <hr className="border-gray-700 my-2" />
        {totalPopulation > 0 && (
          <p className="font-bold mb-2 text-cyan-100">
            Total Population: <span className="text-white">{totalPopulation.toLocaleString()}</span>
          </p>
        )}
        <div className="max-h-40 overflow-y-auto pr-2">
          {visiblePayload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between my-1">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </span>
              <span>{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function FishP() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [visibleSpecies, setVisibleSpecies] = useState({});
  const [activeBar, setActiveBar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const colorPalette = useMemo(() => ([
    "#3b82f6", "#60a5fa", "#0ea5e9", "#38bdf8", "#a855f7",
    "#d946ef", "#f43f5e", "#ef4444", "#f59e0b", "#facc15",
    "#10b981", "#0d9488", "#84cc16", "#14b8a6", "#06b6d4"
  ]), []);

  const processData = useCallback(() => {
    const grouped = {};
    rawData.forEach(({ Region, Species, Population_Estimate }) => {
      if (!grouped[Region]) grouped[Region] = { region: Region, totalPopulation: 0 };
      const count = parseInt(Population_Estimate);
      if (!isNaN(count)) {
        grouped[Region][Species] = (grouped[Region][Species] || 0) + count;
        grouped[Region].totalPopulation += count;
      }
    });

    const result = Object.values(grouped)
      .sort((a, b) => b.totalPopulation - a.totalPopulation)
      .slice(0, 10);

    setProcessedData(result);
    setIsLoading(false);
  }, [rawData]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/fish_population.csv")
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => {
            setRawData(data);
            const speciesSet = new Set();
            data.forEach(row => speciesSet.add(row.Species));
            const uniqueSpecies = Array.from(speciesSet);
            setAvailableSpecies(uniqueSpecies);

            const visibilityMap = {};
            uniqueSpecies.forEach(s => visibilityMap[s] = true);
            setVisibleSpecies(visibilityMap);
          }
        });
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (rawData.length) processData();
  }, [rawData, processData]);

  const CustomLegend = useCallback(({ payload }) => (
    <div className="flex flex-wrap justify-center gap-3 mt-2 px-2 text-xs">
      {payload.map((entry, index) => {
        const isVisible = visibleSpecies[entry.dataKey];
        const isActive = activeBar === entry.dataKey;

        return (
          <button
            key={`legend-${index}`}
            onClick={() =>
              setVisibleSpecies(prev => ({ ...prev, [entry.dataKey]: !prev[entry.dataKey] }))
            }
            onMouseEnter={() => setActiveBar(entry.dataKey)}
            onMouseLeave={() => setActiveBar(null)}
            className={`
              flex items-center space-x-2 px-2 py-1 rounded-full transition
              ${isVisible ? 'text-white' : 'text-gray-400'}
              ${isActive ? 'border-b-2 border-cyan-400' : ''}
            `}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: entry.color,
                opacity: isVisible ? 1 : 0.5,
                transform: isActive ? 'scale(1.3)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            ></span>
            <span>{entry.value}</span>
          </button>
        );
      })}
    </div>
  ), [visibleSpecies, activeBar]);

  const handleBarClick = (data, index) => {
    const regionData = processedData.find(item => item.region === data.region);
    const species = availableSpecies[index];
    const value = regionData[species] || 0;

    alert(`Detailed Info:\n\nRegion: ${data.region}\nSpecies: ${species}\nPopulation: ${value.toLocaleString()}`);
  };

  return (
    <div className="w-full rounded-lg border border-cyan-400 h-full overflow-hidden bg-[#010e13] p-4 l">
      <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-3 text-center">
        🐟 Fish Population by Ocean Region
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : processedData.length === 0 ? (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400">No data available. Please check your data source.</p>
        </div>
      ) : (
        <div className="w-full h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 10, right: 20, left: 20, bottom: 70 }}
              onMouseLeave={() => setActiveBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis
                dataKey="region"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={{ stroke: "#475569" }}
                angle={-40}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke="#94a3b8"
                tickLine={false}
                axisLine={{ stroke: "#475569" }}
                width={70}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              {availableSpecies.map((species, index) => visibleSpecies[species] && (
                <Bar
                  key={species}
                  dataKey={species}
                  name={species}
                  onClick={handleBarClick}
                  onMouseEnter={() => setActiveBar(species)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  {processedData.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={colorPalette[index % colorPalette.length]}
                      opacity={
                        activeBar === null ? 1 :
                        activeBar === species ? 1 :
                        activeBar === entry.region ? 1 : 0.3
                      }
                      stroke={activeBar === species ? '#fff' : 'none'}
                      strokeWidth={activeBar === species ? 1 : 0}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
