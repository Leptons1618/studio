import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { JournalEntry } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useToast } from '../contexts/ToastContext';

interface EntryDetailParams {
  entry: JournalEntry;
}

type EntryDetailRouteProp = RouteProp<Record<string, EntryDetailParams>, string>;

export default function EntryDetailScreen({ navigation }: any) {
  const route = useRoute<EntryDetailRouteProp>();
  const { entry } = route.params as EntryDetailParams;
  const { user } = useAuth();
  const { deleteEntry } = useJournalEntries(user?.uid);
  const { show } = useToast();
  const [deleting, setDeleting] = useState(false);
  

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const formatDateTime = (date: any) => {
    if (!date) return 'Unknown';
    if (date.toDate) return date.toDate().toLocaleString();
    if (date instanceof Date) return date.toLocaleString();
    return 'Unknown';
  };

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteEntry(entry.id);
            show('Entry deleted');
            navigation.goBack();
          } catch (e) {
            console.error('Delete failed', e);
            show('Delete failed');
          } finally {
            setDeleting(false);
          }
        }
      }
    ]);
  };

  const handleEdit = () => {
    navigation.navigate('CreateEntry', { entry });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entry</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.headerActionButton}>
            <Text style={styles.headerActionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} disabled={deleting} style={styles.headerActionButton}>
            <Text style={[styles.headerActionText, deleting && styles.disabledText]}>Del</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.colorStripe, { backgroundColor: entry.color }]} />
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.meta}>Updated: {formatDateTime(entry.updatedAt)}</Text>
        <Text style={styles.meta}>Created: {formatDateTime(entry.createdAt)}</Text>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{entry.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: 'white', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cancelButton: { color: '#666', fontSize: 16 },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerActionButton: { paddingHorizontal: 6, paddingVertical: 4 },
  headerActionText: { color: '#4285F4', fontWeight: '600', fontSize: 14 },
  disabledText: { color: '#bbb' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 10 },
  colorStripe: { height: 6, borderRadius: 3, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  meta: { fontSize: 12, color: '#888', marginBottom: 4 },
  contentBox: { backgroundColor: 'white', borderRadius: 10, padding: 16, marginTop: 16, elevation: 1 },
  contentText: { fontSize: 16, lineHeight: 22, color: '#333' }
});
