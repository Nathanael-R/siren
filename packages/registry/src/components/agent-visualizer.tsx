import type { AgentVisualizerState } from "@siren-ui/core/recording";
import { normalizeAmplitude } from "@siren-ui/core/waveform";
import { memo, useEffect, useRef } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { shouldReduceMotion, sirenEaseOut, sirenStateSpring } from "../motion";

export type AgentVisualizerProps = {
  state: AgentVisualizerState;
  inputLevel?: number;
  outputLevel?: number;
  variant?: "orb" | "waveform-field" | "radial-bars";
  reducedMotion?: boolean;
  lowPerformanceMode?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const stateScale: Record<AgentVisualizerState, number> = {
  idle: 0.88,
  listening: 0.96,
  thinking: 0.92,
  speaking: 1,
};

const stateColor: Record<AgentVisualizerState, string> = {
  idle: "#5277C8",
  listening: "#18A77A",
  thinking: "#7455D9",
  speaking: "#266EF1",
};

const phaseDuration: Record<AgentVisualizerState, number> = {
  idle: 1400,
  listening: 620,
  thinking: 900,
  speaking: 360,
};

export const AgentVisualizer = memo(function AgentVisualizer({
  state,
  inputLevel = 0,
  outputLevel = 0,
  variant = "orb",
  reducedMotion,
  lowPerformanceMode = false,
  accessibilityLabel,
  style,
}: AgentVisualizerProps) {
  const systemReducedMotion = useReducedMotion();
  const reduce = shouldReduceMotion(reducedMotion, systemReducedMotion);
  const level =
    state === "speaking"
      ? normalizeAmplitude(outputLevel)
      : normalizeAmplitude(inputLevel);
  const animatedLevel = useSharedValue(level);
  const animatedState = useSharedValue(stateScale[state]);
  const phase = useSharedValue(0);
  const rotation = useSharedValue(0);
  const ripple = useSharedValue(0);
  const previousLevel = useRef(level);

  useEffect(() => {
    const isAttack = level > previousLevel.current;
    previousLevel.current = level;
    animatedLevel.set(
      reduce
        ? level
        : withTiming(level, {
            duration: isAttack ? 90 : 180,
            easing: sirenEaseOut,
          }),
    );
  }, [animatedLevel, level, reduce]);

  useEffect(() => {
    animatedState.set(
      reduce
        ? stateScale[state]
        : withSpring(stateScale[state], sirenStateSpring),
    );
    cancelAnimation(phase);
    cancelAnimation(rotation);
    cancelAnimation(ripple);
    if (reduce) {
      phase.set(0.45);
      rotation.set(0);
      ripple.set(0);
      return;
    }
    phase.set(0);
    phase.set(
      withRepeat(
        withTiming(1, {
          duration: phaseDuration[state],
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
    rotation.set(0);
    rotation.set(
      withRepeat(
        withTiming(1, {
          duration: state === "thinking" ? 1800 : 3200,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
    ripple.set(0);
    if (state === "listening" || state === "speaking") {
      ripple.set(
        withRepeat(
          withTiming(1, {
            duration: state === "speaking" ? 720 : 960,
            easing: sirenEaseOut,
          }),
          -1,
          false,
        ),
      );
    }
    return () => {
      cancelAnimation(phase);
      cancelAnimation(rotation);
      cancelAnimation(ripple);
    };
  }, [animatedState, phase, reduce, ripple, rotation, state]);

  const count = lowPerformanceMode ? 8 : variant === "orb" ? 3 : 20;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? `Agent is ${state}`}
      style={[styles.root, style]}
    >
      {variant === "orb" ? (
        <Orb
          state={state}
          level={animatedLevel}
          scale={animatedState}
          phase={phase}
          ripple={ripple}
          rotation={rotation}
          reducedMotion={reduce}
        />
      ) : (
        <View
          style={[styles.field, variant === "radial-bars" && styles.radial]}
        >
          <EnergyBackdrop
            state={state}
            level={animatedLevel}
            phase={phase}
            radial={variant === "radial-bars"}
            reducedMotion={reduce}
          />
          {Array.from({ length: count }, (_, index) => (
            <VisualizerBar
              key={index}
              index={index}
              count={count}
              level={animatedLevel}
              phase={phase}
              state={state}
              color={stateColor[state]}
              radial={variant === "radial-bars"}
              reducedMotion={reduce}
            />
          ))}
        </View>
      )}
    </View>
  );
});

function Orb({
  state,
  level,
  scale,
  phase,
  ripple,
  rotation,
  reducedMotion,
}: {
  state: AgentVisualizerState;
  level: SharedValue<number>;
  scale: SharedValue<number>;
  phase: SharedValue<number>;
  ripple: SharedValue<number>;
  rotation: SharedValue<number>;
  reducedMotion: boolean;
}) {
  const haloStyle = useAnimatedStyle(() => {
    const energy = reducedMotion ? 0.35 : phase.get();
    const response =
      state === "speaking" || state === "listening" ? level.get() : energy;
    return {
      opacity: interpolate(response, [0, 1], [0.12, 0.34]),
      transform: [
        {
          scale: scale.get() * interpolate(response, [0, 1], [1.04, 1.3]),
        },
      ],
    };
  });
  const shellStyle = useAnimatedStyle(() => {
    const energy = reducedMotion ? 0.35 : phase.get();
    const audioResponse =
      state === "speaking"
        ? level.get() * 0.16
        : state === "listening"
          ? level.get() * 0.1
          : energy * 0.035;
    return {
      transform: [
        { scale: scale.get() + audioResponse },
        {
          rotate:
            state === "thinking" ? `${rotation.get() * 8 - 4}deg` : "0deg",
        },
      ],
    };
  });
  const coreStyle = useAnimatedStyle(() => {
    const energy = reducedMotion ? 0.35 : phase.get();
    return {
      opacity: interpolate(level.get(), [0, 1], [0.76, 1]),
      transform: [
        {
          scale:
            0.92 + (state === "speaking" ? level.get() * 0.12 : energy * 0.045),
        },
        {
          translateY:
            state === "thinking" && !reducedMotion ? (energy - 0.5) * 5 : 0,
        },
      ],
    };
  });
  const orbitStyle = useAnimatedStyle(() => ({
    opacity: state === "thinking" ? 1 : 0,
    transform: [{ rotate: `${rotation.get() * 360}deg` }],
  }));
  const rippleAStyle = useAnimatedStyle(() => {
    const progress = ripple.get();
    const energy = 0.35 + level.get() * 0.65;
    return {
      opacity: reducedMotion
        ? 0
        : interpolate(progress, [0, 0.72, 1], [0.3 * energy, 0.1, 0]),
      transform: [{ scale: interpolate(progress, [0, 1], [0.82, 1.48]) }],
    };
  });
  const rippleBStyle = useAnimatedStyle(() => {
    const progress = (ripple.get() + 0.5) % 1;
    const energy = 0.3 + level.get() * 0.7;
    return {
      opacity: reducedMotion
        ? 0
        : interpolate(progress, [0, 0.72, 1], [0.24 * energy, 0.08, 0]),
      transform: [{ scale: interpolate(progress, [0, 1], [0.82, 1.48]) }],
    };
  });
  const bandAStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0.2 : 0.18 + level.get() * 0.22,
    transform: [
      { rotate: `${rotation.get() * 180 - 28}deg` },
      { scaleX: 1 + level.get() * 0.38 },
    ],
  }));
  const bandBStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0.12 : 0.1 + phase.get() * 0.16,
    transform: [
      { rotate: `${16 - rotation.get() * 120}deg` },
      { scaleX: 0.9 + level.get() * 0.28 },
    ],
  }));

  return (
    <View style={styles.orbStage}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.energyRipple,
          { borderColor: stateColor[state] },
          rippleAStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.energyRipple,
          { borderColor: stateColor[state] },
          rippleBStyle,
        ]}
      />
      <Animated.View
        style={[styles.halo, { backgroundColor: stateColor[state] }, haloStyle]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            backgroundColor: stateColor[state],
            shadowColor: stateColor[state],
          },
          shellStyle,
        ]}
      >
        <Animated.View style={[styles.orbCore, coreStyle]}>
          <Animated.View style={[styles.energyBand, bandAStyle]} />
          <Animated.View
            style={[styles.energyBand, styles.energyBandSecondary, bandBStyle]}
          />
          <View style={styles.orbHighlight} />
        </Animated.View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.orbit, orbitStyle]}>
        <View style={[styles.satellite, styles.satelliteTop]} />
        <View style={[styles.satellite, styles.satelliteBottom]} />
      </Animated.View>
    </View>
  );
}

function EnergyBackdrop({
  state,
  level,
  phase,
  radial,
  reducedMotion,
}: {
  state: AgentVisualizerState;
  level: SharedValue<number>;
  phase: SharedValue<number>;
  radial: boolean;
  reducedMotion: boolean;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const audioState = state === "listening" || state === "speaking";
    const energy = audioState ? level.get() : phase.get() * 0.6;
    return {
      opacity: reducedMotion ? 0.08 : 0.07 + energy * 0.12,
      transform: [
        { scaleX: 0.9 + energy * (radial ? 0.18 : 0.42) },
        { scaleY: 0.86 + energy * 0.28 },
      ],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        radial ? styles.radialBackdrop : styles.fieldBackdrop,
        { backgroundColor: stateColor[state] },
        animatedStyle,
      ]}
    />
  );
}

function VisualizerBar({
  index,
  count,
  level,
  phase,
  state,
  color,
  radial,
  reducedMotion,
}: {
  index: number;
  count: number;
  level: SharedValue<number>;
  phase: SharedValue<number>;
  state: AgentVisualizerState;
  color: string;
  radial: boolean;
  reducedMotion: boolean;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const offset = index / Math.max(1, count - 1);
    const wave =
      (Math.sin(
        (phase.get() + offset * (state === "thinking" ? 1.8 : 0.7)) *
          Math.PI *
          2,
      ) +
        1) /
      2;
    const counterWave =
      (Math.sin(
        (phase.get() * 1.35 - offset * 1.15 + (index % 3) * 0.07) * Math.PI * 2,
      ) +
        1) /
      2;
    const texture = 0.56 + ((index * 11) % 7) / 16;
    const staticLevel = 0.28 + ((index * 7) % 9) / 30;
    let energy = staticLevel;
    if (!reducedMotion) {
      if (state === "idle") energy = 0.18 + wave * 0.12;
      else if (state === "thinking")
        energy = 0.18 + (wave * 0.58 + counterWave * 0.24) * texture;
      else if (state === "listening")
        energy =
          0.16 +
          level.get() * (0.22 + wave * 0.48 + counterWave * 0.2) * texture;
      else
        energy =
          0.16 +
          level.get() * (0.3 + wave * 0.5 + counterWave * 0.24) * texture;
    }
    return {
      opacity: interpolate(energy, [0.15, 1], [0.48, 1]),
      transform: [{ scaleY: Math.min(1, energy) }],
    };
  });

  if (radial)
    return (
      <View
        pointerEvents="none"
        style={[
          styles.radialSpoke,
          { transform: [{ rotate: `${(index / count) * 360}deg` }] },
        ]}
      >
        <Animated.View
          style={[styles.radialBar, { backgroundColor: color }, animatedStyle]}
        />
      </View>
    );
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.visualBar, { backgroundColor: color }, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    minWidth: 140,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  orbStage: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: 106,
    height: 106,
    borderRadius: 53,
  },
  energyRipple: {
    position: "absolute",
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 1.5,
  },
  orb: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  orbCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.24)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  energyBand: {
    position: "absolute",
    width: 76,
    height: 18,
    top: 20,
    left: -8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  energyBandSecondary: {
    width: 66,
    height: 13,
    top: 34,
    left: -4,
    backgroundColor: "rgba(255,255,255,0.48)",
  },
  orbHighlight: {
    position: "absolute",
    width: 28,
    height: 20,
    borderRadius: 14,
    top: 7,
    left: 11,
    backgroundColor: "rgba(255,255,255,0.5)",
    transform: [{ rotate: "-18deg" }],
  },
  orbit: { position: "absolute", width: 118, height: 118 },
  satellite: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    shadowColor: "#4B32A8",
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  satelliteTop: { top: 2, left: 56 },
  satelliteBottom: { bottom: 9, left: 19, width: 5, height: 5 },
  field: {
    height: 108,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  fieldBackdrop: {
    position: "absolute",
    width: "64%",
    height: 30,
    borderRadius: 999,
  },
  radialBackdrop: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    top: 27,
    left: 27,
  },
  radial: { width: 124, height: 124 },
  visualBar: {
    width: 4,
    height: 88,
    borderRadius: 999,
  },
  radialSpoke: {
    position: "absolute",
    width: 124,
    height: 124,
    alignItems: "center",
  },
  radialBar: {
    width: 4,
    height: 28,
    borderRadius: 999,
    transformOrigin: "center bottom",
  },
});
