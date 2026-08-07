import { fireEvent, render } from "@testing-library/react-native";
import { AgentVisualizer } from "../siren/components/agent-visualizer";
import { MotionPressable } from "../siren/components/motion-pressable";
import { Text } from "react-native";

it("keeps agent state available without relying on motion", () => {
  const screen = render(
    <AgentVisualizer state="thinking" inputLevel={0.6} reducedMotion />,
  );

  expect(screen.getByLabelText("Agent is thinking")).toBeTruthy();
  screen.rerender(
    <AgentVisualizer state="speaking" outputLevel={0.8} reducedMotion />,
  );
  expect(screen.getByLabelText("Agent is speaking")).toBeTruthy();
});

it("preserves button semantics around animated press feedback", () => {
  const onPress = jest.fn();
  const screen = render(
    <MotionPressable accessibilityLabel="Play sample" onPress={onPress}>
      <Text>Play</Text>
    </MotionPressable>,
  );

  fireEvent.press(screen.getByRole("button", { name: "Play sample" }));
  expect(onPress).toHaveBeenCalledTimes(1);
});
