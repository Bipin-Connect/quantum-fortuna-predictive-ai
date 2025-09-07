import React from 'react';

interface SliderProps {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  disabled?: boolean;
}

export function Slider({
  className = '',
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  disabled = false,
}: SliderProps) {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onValueChange([newValue]);
  };

  return (
    <div className={`relative w-full h-6 flex items-center ${className}`}>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleSliderChange}
        disabled={disabled}
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />
      <div
        className="absolute w-4 h-4 bg-white rounded-full shadow transform -translate-y-1/2 top-1/2"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
}