import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export type ChartType = 'bar' | 'line' | 'doughnut' | 'pie';

interface ChartProps {
  type: ChartType;
  data: any;
  options?: any;
  className?: string;
}

// Pastikan export-nya sesuai dengan yang diimpor
export const ChartComponent = ({ type, data, options, className }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chartInstance = new Chart(canvasRef.current, {
      type,
      data,
      options,
    });

    return () => {
      chartInstance.destroy(); // Cleanup saat komponen di-unmount
    };
  }, [type, data, options]);

  return <canvas ref={canvasRef} className={className} />;
};
