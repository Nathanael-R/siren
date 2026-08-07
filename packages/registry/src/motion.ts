import { Easing, ReduceMotion } from "react-native-reanimated";

/** Strong ease-out used for immediate, non-physical feedback. */
export const sirenEaseOut = Easing.bezier(0.23, 1, 0.32, 1);

/** Press-in is deliberately faster than the spring-backed release. */
export const sirenPressIn = {
  duration: 120,
  easing: sirenEaseOut,
  reduceMotion: ReduceMotion.System,
} as const;

/** Critically damped state transition: responsive without decorative bounce. */
export const sirenStateSpring = {
  duration: 300,
  dampingRatio: 1,
  reduceMotion: ReduceMotion.System,
} as const;

/** Momentum is reserved for gestures that were moving at release. */
export const sirenGestureSpring = {
  duration: 300,
  dampingRatio: 0.8,
  reduceMotion: ReduceMotion.System,
} as const;

export function shouldReduceMotion(
  explicit: boolean | undefined,
  system: boolean,
) {
  return explicit ?? system;
}
