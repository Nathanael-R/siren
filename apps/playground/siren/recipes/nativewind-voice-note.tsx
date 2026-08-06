import {
  VoiceNotePlayer,
  type VoiceNotePlayerProps,
} from "../components/voice-note-player";

// Optional recipe: configure NativeWind in the app, then replace style props with className after copying.
export function NativeWindVoiceNoteRecipe(props: VoiceNotePlayerProps) {
  return <VoiceNotePlayer {...props} />;
}
