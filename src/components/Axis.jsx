import React from 'react';

export default function Axis({ scale, ticks, isVertical, size, font = '10px sans-serif', format = v => v }) {
  return (
    <g>
      {ticks.map((tick, i) => {
        const pos = scale(tick);
        return isVertical ? (
          <g key={i}>
            <line x1={0} x2={-6} y1={pos} y2={pos} stroke="black" />
            <text x={-8} y={pos + 4} fontSize={font} textAnchor="end">
              {format(tick)}
            </text>
          </g>
        ) : (
          <g key={i}>
            <line x1={pos} x2={pos} y1={size} y2={size + 6} stroke="black" />
            <text x={pos} y={size + 18} fontSize={font} textAnchor="middle">
              {format(tick)}
            </text>
          </g>
        );
      })}
    </g>
  );
}
