import React, { useEffect, useState, useRef, memo } from "react";
import Papa from "papaparse";

const Heatmap = memo(() => {
  const [matrix, setMatrix] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("/seafloor_temperature_drift.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: ({ data: parsed }) => {
            const values = parsed
              .filter(
                (row) =>
                  row["Year"] && row["Global_Benthic_Temp_Anomaly(°C)"]
              )
              .map((row) => ({
                year: row["Year"],
                value: parseFloat(
                  row["Global_Benthic_Temp_Anomaly(°C)"]
                ),
              }));

            const chunkSize = 10;
            const matrixData = [];
            for (let i = 0; i < values.length; i += chunkSize) {
              matrixData.push(values.slice(i, i + chunkSize));
            }

            setMatrix(matrixData);
          },
        });
      });
  }, []);

  const getColor = (val) => {
    if (val < 0.2) return "bg-green-400";
    if (val < 0.4) return "bg-yellow-400";
    if (val < 0.6) return "bg-orange-400";
    if (val < 0.8) return "bg-red-500";
    return "bg-red-700";
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#01161E] p-4 rounded-lg border border-cyan-400 text-white h-full w-full overflow-hidden flex flex-col relative"
    >
      <h2 className="text-lg font-bold mb-3 text-cyan-300 text-center">
        Seafloor Temperature Anomaly (1955–2054)
      </h2>

      <div className="flex-1 overflow-auto border border-cyan-900 rounded">
        <table className="table-fixed w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2 border border-cyan-800 bg-cyan-800 text-xs w-20">
                Decade
              </th>
              {Array.from({ length: 10 }, (_, i) => (
                <th
                  key={i}
                  className="p-1 border border-cyan-800 text-cyan-200 w-10"
                >
                  Y{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-2 py-1 border border-cyan-800 text-cyan-300 font-semibold">
                  {row[0]?.year?.slice(0, 3)}0s
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`relative w-10 h-10 border border-cyan-800 text-center text-[10px] font-bold text-black cursor-pointer hover:scale-105 hover:shadow-md transition transform ${getColor(
                      cell.value
                    )}`}
                    onMouseEnter={() =>
                      setHoveredCell({ ...cell, rowIndex, colIndex })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {(cell.value * 100).toFixed(0)}%
                    {hoveredCell &&
                      hoveredCell.rowIndex === rowIndex &&
                      hoveredCell.colIndex === colIndex && (
                        <div
                          className="absolute z-50 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none -top-10 left-1/2 transform -translate-x-1/2"
                        >
                          <strong>Year:</strong> {hoveredCell.year}
                          <br />
                          <strong>Anomaly:</strong> {hoveredCell.value.toFixed(2)}°C
                        </div>
                      )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default Heatmap;