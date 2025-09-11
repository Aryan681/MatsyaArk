import React, { useEffect, useRef, memo, lazy, Suspense, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Papa from 'papaparse';

// Lazy-load the chart components
const Heatmap = lazy(() => import('../containers/Heatmap'));
const OceanP = lazy(() => import('../containers/OceanP'));
const Areac = lazy(() => import('../containers/Areac'));
const FishP = lazy(() => import('../containers/FishP'));
const WaterQ = lazy(() => import('../containers/WaterQ'));

gsap.registerPlugin(ScrollTrigger);

const Dashboard = memo(() => {
  const dashboardRef = useRef();
  const [data, setData] = useState({
    heatmap: null,
    oceanp: null,
    areac: null,
    fishp: null,
    waterq: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Centralized data fetching
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [heatmapRes, oceanpRes, areacRes, fishpRes, waterqRes] = await Promise.all([
          fetch('/seafloor_temperature_drift.csv'),
          fetch('/ocean_pollution.csv'),
          fetch('/coral_density.csv'),
          fetch('/fish_population.csv'),
          fetch('/water_quality.csv'),
        ]);

        const [heatmapText, oceanpText, areacText, fishpText, waterqText] = await Promise.all([
          heatmapRes.text(),
          oceanpRes.text(),
          areacRes.text(),
          fishpRes.text(),
          waterqRes.text(),
        ]);
        
        // Process data (simplified for example, you'd move full logic here)
        const parsedHeatmap = Papa.parse(heatmapText, { header: true, skipEmptyLines: true }).data;
        const parsedOceanp = Papa.parse(oceanpText, { header: true, skipEmptyLines: true }).data;
        const parsedAreac = Papa.parse(areacText, { header: true, skipEmptyLines: true }).data;
        const parsedFishp = Papa.parse(fishpText, { header: true, skipEmptyLines: true }).data;
        const parsedWaterq = Papa.parse(waterqText, { header: true, skipEmptyLines: true }).data;

        setData({
          heatmap: parsedHeatmap,
          oceanp: parsedOceanp,
          areac: parsedAreac,
          fishp: parsedFishp,
          waterq: parsedWaterq,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      // Animate left-sided items
      gsap.utils.toArray('.from-left').forEach((el) => {
        gsap.from(el, {
          x: -150,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Animate right-sided items
      gsap.utils.toArray('.from-right').forEach((el) => {
        gsap.from(el, {
          x: 150,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Animate center pop-up
      gsap.from('.popup', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.popup',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, [isLoading]); // Rerun GSAP when loading is complete

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading Dashboard...</div>;
  }

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen w-full bg-[#00141c] text-white overflow-auto"
    >
      <div className="m-14">
        <div className="grid grid-cols-3 grid-rows-3 gap-4 pl-9 p-6">
          {/* Row 1 */}
          <div className="col-span-2 row-span-1 from-left">
            <Heatmap rawData={data.heatmap} />
          </div>
          <div className="col-span-1 row-span-1 overflow-hidden from-right">
            <OceanP rawData={data.oceanp} />
          </div>

          {/* Row 2 */}
          <div className="col-span-3 row-span-1 popup">
            <Areac rawData={data.areac} />
          </div>

          {/* Row 3 – Split into 2 equal columns */}
          <div className="col-span-3 grid grid-cols-2 gap-4">
            <div className="bg-teal-200 rounded-xl flex items-center justify-center from-left">
              <FishP rawData={data.fishp} />
            </div>
            <div className="bg-indigo-200 rounded-xl flex items-center justify-center from-right">
              <WaterQ rawData={data.waterq} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;