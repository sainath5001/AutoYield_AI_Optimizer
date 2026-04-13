"use client";

import type { ApyTrendRange } from "@shared/vaultApyTrend";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ApyChartPoint } from "@/lib/vaultApyTrend";

type Props = {
  data: ApyChartPoint[];
  selectedRange: ApyTrendRange;
};

export function APYChart({ data, selectedRange }: Props) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No chart points for this range.
      </p>
    );
  }

  return (
    <div className="h-56 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={70}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            tickFormatter={(v) => `${Number(v).toFixed(1)}%`}
            width={48}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fafafa" }}
            formatter={(value) => {
              const v = value as number | undefined;
              if (v == null || Number.isNaN(v)) return ["—", "APY"];
              return [`${v.toFixed(2)}%`, "APY"];
            }}
          />
          <Line
            type="monotone"
            dataKey="apy"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-[10px] text-zinc-500">
        Range: {selectedRange === "today" ? "Today" : selectedRange === "7d" ? "7 days" : "30 days"} ·
        Values are LI.FI rolling averages (apy1d / apy7d / apy30d) vs current
      </p>
    </div>
  );
}
