import { useState, useEffect } from 'react';
import { addEntryLocal, updateEntryLocal, deleteEntryLocal, listEntriesLocal } from '../lib/localStore';
import { type JournalEntry, type JournalEntryData } from '../types';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function useJournalEntries(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (userId) {
        setLoading(true);
        const list = await listEntriesLocal(userId);
        if (!cancelled) {
          setEntries(list);
          setLoading(false);
        }
      } else {
        setEntries([]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const addEntry = async (entry: JournalEntryData) => {
    if (userId) {
      try {
        const saved = await addEntryLocal(userId, entry);
        setEntries(prev => [saved, ...prev]);
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    }
  };

  const updateEntry = async (entry: JournalEntry) => {
    if (userId) {
      try {
        const updated = await updateEntryLocal(userId, entry);
        setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    }
  };

  const deleteEntry = async (id: string) => {
    if (userId) {
      try {
        await deleteEntryLocal(userId, id);
        setEntries(prev => prev.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  return { entries, addEntry, updateEntry, deleteEntry, loading };
}
