import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await signIn(email, password);
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
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back! 👋
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign in to continue your coding journey
        </Text>

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
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Sign In
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/(auth)/signup")}
          style={styles.linkButton}
        >
          Don't have an account? Sign Up
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
