'use client';

import * as React from 'react';
import { LineChart as LineChartIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface SignupsPoint {
  label: string;
  value: number;
}

export function SignupsLine({ data, emptyLabel = 'No data' }: { data: SignupsPoint[]; emptyLabel?: string }) {
  const hasSignal = data.some((d) => d.value > 0);

  if (!hasSignal) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-300">
          <LineChartIcon className="size-5" />
        </span>
        <p className="text-[13px] text-ink-500">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 240 }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 18, bottom: 4, left: -8 }}>
          <defs>
            <linearGradient id="signup-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E4A8A" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2E4A8A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#6B7280"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={20}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ stroke: '#C2CFE3' }}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #C2CFE3',
              boxShadow: '0 4px 12px rgba(10,16,32,0.08)',
              fontSize: 12,
            }}
            labelStyle={{ fontWeight: 600, color: '#14171F' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0A1020"
            strokeWidth={2}
            fill="url(#signup-fill)"
            dot={false}
            activeDot={{ r: 4, fill: '#0A1020' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
