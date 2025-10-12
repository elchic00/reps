import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Reps App 🎯</Text>
      <Link href="/(auth)/login">
        <Text style={{ color: "blue" }}>Go to Login</Text>
      </Link>
    </View>
  );
}
