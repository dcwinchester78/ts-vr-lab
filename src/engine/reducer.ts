import type { Effect, GameEvent, GameState } from './types';

export const initialState: GameState = {
  inZone: false,
  score: 0,
  cooldownMs: 0,
};

function clampMin0(n: number): number {
  return n < 0 ? 0 : n;
}

export function reduce(
  state: GameState,
  event: GameEvent,
): { state: GameState; effects: Effect[] } {
  switch (event.type) {
    case 'PlayerEnteredZone': {
      return {
        state: { ...state, inZone: true },
        effects: [{ type: 'ShowMessage', text: 'Entered zone' }],
      };
    }

    case 'PlayerLeftZone': {
      return {
        state: { ...state, inZone: false },
        effects: [{ type: 'ShowMessage', text: 'Left zone' }],
      };
    }

    case 'ButtonPressed': {
      const canScore = state.inZone && state.cooldownMs === 0;

      if (!canScore) {
        return {
          state,
          effects: [{ type: 'ShowMessage', text: 'Nope (not in zone or on cooldown)' }],
        };
      }

      return {
        state: {
          ...state,
          score: state.score + 1,
          cooldownMs: 2000,
        },
        effects: [
          { type: 'PlaySound', name: 'ding' },
          { type: 'ShowMessage', text: `Score! Total = ${state.score + 1}` },
        ],
      };
    }

    case 'Tick': {
      if (state.cooldownMs === 0) return { state, effects: [] };

      const nextCooldown = clampMin0(state.cooldownMs - event.dtMs);

      return {
        state: { ...state, cooldownMs: nextCooldown },
        effects: nextCooldown === 0 ? [{ type: 'ShowMessage', text: 'Cooldown ready' }] : [],
      };
    }

    default: {
      const _exhaustive: never = event;
      return { state, effects: [] };
    }
  }
}
