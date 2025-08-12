import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useJournalEntries } from '../hooks/useJournalEntries';

// Default entry colors (same as web app)
const entryColors = [
  '#A8D0E6', '#FADADD', '#E6E6FA', '#FFDDC1', '#D4F0F0',
  '#FEE1E8', '#E0BBE4', '#D2F8B0', '#FEEAA1', '#B9E2A0'
];

// Plain text only now; toolbar removed after migration decision

export default function CreateEntryScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const { addEntry, updateEntry } = useJournalEntries(user?.uid);
  const editingEntry = route?.params?.entry || null;
  const { show } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(entryColors[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content.replace(/<[^>]*>/g, ''));
      setColor(editingEntry.color);
    }
  }, [editingEntry]);

  const handleSaveEntry = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your entry.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please write something in your entry.');
      return;
    }

    setSaving(true);
    try {
      if (editingEntry) {
        await updateEntry({
          ...editingEntry,
          title: title.trim(),
          content: content.trim(),
          color,
          updatedAt: new Date()
        });
        show('Entry updated');
      } else {
        await addEntry({
          title: title.trim(),
          content: content.trim(),
          color,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        show('Entry saved');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving entry:', error);
      show('Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  // No rich formatting (plain text mode)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editingEntry ? 'Edit Entry' : 'New Entry'}</Text>
        <TouchableOpacity onPress={handleSaveEntry} disabled={saving}>
          <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter a title for your entry"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorPicker}>
            {entryColors.map((entryColor) => (
              <TouchableOpacity
                key={entryColor}
                style={[
                  styles.colorOption,
                  { backgroundColor: entryColor },
                  color === entryColor && styles.selectedColor,
                ]}
                onPress={() => setColor(entryColor)}
              />
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind today?"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#333',
  },
  contentInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 200,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  // Toolbar styles removed in plain text mode
});
