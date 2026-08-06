import { render } from "@testing-library/react-native";
import { RecordingTimer } from "../siren/components/recording-timer";

it("exposes recording state and time to assistive technology", () => {
  const screen = render(
    <RecordingTimer
      durationMs={65_000}
      state="paused"
      maximumDurationMs={120_000}
    />,
  );
  expect(
    screen.getByLabelText("Recording paused, 01:05 of 02:00"),
  ).toBeTruthy();
});
