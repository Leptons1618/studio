import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { ToastProvider } from './src/contexts/ToastContext';
import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import CreateEntryScreen from './src/screens/CreateEntryScreen';
import EntryDetailScreen from './src/screens/EntryDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="CreateEntry" component={CreateEntryScreen} />
            <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  );
}
