import React from 'react';

export default function Grid({ width, height, xTicks, yTicks, xScale, yScale }) {
  return (
    <g stroke="#eee" strokeDasharray="4 2">
      {xTicks.map((tick, i) => (
        <line key={`x-${i}`} x1={xScale(tick)} x2={xScale(tick)} y1={0} y2={height} />
      ))}
      {yTicks.map((tick, i) => (
        <line key={`y-${i}`} x1={0} x2={width} y1={yScale(tick)} y2={yScale(tick)} />
      ))}
    </g>
  );
}

