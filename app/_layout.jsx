import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

// --- JWT decode function ---
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

function RootLayoutNav() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          router.replace('/');
          return;
        }

        const decoded = decodeJWT(token);
        if (!decoded || !decoded.UserId) {
          await AsyncStorage.removeItem('token');
          router.replace('/login');
          return;
        }

        // Optional: Validate token via API if needed
        await axios.get(`https://backend-k.vercel.app/user/profile/${decoded.UserId}`, {
          headers: { 'x-auth-token': token },
        });

        // Token and user are valid, let user proceed
      } catch (err) {
        console.error('Layout Error validating token:', err);
        await AsyncStorage.removeItem('token');
        router.replace('/login');
        
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
