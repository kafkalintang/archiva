'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  NotebookPen, Search, Filter, Plus, Pin, Star, MoreHorizontal, 
  Pencil, Trash2, Copy, FileText, CheckSquare, CalendarDays, 
  CalendarRange, GraduationCap, FolderKanban, BookOpen, Users, FileEdit
} from 'lucide-react';
import { getNotes, deleteNote, updateNote, duplicateNote, Note, NoteTemplate } from '@/lib/notes';
import { cn, formatDate } from '@/lib/utils';

const TEMPLATE_MAP: Record<NoteTemplate, { label: string, icon: any, color: string, bg: string }> = {
  'sticky': { label: 'Sticky Note', icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'checklist': { label: 'Checklist', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'daily-journal': { label: 'Daily Journal', icon: CalendarDays, color: 'text-sky-600', bg: 'bg-sky-100' },
  'weekly-planner': { label: 'Weekly Planner', icon: CalendarRange, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'study': { label: 'Study Notes', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
  'project': { label: 'Project Notes', icon: FolderKanban, color: 'text-orange-600', bg: 'bg-orange-100' },
  'personal-journal': { label: 'Personal Journal', icon: BookOpen, color: 'text-rose-600', bg: 'bg-rose-100' },
  'meeting': { label: 'Meeting Notes', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  'blank': { label: 'Blank Note', icon: FileEdit, color: 'text-slate-600', bg: 'bg-slate-100' },
};

export default function MyNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const data = await getNotes(false); // false = jangan ambil yang di Trash
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter & Search Logic
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || n.template_type === filterType;
      return matchSearch && matchType;
    });
  }, [notes, search, filterType]);

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  // Actions
  const handleDelete = async (id: string) => {
    if (!confirm('Move this note to Trash?')) return;
    await deleteNote(id);
    fetchNotes();
  };

  const handleToggleFavorite = async (note: Note) => {
    await updateNote(note.id, { isFavorite: !note.isFavorite });
    fetchNotes();
  };

  const handleTogglePin = async (note: Note) => {
    await updateNote(note.id, { isPinned: !note.isPinned });
    fetchNotes();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateNote(id);
    fetchNotes();
  };

  // Render Card
  const NoteCard = ({ note }: { note: Note }) => {
    const meta = TEMPLATE_MAP[note.template_type as NoteTemplate] || TEMPLATE_MAP['blank'];
    
    // Preview text (tergantung tipe template, kita ambil teks utamanya)
    let preview = 'Empty note...';
    if (note.content?.body) preview = note.content.body;
    else if (note.content?.description) preview = note.content.description;
    else if (note.content?.items) preview = `${note.content.items.length} checklist items`;
    else if (note.template_type === 'meeting') preview = 'Meeting details...';

    return (
      <div className="group relative bg-white border border-line rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-64">
        {/* Top Row: Type & Action */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium", meta.bg, meta.color)}>
            <meta.icon className="w-3.5 h-3.5" />
            {meta.label}
          </div>
          
          {/* Quick Actions (Hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => handleTogglePin(note)} className={cn("p-1.5 rounded-md hover:bg-surface", note.isPinned ? "text-royal" : "text-slate-soft")}>
              <Pin className="w-4 h-4" />
            </button>
            <button onClick={() => handleToggleFavorite(note)} className={cn("p-1.5 rounded-md hover:bg-surface", note.isFavorite ? "text-yellow-500" : "text-slate-soft")}>
              <Star className="w-4 h-4" fill={note.isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 cursor-pointer" onClick={() => router.push(`/app/notes/${note.id}`)}>
          <h3 className="font-semibold text-navy text-base leading-snug line-clamp-2 mb-2">
            {note.title}
          </h3>
          <p className="text-sm text-slate-soft line-clamp-3 leading-relaxed">
            {preview}
          </p>
        </div>

        {/* Bottom Row: Date & Actions */}
        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
          <span className="text-xs text-slate-soft">
            {formatDate(note.updated_at)}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => handleDuplicate(note.id)} className="p-1.5 text-slate-soft hover:text-royal hover:bg-surface rounded-md transition-colors" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(note.id)} className="p-1.5 text-slate-soft hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-up">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-navy tracking-tight flex items-center gap-3">
            <NotebookPen className="w-8 h-8 text-royal" />
            My Notes
          </h1>
          <p className="text-sm text-slate-soft mt-2">
            Your personal space for thoughts, plans, and ideas.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-sm mr-4">
            <div>
              <p className="text-slate-soft text-xs">Total Notes</p>
              <p className="font-semibold text-navy text-lg">{notes.length}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-navy to-royal text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Create New Note
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-soft" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white text-sm focus:border-royal focus:ring-2 focus:ring-royal/20 outline-none transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-soft" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-line bg-white text-sm text-navy focus:border-royal focus:ring-2 focus:ring-royal/20 outline-none transition appearance-none min-w-[180px] cursor-pointer"
          >
            <option value="all">All Templates</option>
            {Object.entries(TEMPLATE_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* NOTES GRID */}
      {loading ? (
        <div className="text-center py-20 text-slate-soft animate-pulse">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-line border-dashed">
          <NotebookPen className="w-12 h-12 text-slate-soft mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-navy mb-1">No notes yet</h3>
          <p className="text-sm text-slate-soft mb-6">Create your first note to get started.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-royal font-medium hover:underline text-sm">
            + Create Note
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-navy mb-4 flex items-center gap-2">
                <Pin className="w-4 h-4 text-royal" /> Pinned Notes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {pinnedNotes.map(note => <NoteCard key={note.id} note={note} />)}
              </div>
            </div>
          )}
          
          <div>
            {pinnedNotes.length > 0 && <h2 className="text-sm font-semibold text-navy mb-4">Other Notes</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {otherNotes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NOTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up">
            <div className="p-6 border-b border-line flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-navy">Choose a template</h2>
                <p className="text-sm text-slate-soft mt-1">Select a format for your new note.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-soft hover:bg-surface rounded-full transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-surface">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(TEMPLATE_MAP).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => router.push(`/app/notes/new?template=${key}`)}
                    className="flex flex-col items-start p-5 bg-white rounded-2xl border border-line hover:border-royal hover:shadow-md transition-all text-left group"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform", meta.bg)}>
                      <meta.icon className={cn("w-6 h-6", meta.color)} />
                    </div>
                    <h3 className="font-semibold text-navy mb-1">{meta.label}</h3>
                    <p className="text-xs text-slate-soft leading-relaxed">
                      Create a new {meta.label.toLowerCase()} with custom fields.
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}