import {
  RadarChart as RechartsRadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer
} from 'recharts';

type ChartItem = { name: string; score: number };
type Props = { data: ChartItem[]; min?: number; max?: number };

function RadarChart({ data, min = 0, max = 5 }: Props) {
  if (data.length === 0) return <p>No numerical answers yet.</p>;

  return (
    <div style={{ width: '100%', height: 330 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} outerRadius="65%">
          <PolarGrid />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: "#64748B", fontSize: 14 }}
            tickSize={20}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[min, max]}
            allowDecimals={false}
            tick={{
              fill: "#475569",
              fontSize: 12,
              fontWeight: 400
            }}
          />
          <Radar name="Score" dataKey="score" stroke="#1976d2"
            fill="#1976d2" fillOpacity={0.35} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChart;
