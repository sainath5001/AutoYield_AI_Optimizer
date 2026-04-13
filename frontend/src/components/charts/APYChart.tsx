"use client";

import * as React from "react";
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

export const APYChart = React.memo(function APYChart({
  data,
  selectedRange: _selectedRange,
}: Props) {
  void _selectedRange;
  const [ready, setReady] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [dimsOk, setDimsOk] = React.useState(false);
  const [isWide, setIsWide] = React.useState(false);

  // Recharts can warn when first mounted into a container that has not yet been
  // measured (width/height -1). Delay initial render by one frame.
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsWide(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDimsOk(r.width > 0 && r.height > 0);
    });
    ro.observe(el);
    const r0 = el.getBoundingClientRect();
    setDimsOk(r0.width > 0 && r0.height > 0);
    return () => ro.disconnect();
  }, [ready]);

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No chart points for this range.
      </p>
    );
  }

  const compactData = data.map((d) => ({
    ...d,
    label:
      d.label === "Current"
        ? "Now"
        : d.label === "1d rolling avg"
          ? "1d avg"
          : d.label === "7d rolling avg"
            ? "7d avg"
            : d.label === "30d rolling avg"
              ? "30d avg"
              : d.label,
  }));

  return (
    <div ref={containerRef} className="h-60 w-full min-w-0">
      {ready && dimsOk ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart
            data={compactData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              interval="preserveStartEnd"
              angle={isWide ? 0 : -15}
              textAnchor={isWide ? "middle" : "end"}
              height={isWide ? 36 : 52}
              minTickGap={14}
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
      ) : (
        <div className="h-full w-full rounded-lg bg-zinc-800/30" aria-hidden />
      )}
    </div>
  );
});
