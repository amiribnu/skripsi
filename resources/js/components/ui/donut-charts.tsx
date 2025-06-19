import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from 'recharts';

type DonutChartProps = {
  data: { name: string; value: number; color: string }[];
};

export function DonutChart({ data }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="60%"
          outerRadius="80%"
          activeIndex={0}
          activeShape={(props: any) => (
            <Sector {...props} outerRadius={(props.outerRadius || 0) + 10} />
          )}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
