import { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signUp(email, password, username);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface}>
          <Text variant="headlineMedium" style={styles.title}>
            Join Reps 🚀
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Start your daily coding practice today
          </Text>

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Account
          </Button>

          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.linkButton}
          >
            Already have an account? Sign In
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  linkButton: {
    marginTop: 8,
  },
  error: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
});
