import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { shouldReduceMotion, sirenPressIn, sirenStateSpring } from "../motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type MotionPressableProps = Omit<
  PressableProps,
  "children" | "style"
> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
  reducedMotion?: boolean;
};

export function MotionPressable({
  children,
  disabled,
  hitSlop = 8,
  onPressIn,
  onPressOut,
  pressedScale = 0.96,
  reducedMotion,
  style,
  ...props
}: MotionPressableProps) {
  const systemReducedMotion = useReducedMotion();
  const reduce = shouldReduceMotion(reducedMotion, systemReducedMotion);
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.82]),
    transform: [
      {
        scale: reduce
          ? 1
          : interpolate(pressed.get(), [0, 1], [1, pressedScale]),
      },
    ],
  }));

  return (
    <AnimatedPressable
      {...props}
      accessibilityRole={props.accessibilityRole ?? "button"}
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={(event) => {
        pressed.set(withTiming(1, sirenPressIn));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withSpring(0, sirenStateSpring));
        onPressOut?.(event);
      }}
      style={[style, disabled && { opacity: 0.46 }, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
