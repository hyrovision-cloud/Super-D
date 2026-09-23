import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatINR } from '@/lib/utils';

interface CategoryDistributionProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  '#123B5D', // Navy
  '#2563EB', // Blue
  '#0F766E', // Teal
  '#16A34A', // Green
  '#D97706', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#64748B', // Slate
];

export const CategoryDistributionChart: React.FC<CategoryDistributionProps> = ({ data }) => {
  const filteredData = data.filter((d) => d.value > 0);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {filteredData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: number) => [formatINR(val), 'Revenue']}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontSize: '12px',
            }}
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
