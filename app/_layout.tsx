import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useAuth } from "@/hooks/useAuth";

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}
