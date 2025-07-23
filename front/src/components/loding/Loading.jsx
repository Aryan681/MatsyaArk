import React from 'react';

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <video
        src="/Loding.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-68 h-68 object-contain"
      />
    </div>
  );
}
