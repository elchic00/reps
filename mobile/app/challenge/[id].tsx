import { View, StyleSheet, ScrollView, Share, Alert } from "react-native";
import { Text, Button, Card, Chip, Menu } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Challenge } from "@/lib/types";
import { getChallengeWebUrl } from "@/lib/deepLink";
import * as Clipboard from 'expo-clipboard';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setChallenge(data);
    } catch (err) {
      console.error("Error fetching challenge:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareLink = async () => {
    if (typeof id !== 'string') return;

    try {
      const url = await getChallengeWebUrl(id);
      await Share.share({
        message: `Check out this coding challenge: ${challenge?.title}\n${url}`,
        url: url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
    setMenuVisible(false);
  };

  const handleCopyLink = async () => {
    if (typeof id !== 'string') return;

    try {
      const url = await getChallengeWebUrl(id);
      await Clipboard.setStringAsync(url);
      Alert.alert('Success', 'Link copied to clipboard! Paste it on your desktop browser.');
    } catch (error) {
      console.error('Error copying:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
    setMenuVisible(false);
  };

  if (loading || !challenge) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge">{challenge.title}</Text>
        <View style={styles.badges}>
          <Chip mode="flat">{challenge.difficulty}</Chip>
          <Chip mode="outlined">{challenge.category}</Chip>
          <Chip mode="outlined">{challenge.points} pts</Chip>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Problem Description</Text>
          <Text variant="bodyLarge" style={styles.description}>
            {challenge.description}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Example</Text>
          <View style={styles.example}>
            <Text style={styles.code}>
              Input: {challenge.test_cases?.[0]?.input}
            </Text>
            <Text style={styles.code}>
              Output: {challenge.test_cases?.[0]?.expected}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {challenge.hints && challenge.hints.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Hints 💡</Text>
            {challenge.hints.map((hint, index) => (
              <Text key={index} variant="bodyMedium" style={styles.hint}>
                {index + 1}. {hint.text}
              </Text>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Constraints</Text>
          <Text variant="bodyMedium">
            Time Complexity: {challenge.time_complexity || "N/A"}
          </Text>
          <Text variant="bodyMedium">
            Space Complexity: {challenge.space_complexity || "N/A"}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={styles.primaryButton}
              icon="share-variant"
            >
              Open on Desktop
            </Button>
          }
        >
          <Menu.Item
            onPress={handleCopyLink}
            leadingIcon="content-copy"
            title="Copy Link"
          />
          <Menu.Item
            onPress={handleShareLink}
            leadingIcon="share"
            title="Share (AirDrop to Mac)"
          />
        </Menu>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.secondaryButton}
        >
          Back to Home
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
    lineHeight: 24,
  },
  example: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 14,
  },
  hint: {
    marginTop: 8,
    paddingLeft: 8,
  },
  actions: {
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 8,
  },
  secondaryButton: {
    paddingVertical: 8,
  },
});
