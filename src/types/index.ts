export type JournalEntry = {
  id: string;
  title: string;
  content: string; // Stored as HTML string
  color: string; // Hex color code
  createdAt: Date; // Local-only prototype now uses Date objects
  updatedAt: Date;
};

export type JournalEntryData = Omit<JournalEntry, 'id'>;
