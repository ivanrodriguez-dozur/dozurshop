import React, { useEffect, useState } from 'react';

export default function ProgressBarFeedback({ percent, loading }: { percent: number; loading: boolean }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < percent) return prev + 1;
          clearInterval(interval);
          return percent;
        });
      }, 15);
      return () => clearInterval(interval);
    } else {
      setProgress(percent);
    }
  }, [percent, loading]);

  return (
    <div className="w-full max-w-xs mt-4">
      <div className="h-6 bg-yellow-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-6 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-lg font-bold mt-1 text-yellow-700">{progress}%</div>
    </div>
  );
}
