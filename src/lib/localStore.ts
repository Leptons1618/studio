import * as FileSystem from 'expo-file-system';
import { JournalEntry, JournalEntryData } from '../types';

const BASE_DIR = FileSystem.documentDirectory + 'journal';
const ensureDir = async () => {
  try { await FileSystem.makeDirectoryAsync(BASE_DIR, { intermediates: true }); } catch {}
};
const fileFor = (userId: string) => `${BASE_DIR}/${userId}.json`;

async function loadEntries(userId: string): Promise<JournalEntry[]> {
  await ensureDir();
  const file = fileFor(userId);
  const info = await FileSystem.getInfoAsync(file);
  if (!info.exists) return [];
  const raw = await FileSystem.readAsStringAsync(file);
  try {
    const parsed = JSON.parse(raw) as JournalEntry[];
    return parsed.map(e => ({
      ...e,
      createdAt: new Date(e.createdAt as any),
      updatedAt: new Date(e.updatedAt as any)
    }));
  } catch {
    return [];
  }
}

async function persist(userId: string, entries: JournalEntry[]) {
  await ensureDir();
  await FileSystem.writeAsStringAsync(fileFor(userId), JSON.stringify(entries));
}

export async function addEntryLocal(userId: string, data: JournalEntryData): Promise<JournalEntry> {
  const entries = await loadEntries(userId);
  const now = new Date();
  const entry: JournalEntry = {
    id: Math.random().toString(36).slice(2),
    title: data.title,
    content: data.content,
    color: data.color,
    createdAt: now,
    updatedAt: now,
  };
  const next = [entry, ...entries];
  await persist(userId, next);
  return entry;
}

export async function updateEntryLocal(userId: string, entry: JournalEntry): Promise<JournalEntry> {
  const entries = await loadEntries(userId);
  const now = new Date();
  const next = entries.map(e => e.id === entry.id ? { ...entry, updatedAt: now } : e);
  await persist(userId, next);
  const updated = next.find(e => e.id === entry.id)!;
  return updated;
}

export async function deleteEntryLocal(userId: string, id: string): Promise<void> {
  const entries = await loadEntries(userId);
  const next = entries.filter(e => e.id !== id);
  await persist(userId, next);
}

export async function listEntriesLocal(userId: string): Promise<JournalEntry[]> {
  const entries = await loadEntries(userId);
  return entries.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
