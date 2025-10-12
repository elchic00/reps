import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { useChallenges, useUserProgress } from "@/hooks/useChallenges";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();
  const { getTodaysChallenge, loading: challengesLoading } = useChallenges();
  const { progress, markAsStarted } = useUserProgress();

  const todaysChallenge = getTodaysChallenge();
  const userChallenge = progress.find(
    (p) => p.challenge_id === todaysChallenge?.id
  );

  if (challengesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!todaysChallenge) {
    return (
      <View style={styles.container}>
        <Text>No challenges available yet</Text>
      </View>
    );
  }

  const handleStartChallenge = async () => {
    if (!userChallenge) {
      await markAsStarted(todaysChallenge.id);
    }
    router.push(`/challenge/${todaysChallenge.id}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge">Today's Challenge 🎯</Text>
        <Text variant="bodyMedium" style={styles.date}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.challengeHeader}>
            <Text variant="headlineMedium">{todaysChallenge.title}</Text>
            <View style={styles.badges}>
              <Chip
                mode="flat"
                style={[
                  styles.difficultyChip,
                  todaysChallenge.difficulty === "easy" && styles.easy,
                  todaysChallenge.difficulty === "medium" && styles.medium,
                  todaysChallenge.difficulty === "hard" && styles.hard,
                ]}
              >
                {todaysChallenge.difficulty.toUpperCase()}
              </Chip>
              <Chip mode="outlined">{todaysChallenge.category}</Chip>
            </View>
          </View>

          <Text variant="bodyLarge" style={styles.description}>
            {todaysChallenge.description.substring(0, 150)}...
          </Text>

          {userChallenge?.status === "solved" ? (
            <Chip icon="check-circle" style={styles.solvedChip}>
              Solved! ✅
            </Chip>
          ) : null}
        </Card.Content>

        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleStartChallenge}
            style={styles.button}
          >
            {userChallenge ? "Continue" : "Start Challenge"}
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleMedium">Your Stats</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text variant="displaySmall">🔥</Text>
              <Text variant="bodyLarge">7</Text>
              <Text variant="bodySmall">Day Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="displaySmall">✅</Text>
              <Text variant="bodyLarge">23</Text>
              <Text variant="bodySmall">Solved</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="displaySmall">⭐</Text>
              <Text variant="bodyLarge">450</Text>
              <Text variant="bodySmall">Points</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 24,
  },
  date: {
    opacity: 0.7,
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
  },
  challengeHeader: {
    marginBottom: 16,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  difficultyChip: {
    backgroundColor: "#e0e0e0",
  },
  easy: {
    backgroundColor: "#4caf50",
  },
  medium: {
    backgroundColor: "#ff9800",
  },
  hard: {
    backgroundColor: "#f44336",
  },
  description: {
    marginBottom: 16,
  },
  solvedChip: {
    alignSelf: "flex-start",
    backgroundColor: "#4caf50",
  },
  button: {
    flex: 1,
  },
  statsCard: {
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  stat: {
    alignItems: "center",
  },
});
