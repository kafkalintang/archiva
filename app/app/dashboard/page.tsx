'use client';

import {
  Archive,
  Folder,
  NotebookPen,
  Image as ImageIcon,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  FileText,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Files', value: '128', icon: Archive, trend: '+12 this week' },
  { label: 'Folders', value: '24', icon: Folder, trend: '+3 this week' },
  { label: 'Notes', value: '56', icon: NotebookPen, trend: '+8 this week' },
  { label: 'Media Items', value: '342', icon: ImageIcon, trend: '+45 this week' },
];

const recentActivity = [
  { title: 'Project Phoenix Notes', type: 'Note', time: '2 hours ago', icon: NotebookPen, color: 'bg-royal' },
  { title: 'Summer Vacation 2026', type: 'Gallery', time: '5 hours ago', icon: ImageIcon, color: 'bg-sky' },
  { title: 'Design System Guidelines.pdf', type: 'File', time: 'Yesterday', icon: FileText, color: 'bg-navy' },
  { title: 'Atomic Habits', type: 'Library', time: '2 days ago', icon: BookOpen, color: 'bg-royal' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-navy tracking-tight">
            Good morning, Test User
          </h1>
          <p className="text-sm text-slate-soft mt-1">
            Here's what's happening in your archive today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app/notes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-line rounded-xl text-sm font-medium text-navy hover:border-sky hover:shadow-sm transition-all"
          >
            <NotebookPen className="w-4 h-4" />
            Create Note
          </Link>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-navy to-royal text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
            Upload File
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-white border border-line shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center group-hover:scale-105 transition-transform">
                <stat.icon className="w-5 h-5 text-royal" />
              </div>
              <button className="text-slate-soft hover:text-navy">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-soft">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-semibold text-navy">{stat.value}</h3>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STORAGE / CHART AREA */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-line shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-navy">Storage Overview</h2>
            <span className="text-xs font-medium text-royal bg-ice/40 px-2.5 py-1 rounded-lg">75% Used</span>
          </div>
          
          {/* Fake Bar Chart */}
          <div className="h-48 flex items-end gap-2 sm:gap-4">
            {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-gradient-to-t from-royal/20 to-royal rounded-t-sm group-hover:from-navy/30 group-hover:to-navy transition-colors relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} GB
                  </div>
                </div>
                <span className="text-[10px] text-slate-soft">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="p-6 rounded-2xl bg-white border border-line shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-navy">Recent Activity</h2>
            <Clock className="w-4 h-4 text-slate-soft" />
          </div>
          <div className="space-y-5">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{item.title}</p>
                  <p className="text-xs text-slate-soft mt-0.5">{item.type} • {item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 flex items-center justify-center gap-1 text-xs font-medium text-royal hover:text-navy transition-colors">
            View all activity <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}