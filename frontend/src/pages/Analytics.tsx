import React, { useEffect, useState } from 'react';
import { leadService } from '../services/leadService';
import type { Lead } from '../types';
import { Users, TrendingUp, Award, Activity, Compass, Calendar } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const Analytics: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        setLoading(true);
        // Fetch a high limit to get all active leads for computing metrics
        const response = await leadService.getLeads({ limit: 500 });
        if (response.success) {
          setLeads(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch analytics data');
        }
      } catch (err: any) {
        setError(err.message || 'Error occurred loading analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAllLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Computing analytics pipeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-left max-w-xl mx-auto mt-12">
        <h3 className="font-bold text-lg">Failed to load analytics</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Calculate Metrics
  const total = leads.length;
  const newCount = leads.filter((l) => l.status === 'new').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const qualifiedCount = leads.filter((l) => l.status === 'qualified').length;
  const lostCount = leads.filter((l) => l.status === 'lost').length;

  const conversionRate = total ? Math.round((qualifiedCount / total) * 100) : 0;
  const contactRate = total ? Math.round(((contactedCount + qualifiedCount) / total) * 100) : 0;

  // Source Distribution
  const sources = {
    website: leads.filter((l) => l.source === 'website').length,
    instagram: leads.filter((l) => l.source === 'instagram').length,
    referral: leads.filter((l) => l.source === 'referral').length,
  };

  const maxSourceVal = Math.max(sources.website, sources.instagram, sources.referral, 1);

  // Group by Date for Trend Chart (Last 7 days)
  const getTrendData = () => {
    const data: { label: string; count: number }[] = [];
    const dateMap: Record<string, number> = {};

    // Initialize map for last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[dateStr] = 0;
      data.push({ label: dateStr, count: 0 });
    }

    // Populate data
    leads.forEach((l) => {
      const lDate = new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (lDate in dateMap) {
        dateMap[lDate]++;
      }
    });

    return data.map((item) => ({
      ...item,
      count: dateMap[item.label],
    }));
  };

  const trendData = getTrendData();
  const maxTrendVal = Math.max(...trendData.map((t) => t.count), 1);

  // SVG dimensions for Trend Line
  const svgWidth = 600;
  const svgHeight = 160;
  const points = trendData.map((t, idx) => {
    const x = (idx / (trendData.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - 30 - (t.count / maxTrendVal) * 100;
    return { x, y, count: t.count, label: t.label };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = total > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - 30} L ${points[0].x} ${svgHeight - 30} Z`
    : '';

  return (
    <div className="flex flex-col gap-6 animate-card-entrance text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Analytics Workspace</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time stats and pipeline performance indices</p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center justify-between group hover:scale-[1.01] transition-spring">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-450">Total Leads</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{total}</span>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={10} /> Active database
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-spring">
            <Users size={20} />
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center justify-between group hover:scale-[1.01] transition-spring">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-450">Conversion Rate</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{conversionRate}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
              Qualified status ratio
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-spring">
            <Award size={20} />
          </div>
        </div>

        {/* Contact Rate */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center justify-between group hover:scale-[1.01] transition-spring">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-450">Contact Rate</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{contactRate}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
              Contacted or qualified
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-spring">
            <Activity size={20} />
          </div>
        </div>

        {/* Conversion Pipeline Dropoff */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center justify-between group hover:scale-[1.01] transition-spring">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-450">Lost Rate</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {total ? Math.round((lostCount / total) * 100) : 0}%
            </span>
            <span className="text-[10px] text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
              Unsuccessful sales closure
            </span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-500 dark:text-rose-450 rounded-xl group-hover:scale-110 transition-spring">
            <Compass size={20} />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (Left 2 columns) */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Leads Acquisition Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total sign-ups created over the last 7 days</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <Calendar size={11} /> 7 Days Grouped
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px] h-[160px] relative">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                <defs>
                  {/* Linear Gradient for Line */}
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  {/* Linear Gradient for Area Fill */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal gridlines */}
                {[0, 0.5, 1].map((ratio, idx) => {
                  const y = svgHeight - 30 - ratio * 100;
                  return (
                    <line
                      key={idx}
                      x1="30"
                      y1={y}
                      x2={svgWidth - 30}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800/40"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Curve Fill Area */}
                {total > 0 && <path d={areaPath} fill="url(#areaGradient)" />}

                {/* Trend line */}
                {total > 0 && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {total > 0 &&
                  points.map((p, idx) => (
                    <g key={idx} className="group/node cursor-pointer">
                      {/* Outer pulse */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        className="fill-blue-500/20 dark:fill-blue-400/20 opacity-0 group-hover/node:opacity-100 transition-opacity duration-200"
                      />
                      {/* Node circle */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        className="fill-blue-600 dark:fill-blue-400 stroke-white dark:stroke-slate-900 stroke-2 group-hover/node:r-5 transition-all duration-200"
                      />
                      {/* Tooltip text box */}
                      <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200 opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 pointer-events-none"
                      >
                        {p.count}
                      </text>
                    </g>
                  ))}

                {/* X Axis Labels */}
                {points.map((p, idx) => (
                  <text
                    key={idx}
                    x={p.x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 dark:fill-slate-500 font-bold"
                  >
                    {p.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Lead Source Breakdown (Right 1 column) */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col gap-5">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Acquisition Channels</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Leads distribution grouped by channel source</p>
          </div>

          <div className="flex flex-col gap-4.5 mt-2">
            {/* Website progress card */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-655 dark:text-slate-300">Website URL Forms</span>
                <span className="text-slate-900 dark:text-white font-bold">{sources.website} leads</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(sources.website / maxSourceVal) * 100}%` }}
                />
              </div>
            </div>

            {/* Instagram progress card */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-655 dark:text-slate-300">Instagram Messaging</span>
                <span className="text-slate-900 dark:text-white font-bold">{sources.instagram} leads</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-fuchsia-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(sources.instagram / maxSourceVal) * 100}%` }}
                />
              </div>
            </div>

            {/* Referral progress card */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-655 dark:text-slate-300">Direct Referrals</span>
                <span className="text-slate-900 dark:text-white font-bold">{sources.referral} leads</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(sources.referral / maxSourceVal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Pipeline Visualisation */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col gap-5">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Visual Sales Funnel</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Status migration stage volumes from intake to closure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          {/* Stage 1 */}
          <div className="flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-950/20 border border-gray-200/40 dark:border-slate-800/30 p-4 rounded-xl relative overflow-hidden group hover:scale-[1.01] transition-spring">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Stage 1</span>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Intake / New</h4>
            <span className="text-2xl font-extrabold text-blue-500 mt-1">{newCount}</span>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-blue-500 opacity-60" />
          </div>

          {/* Stage 2 */}
          <div className="flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-950/20 border border-gray-200/40 dark:border-slate-800/30 p-4 rounded-xl relative overflow-hidden group hover:scale-[1.01] transition-spring">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Stage 2</span>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Initiated</h4>
            <span className="text-2xl font-extrabold text-amber-500 mt-1">{contactedCount}</span>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-amber-500 opacity-60" />
          </div>

          {/* Stage 3 */}
          <div className="flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-950/20 border border-gray-200/40 dark:border-slate-800/30 p-4 rounded-xl relative overflow-hidden group hover:scale-[1.01] transition-spring">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Stage 3</span>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Qualified Lead</h4>
            <span className="text-2xl font-extrabold text-emerald-500 mt-1">{qualifiedCount}</span>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-emerald-500 opacity-60" />
          </div>

          {/* Stage 4 */}
          <div className="flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-950/20 border border-gray-200/40 dark:border-slate-800/30 p-4 rounded-xl relative overflow-hidden group hover:scale-[1.01] transition-spring">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Stage 4</span>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Closed Lost</h4>
            <span className="text-2xl font-extrabold text-rose-500 mt-1">{lostCount}</span>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-rose-500 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
