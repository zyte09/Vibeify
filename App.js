import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VibeSelectorScreen from './screens/VibeSelectorScreen';
import PlaylistScreen from './screens/PlaylistScreen';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '917443e685834578ae7c03dfa6644afe';
const REDIRECT_URI = 'https://vibeify-d6109.web.app/auth'; // ✅ Your deployed Firebase redirect page

const SCOPES = [
    'user-read-email',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-top-read',
];

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const Stack = createNativeStackNavigator();

export default function App() {
    const [accessToken, setAccessToken] = useState(null);

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: CLIENT_ID,
            scopes: SCOPES,
            redirectUri: REDIRECT_URI,
            responseType: 'code',
            usePKCE: true,
        },
        discovery
    );

    // 🔍 Log the URL before it's used for auth
    useEffect(() => {
        if (request?.url) {
            console.log('🔗 Auth URL:', request.url);
        }
    }, [request]);

    useEffect(() => {
        console.log('🧪 useEffect triggered. Response:', response);

        const exchangeToken = async () => {
            if (response?.type === 'success' && response.params?.code) {
                console.log('🎯 Code received:', response.params.code);
                try {
                    const tokenResult = await AuthSession.exchangeCodeAsync(
                        {
                            clientId: CLIENT_ID,
                            code: response.params.code,
                            redirectUri: REDIRECT_URI,
                            extraParams: {
                                code_verifier: request.codeVerifier,
                            },
                        },
                        discovery
                    );
                    console.log('✅ Access Token:', tokenResult.accessToken);
                    setAccessToken(tokenResult.accessToken);
                } catch (error) {
                    console.error('❌ Token Exchange Failed:', error);
                }
            } else if (response?.type === 'error') {
                console.error('❌ Spotify login error:', response.error);
            } else if (response?.type === 'dismiss') {
                console.warn('⚠️ User dismissed login.');
            } else if (response?.type === 'cancel') {
                console.warn('⚠️ User canceled login.');
            }
        };

        exchangeToken();
    }, [response]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!accessToken ? (
                    <Stack.Screen name="Login" options={{ title: 'Login with Spotify' }}>
                        {() => (
                            <View style={styles.container}>
                                <Text style={styles.title}>Welcome to Vibeify 🎧</Text>
                                <Button
                                    title="Login with Spotify"
                                    onPress={() => {
                                        console.log('🧪 promptAsync() clicked!');
                                        promptAsync({ useProxy: false, useWebView: true });
                                    }}
                                    disabled={!request}
                                />

                            </View>
                        )}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="VibeSelector">
                            {(props) => (
                                <VibeSelectorScreen {...props} accessToken={accessToken} />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="Playlist" component={PlaylistScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
});
