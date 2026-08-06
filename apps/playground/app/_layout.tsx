import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
        <Stack.Screen
          name="index"
          options={{ title: "Siren Playground", headerLargeTitle: true }}
        />
        <Stack.Screen name="waveforms" options={{ title: "Waveforms" }} />
        <Stack.Screen name="recorder" options={{ title: "Recorder" }} />
        <Stack.Screen name="playback" options={{ title: "Playback" }} />
        <Stack.Screen
          name="visualizer"
          options={{ title: "Agent visualizer" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
