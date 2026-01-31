export type GameEvent =
  | { type: 'PlayerEnteredZone' }
  | { type: 'PlayerLeftZone' }
  | { type: 'ButtonPressed' }
  | { type: 'Tick'; dtMs: number };

   const Sounds = ['ding', 'error', 'ready'] as const;
  type SoundName = (typeof Sounds)[number];


  export type Effect =
  | { type: 'PlaySound'; name: SoundName }
  | { type: 'ShowMessage'; text: string };


  export type GameState = {
  inZone: boolean;
  score: number;
  cooldownMs: number;
};