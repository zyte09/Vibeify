import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ promptAsync, request }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Vibeify (HomeScreen)🎧</Text>
            <Button
                title="Login with Spotify"
                disabled={!request}
                onPress={() => promptAsync({ useProxy: false, useWebView: true })} // ✅ This line matters!
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, marginBottom: 20 },
});
