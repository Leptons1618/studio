import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useJournalEntries } from '../hooks/useJournalEntries';
// Firebase removed for local prototype

export default function MainScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { entries, loading, deleteEntry } = useJournalEntries(user?.id);
  const { show } = useToast();

  const handleCreateEntry = () => {
    navigation.navigate('CreateEntry');
  };

  const handleSignOut = async () => {
    try {
  await signOut();
      navigation.navigate('Login');
      show('Signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      show('Sign out failed');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    // Handle Firestore Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString();
    }
    
    // Handle regular Date object
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    
    return 'Unknown date';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading your journal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Journal Entries</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateEntry}>
            <Text style={styles.createButtonText}>+ New Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.entriesList}>
        {entries.length > 0 ? (
          entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => navigation.navigate('EntryDetail', { entry })}
              onLongPress={() => {
                Alert.alert('Entry Actions', entry.title, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Edit', onPress: () => navigation.navigate('CreateEntry', { entry }) },
                  { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteEntry(entry.id); show('Entry deleted'); } catch { show('Delete failed'); } } }
                ]);
              }}
            >
              <View style={[styles.colorBar, { backgroundColor: entry.color }]} />
              <View style={styles.entryContent}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entrySnippet} numberOfLines={2}>
                  {entry.content.replace(/<[^>]*>/g, '')}
                </Text>
                <Text style={styles.entryDate}>{formatDate(entry.updatedAt)}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No entries yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first journal entry to get started</Text>
            <TouchableOpacity style={styles.emptyCreateButton} onPress={handleCreateEntry}>
              <Text style={styles.emptyCreateButtonText}>Create Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  createButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#f44242',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  entriesList: {
    flex: 1,
    padding: 20,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  colorBar: {
    width: 5,
    minHeight: 80,
  },
  entryContent: {
    flex: 1,
    padding: 15,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  entrySnippet: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyCreateButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyCreateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
