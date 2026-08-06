import type { ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  useAudioPermission,
  type AudioPermissionState,
} from "../hooks/use-audio-permission";

export type AudioPermissionGateRenderState = {
  state: AudioPermissionState;
  request: () => Promise<AudioPermissionState>;
  openSettings: () => Promise<void>;
};

export type AudioPermissionGateProps = {
  children: ReactNode | ((state: AudioPermissionGateRenderState) => ReactNode);
  renderFallback?: (state: AudioPermissionGateRenderState) => ReactNode;
  labels?: Partial<
    Record<"request" | "denied" | "blocked" | "settings", string>
  >;
  style?: StyleProp<ViewStyle>;
};

export function AudioPermissionGate({
  children,
  renderFallback,
  labels,
  style,
}: AudioPermissionGateProps) {
  const permission = useAudioPermission();
  const state: AudioPermissionGateRenderState = {
    state: permission.state,
    request: permission.request,
    openSettings: permission.openSettings,
  };
  if (permission.state === "granted")
    return <>{typeof children === "function" ? children(state) : children}</>;
  if (renderFallback) return <>{renderFallback(state)}</>;
  const blockedCopy = Platform.select({
    ios: "Enable microphone access in Settings to record audio.",
    android: "Allow microphone access in system settings to record audio.",
    default: "Microphone access is blocked.",
  });
  return (
    <View accessible accessibilityRole="summary" style={[styles.root, style]}>
      <Text style={styles.title}>
        {permission.state === "blocked"
          ? (labels?.blocked ?? blockedCopy)
          : (labels?.denied ?? "Microphone access is needed to record audio.")}
      </Text>
      {permission.state === "blocked" ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => void permission.openSettings()}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>
            {labels?.settings ?? "Open settings"}
          </Text>
        </Pressable>
      ) : permission.state === "unknown" ? (
        <Text style={styles.detail}>Checking microphone access…</Text>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => void permission.request()}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>
            {labels?.request ?? "Allow microphone"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, gap: 12, borderRadius: 16, backgroundColor: "#F3F4F6" },
  title: { color: "#15171A", fontSize: 16 },
  detail: { color: "#5D6470" },
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#15171A",
  },
  buttonLabel: { color: "#FFFFFF", fontWeight: "600" },
});
