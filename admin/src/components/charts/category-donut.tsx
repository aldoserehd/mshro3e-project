'use client';

import * as React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutDatum {
  id: string;
  label: string;
  value: number;
}

const PALETTE = ['#0A1020', '#1B2A4E', '#2E4A8A', '#5B7AB8', '#8FA4CC', '#C2CFE3', '#E2E8F2', '#243B6B'];

export function CategoryDonut({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-3 items-center h-full">
      <div style={{ width: '100%', height: 220, position: 'relative' }} dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={0}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: '1px solid #C2CFE3',
                boxShadow: '0 4px 12px rgba(10,16,32,0.08)',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[26px] font-bold text-ink-900 tabular-nums leading-none">{total}</span>
          <span className="text-[11px] text-ink-500 mt-1">vendors</span>
        </div>
      </div>

      <ul className="flex flex-col gap-2 px-2 max-h-[220px] overflow-y-auto">
        {data.map((d, i) => (
          <li key={d.id} className="flex items-center gap-2.5 text-[13px]">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="flex-1 truncate text-ink-900">{d.label}</span>
            <span className="text-ink-500 tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
