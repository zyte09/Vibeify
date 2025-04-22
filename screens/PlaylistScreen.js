import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const PlaylistScreen = ({ route, accessToken }) => {
    const { mood } = route.params; // Get the selected mood from the route parameters
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        // Fetch songs based on the selected mood
        fetchSongs(mood);
    }, [mood]);

    const fetchSongs = async (mood) => {
        // Here you would typically call the Spotify API to get song recommendations based on the mood
        // For demonstration, we'll use a static list of songs
        const mockSongs = [
            { id: '1', title: 'Song 1' },
            { id: '2', title: 'Song 2' },
            { id: '3', title: 'Song 3' },
        ];
        setSongs(mockSongs);
    };

    const handleSavePlaylist = () => {
        // Logic to save the playlist to the user's Spotify account
        console.log('Saving playlist...');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Playlist for {mood}</Text>
            <FlatList
                data={songs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <Text style={styles.songText}>{item.title}</Text>
                    </View>
                )}
            />
            <Button title="Save Playlist" onPress={handleSavePlaylist} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
    songItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
    },
    songText: { fontSize: 18 },
});

export default PlaylistScreen;