import React from 'react';
import Svg, { Rect, Circle, Line, G } from 'react-native-svg';
import { AppIcon } from './AppIcon';
import { View } from 'react-native';

interface OnboardingIllustrationProps {
  type: 'timer' | 'tasks' | 'stats' | 'ready';
  size?: number;
}

function TimerIllustration({ size }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;
  const border = size * 0.03;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Clock shadow */}
      <Circle cx={cx + 4} cy={cy + 4} r={r} fill="#1A1A2E" />
      {/* Clock face */}
      <Circle cx={cx} cy={cy} r={r} fill="#FF6B9D" stroke="#1A1A2E" strokeWidth={border} />
      <Circle cx={cx} cy={cy} r={r * 0.8} fill="#FFF8E7" stroke="#1A1A2E" strokeWidth={border * 0.6} />

      {/* Hour marks */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle - 90) * (Math.PI / 180);
        return (
          <Line
            key={angle}
            x1={cx + Math.cos(rad) * r * 0.6}
            y1={cy + Math.sin(rad) * r * 0.6}
            x2={cx + Math.cos(rad) * r * 0.72}
            y2={cy + Math.sin(rad) * r * 0.72}
            stroke="#1A1A2E"
            strokeWidth={border * 0.7}
            strokeLinecap="round"
          />
        );
      })}

      {/* Hands */}
      <Line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.5} stroke="#1A1A2E" strokeWidth={border * 0.8} strokeLinecap="round" />
      <Line x1={cx} y1={cy} x2={cx + r * 0.3} y2={cy - r * 0.2} stroke="#1A1A2E" strokeWidth={border} strokeLinecap="round" />
      <Circle cx={cx} cy={cy} r={size * 0.02} fill="#1A1A2E" />

      {/* Session dots */}
      {[0, 1, 2, 3].map((i) => (
        <Circle
          key={i}
          cx={cx - 18 + i * 12}
          cy={cy + r + 20}
          r={4}
          fill={i < 2 ? '#6BCB77' : i === 2 ? '#FF6B9D' : 'transparent'}
          stroke="#1A1A2E"
          strokeWidth={1.5}
        />
      ))}
    </Svg>
  );
}

function TasksIllustration({ size }: { size: number }) {
  const border = size * 0.025;
  const cardW = size * 0.6;
  const cardH = size * 0.15;
  const startX = (size - cardW) / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Three stacked task cards */}
      {[0, 1, 2].map((i) => {
        const y = size * 0.2 + i * (cardH + 12);
        const checked = i < 2;
        const shadowOff = 3;

        return (
          <G key={i}>
            {/* Card shadow */}
            <Rect x={startX + shadowOff} y={y + shadowOff} width={cardW} height={cardH} rx={6} fill="#1A1A2E" />
            {/* Card */}
            <Rect x={startX} y={y} width={cardW} height={cardH} rx={6} fill="#FFF8E7" stroke="#1A1A2E" strokeWidth={border} />

            {/* Checkbox */}
            <Rect
              x={startX + 12}
              y={y + (cardH - 16) / 2}
              width={16}
              height={16}
              rx={3}
              fill={checked ? '#6BCB77' : 'transparent'}
              stroke="#1A1A2E"
              strokeWidth={border * 0.7}
            />
            {checked && (
              <Line
                x1={startX + 16}
                y1={y + cardH / 2}
                x2={startX + 24}
                y2={y + cardH / 2 + 4}
                stroke="#1A1A2E"
                strokeWidth={2}
                strokeLinecap="round"
              />
            )}

            {/* Text line */}
            <Rect
              x={startX + 38}
              y={y + (cardH - 6) / 2}
              width={cardW * 0.5}
              height={6}
              rx={3}
              fill={checked ? '#E0E0E0' : '#4D96FF'}
            />
          </G>
        );
      })}
    </Svg>
  );
}

function StatsIllustration({ size }: { size: number }) {
  const border = size * 0.025;
  const barW = size * 0.08;
  const baseY = size * 0.7;
  const maxH = size * 0.4;
  const barColors = ['#FF6B9D', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'];
  const barHeights = [0.5, 0.7, 1, 0.6, 0.85];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Bars */}
      {barHeights.map((h, i) => {
        const barH = maxH * h;
        const x = size * 0.15 + i * (barW + 14);
        const y = baseY - barH;
        return (
          <G key={i}>
            <Rect x={x + 3} y={y + 3} width={barW} height={barH} rx={4} fill="#1A1A2E" />
            <Rect x={x} y={y} width={barW} height={barH} rx={4} fill={barColors[i]} stroke="#1A1A2E" strokeWidth={border * 0.6} />
          </G>
        );
      })}

      {/* Baseline */}
      <Line x1={size * 0.1} y1={baseY + 4} x2={size * 0.9} y2={baseY + 4} stroke="#1A1A2E" strokeWidth={border * 0.5} strokeLinecap="round" />

      {/* Streak dots row */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Circle
          key={i}
          cx={size * 0.2 + i * 14}
          cy={baseY + 24}
          r={4}
          fill={i < 5 ? '#6BCB77' : '#F0F0F0'}
          stroke="#1A1A2E"
          strokeWidth={1}
        />
      ))}
    </Svg>
  );
}

export function OnboardingIllustration({ type, size = 200 }: OnboardingIllustrationProps) {
  switch (type) {
    case 'timer':
      return <TimerIllustration size={size} />;
    case 'tasks':
      return <TasksIllustration size={size} />;
    case 'stats':
      return <StatsIllustration size={size} />;
    case 'ready':
      return (
        <View style={{ alignItems: 'center' }}>
          <AppIcon size={size * 0.7} />
        </View>
      );
  }
}
