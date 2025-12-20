type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function StatsCard({ title, value, subtitle }: Props) {
  return (
    <div className="card-style p-4 text-center">
      <div className="text-sm text-muted-foreground mb-2">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
}
  