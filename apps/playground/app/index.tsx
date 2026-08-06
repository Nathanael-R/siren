import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const routes = [
  [
    "/waveforms",
    "Waveforms",
    "Static, dense, live, scrubber, reduced-motion, and contention scenarios",
  ],
  [
    "/recorder",
    "Recorder",
    "Permissions, gestures, limits, interruptions, preview, and cleanup",
  ],
  [
    "/playback",
    "Playback",
    "Loading, buffering, errors, speed, seeking, and ownership",
  ],
  [
    "/visualizer",
    "Agent visualizer",
    "All variants, states, performance modes, and rapid transitions",
  ],
] as const;

export default function Home() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <Text style={styles.intro}>
        Deterministic scenarios for development builds and physical-device
        regression testing. No API keys required.
      </Text>
      {routes.map(([href, title, detail]) => (
        <Link key={href} href={href} asChild>
          <Pressable accessibilityRole="button" style={styles.card}>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.detail}>{detail}</Text>
            </View>
            <Text accessibilityElementsHidden>›</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  intro: { color: "#5D6470", fontSize: 16, lineHeight: 23 },
  card: {
    minHeight: 84,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#15171A" },
  detail: { marginTop: 4, color: "#5D6470", lineHeight: 20, maxWidth: 300 },
});
