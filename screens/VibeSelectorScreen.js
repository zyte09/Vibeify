import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const moods = ['Chill', 'Focus', 'Workout', 'Heartbreak', 'Party', 'Romantic', 'Sleep'];

export default function VibeSelectorScreen({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>What’s your vibe today?</Text>
            {moods.map((mood, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.moodCard}
                    onPress={() => navigation.navigate('Playlist', { mood })}
                >
                    <Text style={styles.moodText}>{mood}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
    moodCard: {
        backgroundColor: '#dbeafe',
        padding: 20,
        marginVertical: 10,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
    },
    moodText: { fontSize: 18, fontWeight: '500' },
});
