import React from 'react';
import Svg, { Rect, Circle, Line, G } from 'react-native-svg';

interface AppIconProps {
  size?: number;
}

export function AppIcon({ size = 200 }: AppIconProps) {
  const s = size;
  const pad = s * 0.02;
  const shadow = s * 0.04;
  const border = s * 0.035;
  const cornerR = s * 0.18;

  // Clock dimensions
  const cx = s * 0.48;
  const cy = s * 0.48;
  const clockR = s * 0.28;
  const dotR = s * 0.025;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {/* Shadow rectangle */}
      <Rect
        x={pad + shadow}
        y={pad + shadow}
        width={s - pad * 2 - shadow}
        height={s - pad * 2 - shadow}
        rx={cornerR}
        ry={cornerR}
        fill="#1A1A2E"
      />

      {/* Main background */}
      <Rect
        x={pad}
        y={pad}
        width={s - pad * 2 - shadow}
        height={s - pad * 2 - shadow}
        rx={cornerR}
        ry={cornerR}
        fill="#FFF8E7"
        stroke="#1A1A2E"
        strokeWidth={border}
      />

      {/* Clock face */}
      <Circle
        cx={cx}
        cy={cy}
        r={clockR}
        fill="#FF6B9D"
        stroke="#1A1A2E"
        strokeWidth={border}
      />

      {/* Inner clock circle */}
      <Circle
        cx={cx}
        cy={cy}
        r={clockR * 0.82}
        fill="#FFF8E7"
        stroke="#1A1A2E"
        strokeWidth={border * 0.6}
      />

      {/* Hour marks (12, 3, 6, 9) */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const inner = clockR * 0.62;
        const outer = clockR * 0.74;
        return (
          <Line
            key={angle}
            x1={cx + Math.cos(rad) * inner}
            y1={cy + Math.sin(rad) * inner}
            x2={cx + Math.cos(rad) * outer}
            y2={cy + Math.sin(rad) * outer}
            stroke="#1A1A2E"
            strokeWidth={border * 0.8}
            strokeLinecap="round"
          />
        );
      })}

      {/* Minute hand (pointing to 12) */}
      <Line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - clockR * 0.55}
        stroke="#1A1A2E"
        strokeWidth={border * 0.9}
        strokeLinecap="round"
      />

      {/* Hour hand (pointing to ~2 o'clock) */}
      <Line
        x1={cx}
        y1={cy}
        x2={cx + clockR * 0.32}
        y2={cy - clockR * 0.22}
        stroke="#1A1A2E"
        strokeWidth={border * 1.1}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <Circle cx={cx} cy={cy} r={dotR} fill="#1A1A2E" />

      {/* Session dots below clock */}
      <G>
        {[0, 1, 2, 3].map((i) => {
          const dotCx = cx - dotR * 5 + i * dotR * 3.5;
          const dotCy = cy + clockR + s * 0.08;
          const fill = i < 2 ? '#6BCB77' : i === 2 ? '#FF6B9D' : 'transparent';
          return (
            <Circle
              key={i}
              cx={dotCx}
              cy={dotCy}
              r={dotR}
              fill={fill}
              stroke="#1A1A2E"
              strokeWidth={border * 0.4}
            />
          );
        })}
      </G>
    </Svg>
  );
}
