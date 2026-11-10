import { apiFetch } from './api';

export type NoteTemplate = 
  | 'sticky' | 'checklist' | 'daily-journal' | 'weekly-planner' 
  | 'study' | 'project' | 'personal-journal' | 'meeting' | 'blank';

export type Note = {
  id: string;
  user_id: string;
  title: string;
  template_type: NoteTemplate;
  content: any; // JSON object (berbeda tiap template)
  isFavorite: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
};

export async function getNotes(showDeleted = false): Promise<Note[]> {
  return apiFetch(`/api/notes?deleted=${showDeleted}`);
}

export async function getNote(id: string): Promise<Note> {
  return apiFetch(`/api/notes/${id}`);
}

export async function createNote(data: Partial<Note>): Promise<Note> {
  return apiFetch('/api/notes', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateNote(id: string, data: Partial<Note>): Promise<void> {
  await apiFetch(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteNote(id: string): Promise<void> {
  await apiFetch(`/api/notes/${id}`, { method: 'DELETE' });
}

export async function duplicateNote(id: string): Promise<{ id: string }> {
  return apiFetch(`/api/notes/${id}/duplicate`, { method: 'POST' });
}