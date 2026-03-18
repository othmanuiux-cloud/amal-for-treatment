import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { colors } from '../../lib/design-tokens';

export interface ChartDataPoint { 
  name: string; 
  [key: string]: number | string; 
}

interface ChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
}

interface DistributionData {
  name: string;
  value: number;
  color: string;
}

export const WeeklyFlowChart: React.FC<ChartProps> = ({ data }) => (
  <div className="p-4 flex-1 min-h-[280px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: -20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.slate[200]} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: colors.slate[500] }} 
          dy={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: colors.slate[500] }} 
          orientation="right" 
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
            textAlign: 'right',
            direction: 'rtl' 
          }} 
        />
        <Line 
          type="monotone" 
          name="حالات جديدة" 
          dataKey="cases" 
          stroke={colors.primary[600]} 
          strokeWidth={2.5} 
          dot={{ r: 3, fill: colors.primary[600], strokeWidth: 2, stroke: "#fff" }} 
          activeDot={{ r: 5 }} 
        />
        <Line 
          type="monotone" 
          name="تم الحل" 
          dataKey="resolved" 
          stroke={colors.success[600]} 
          strokeWidth={2.5} 
          dot={{ r: 3, fill: colors.success[600], strokeWidth: 2, stroke: "#fff" }} 
          activeDot={{ r: 5 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const CasesDistributionChart: React.FC<{ data: DistributionData[] }> = ({ data }) => (
  <div className="p-4 flex-1 min-h-[220px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.slate[200]} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: colors.slate[500] }} 
          angle={-45} 
          textAnchor="end" 
          height={50} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: colors.slate[500] }} 
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
            textAlign: 'right' 
          }} 
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} name="العدد">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const DonationsChart: React.FC<ChartProps> = ({ data }) => (
  <div className="p-4 flex-1 min-h-[220px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.info[500]} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={colors.info[500]} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.slate[200]} />
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: colors.slate[500] }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: colors.slate[500] }} 
          tickFormatter={(value) => `$${value/1000}k`} 
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
          }} 
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'المبلغ']} 
        />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke={colors.info[500]} 
          fillOpacity={1} 
          fill="url(#donationGradient)" 
          strokeWidth={2} 
          name="التبرعات" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

interface SparklineProps {
  data: { v: number }[];
  color: string;
}

export const KPISparkline: React.FC<SparklineProps> = ({ data, color }) => (
  <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30 group-hover:opacity-50 transition-opacity">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="v" 
          stroke={color} 
          fillOpacity={1} 
          fill={`url(#spark-${color.replace('#', '')})`} 
          strokeWidth={1.5} 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
