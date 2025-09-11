import React, { useEffect, useRef, lazy, Suspense, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Use React.lazy for code-splitting
const Heatmap = lazy(() => import('../containers/Heatmap'));
const OceanP = lazy(() => import('../containers/OceanP'));
const Areac = lazy(() => import('../containers/Areac'));
const FishP = lazy(() => import('../containers/FishP'));
const WaterQ = lazy(() => import('../containers/WaterQ'));

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger);

// Memoize the components to prevent unnecessary re-renders
const MemoizedHeatmap = memo(Heatmap);
const MemoizedOceanP = memo(OceanP);
const MemoizedAreac = memo(Areac);
const MemoizedFishP = memo(FishP);
const MemoizedWaterQ = memo(WaterQ);

export default function Dashboard() {
  const dashboardRef = useRef();

  useEffect(() => {
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

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen w-full bg-[#00141c] text-white overflow-auto"
    >
      <div className='m-14'>
        <div className="grid grid-cols-3 grid-rows-3 gap-4 pl-9 p-6">
          <Suspense fallback={<div>Loading...</div>}>
            {/* Row 1 */}
            <div className="col-span-2 row-span-1 from-left">
              <MemoizedHeatmap />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden from-right">
              <MemoizedOceanP />
            </div>

            {/* Row 2 */}
            <div className="col-span-3 row-span-1 popup">
              <MemoizedAreac />
            </div>

            {/* Row 3 – Split into 2 equal columns */}
            <div className="col-span-3 grid grid-cols-2 gap-4">
              <div className="bg-teal-200 rounded-xl flex items-center justify-center from-left">
                <MemoizedFishP />
              </div>
              <div className="bg-indigo-200 rounded-xl flex items-center justify-center from-right">
                <MemoizedWaterQ />
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}