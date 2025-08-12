import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { user, loading, signInAnonymously } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { show } = useToast();
  // Email/password removed for local prototype

  useEffect(() => {
    // Navigate to Main screen if user is already logged in
    if (user && !loading) {
      navigation.navigate('Main');
    }
  }, [user, loading, navigation]);

  const handleAnonymousAuth = async () => {
    try {
      setIsSigningIn(true);
      await signInAnonymously();
    } catch (error: any) {
  console.error('Anonymous Auth Error:', error);
  show('Guest sign-in failed');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChronoCanvas</Text>
      <Text style={styles.subtitle}>Your Personal Digital Journal</Text>
      
      <View style={styles.form}>
        <TouchableOpacity 
          style={[styles.anonymousButton, isSigningIn && styles.authButtonDisabled]} 
          onPress={handleAnonymousAuth}
          disabled={isSigningIn}
        >
          <Text style={styles.anonymousButtonText}>
            {isSigningIn ? 'Signing in...' : 'Enter Journal'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 15,
  },
  authButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 1,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  switchButton: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  switchButtonText: {
    color: '#4285F4',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  anonymousButton: {
    backgroundColor: '#666',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 2,
  },
  anonymousButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
