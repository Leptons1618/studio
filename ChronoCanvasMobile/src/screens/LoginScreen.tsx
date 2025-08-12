import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useToast } from '../contexts/ToastContext';
import { signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { show } = useToast();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Navigate to Main screen if user is already logged in
    if (user && !loading) {
      navigation.navigate('Main');
    }
  }, [user, loading, navigation]);

  const handleEmailAuth = async () => {
    try {
      setIsSigningIn(true);
      
      if (isSignUp) {
  await createUserWithEmailAndPassword(auth, email, password);
  show('Account created');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Navigation will be handled by useEffect when user state changes
      
    } catch (error: any) {
      console.error('Auth Error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        show('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        show('Weak password');
      } else if (error.code === 'auth/user-not-found') {
        show('Account not found');
      } else if (error.code === 'auth/wrong-password') {
        show('Wrong password');
      } else {
        show('Auth error');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAnonymousAuth = async () => {
    try {
      setIsSigningIn(true);
      await signInAnonymously(auth);
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
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.authButton, isSigningIn && styles.authButtonDisabled]} 
          onPress={handleEmailAuth}
          disabled={isSigningIn}
        >
          <Text style={styles.authButtonText}>
            {isSigningIn ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
          disabled={isSigningIn}
        >
          <Text style={styles.switchButtonText}>
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.anonymousButton, isSigningIn && styles.authButtonDisabled]} 
          onPress={handleAnonymousAuth}
          disabled={isSigningIn}
        >
          <Text style={styles.anonymousButtonText}>
            Continue as Guest
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
