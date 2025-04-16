import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './firebaseConfig'; // Import Firebase configuration

// Spotify API credentials
const CLIENT_ID = '917443e685834578ae7c03dfa6644afe'; // Replace with your Spotify Client ID
const REDIRECT_URI = AuthSession.makeRedirectUri(); // Automatically generates a redirect URI
const SCOPES = 'user-read-private user-read-email'; // Add necessary scopes
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';

export default function App() {
  const [accessToken, setAccessToken] = useState(null);

  // Firebase Firestore instance
  const db = getFirestore(app);

  // Firebase Auth instance
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: CLIENT_ID,
        scopes: SCOPES.split(' '),
        redirectUri: REDIRECT_URI,
        responseType: 'token',
      },
      { authorizationEndpoint: AUTH_ENDPOINT }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.params.access_token;
      setAccessToken(token);
      AsyncStorage.setItem('spotifyAccessToken', token);
    }
  }, [response]);

  const authenticate = () => {
    promptAsync();
  };

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('spotifyAccessToken');
      if (!token) {
        Alert.alert('Error', 'Access token not found. Please authenticate again.');
        return;
      }

      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User Profile:', data);
        Alert.alert('User Profile', `Name: ${data.display_name}`);

        // Save user profile to Firestore
        await addDoc(collection(db, 'spotifyUsers'), {
          name: data.display_name,
          email: data.email,
          id: data.id,
        });
        console.log('User profile saved to Firestore.');
      } else {
        Alert.alert('Error', 'Failed to fetch user profile.');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'An error occurred while fetching user profile.');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In Result:', result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
      <View style={styles.container}>
        <Text>Spotify API Integration</Text>
        <Button title="Authenticate with Spotify" onPress={authenticate} />
        {accessToken && <Text>Access Token: {accessToken}</Text>}
        <Button title="Fetch User Profile" onPress={fetchUserProfile} />
        <Button title="Sign In with Google" onPress={signInWithGoogle} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

