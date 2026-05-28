'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function RevenueBars({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div style={{ width: '100%', height: 240 }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 18, bottom: 4, left: -8 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" stroke="#6B7280" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
          <Tooltip
            cursor={{ fill: 'rgba(46,74,138,0.06)' }}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #C2CFE3',
              boxShadow: '0 4px 12px rgba(10,16,32,0.08)',
              fontSize: 12,
            }}
            labelStyle={{ fontWeight: 600, color: '#14171F' }}
          />
          <Bar dataKey="value" fill="#0A1020" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
