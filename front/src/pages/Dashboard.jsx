import React, { useEffect, useRef, memo, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lazy-load the chart components
const Heatmap = lazy(() => import('../containers/Heatmap'));
const OceanP = lazy(() => import('../containers/OceanP'));
const Areac = lazy(() => import('../containers/Areac'));
const FishP = lazy(() => import('../containers/FishP'));
const WaterQ = lazy(() => import('../containers/WaterQ'));

gsap.registerPlugin(ScrollTrigger);

const Dashboard = memo(() => {
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
      <div className="m-14">
        <div className="grid grid-cols-3 grid-rows-3 gap-4 pl-9 p-6">
          {/* Row 1 */}
          <Suspense fallback={<div>Loading Heatmap...</div>}>
            <div className="col-span-2 row-span-1 from-left">
              <Heatmap />
            </div>
          </Suspense>
          <Suspense fallback={<div>Loading OceanP...</div>}>
            <div className="col-span-1 row-span-1 overflow-hidden from-right">
              <OceanP />
            </div>
          </Suspense>

          {/* Row 2 */}
          <Suspense fallback={<div>Loading Areac...</div>}>
            <div className="col-span-3 row-span-1 popup">
              <Areac />
            </div>
          </Suspense>

          {/* Row 3 – Split into 2 equal columns */}
          <div className="col-span-3 grid grid-cols-2 gap-4">
            <Suspense fallback={<div>Loading FishP...</div>}>
              <div className="bg-teal-200 rounded-xl flex items-center justify-center from-left">
                <FishP />
              </div>
            </Suspense>
            <Suspense fallback={<div>Loading WaterQ...</div>}>
              <div className="bg-indigo-200 rounded-xl flex items-center justify-center from-right">
                <WaterQ />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;