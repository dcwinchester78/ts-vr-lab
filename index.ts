type GameEvent =
  | { type: 'PlayerEnteredZone' }
  | { type: 'PlayerLeftZone' }
  | { type: 'ButtonPressed' }
  | { type: 'Tick'; dtMs: number };

  const Sounds = ['ding', 'error', 'ready'] as const;
  type SoundName = (typeof Sounds)[number];


type Effect =
  | { type: 'PlaySound'; name: SoundName }
  | { type: 'ShowMessage'; text: string };


type GameState = {
  inZone: boolean;
  score: number;
  cooldownMs: number;
};

const initialState: GameState = {
  inZone: false,
  score: 0,
  cooldownMs: 0,
};

function clampMin0(n: number): number {
  return n < 0 ? 0 : n;
}

function reduce(state: GameState, event: GameEvent): { state: GameState; effects: Effect[] } {
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
      // Exhaustiveness check (if you add an event and forget to handle it, TS will complain here)
      const _exhaustive: never = event;
      return { state, effects: [] };
    }
  }
}

const effectHandlers: Record<Effect['type'], (e: any) => void> = {
  PlaySound: (e: Extract<Effect, { type: 'PlaySound' }>) => {
    console.log(`[SOUND] ${e.name}`);
  },
  ShowMessage: (e: Extract<Effect, { type: 'ShowMessage' }>) => {
    console.log(`[UI] ${e.text}`);
  },
};

function runEffects(effects: Effect[]): void {
  for (const e of effects) {
    effectHandlers[e.type](e);
  }
}


// --- Simulation (pretend these events came from VR interactions) ---
let state = initialState;

function dispatch(event: GameEvent) {
  const result = reduce(state, event);
  state = result.state;
  console.log(`EVENT: ${event.type}`, event.type === 'Tick' ? `dtMs=${event.dtMs}` : '');
  console.log('STATE:', state);
  runEffects(result.effects);
  console.log('---');
}

dispatch({ type: 'ButtonPressed' }); // should fail (not in zone)
dispatch({ type: 'PlayerEnteredZone' });
dispatch({ type: 'ButtonPressed' }); // should score
dispatch({ type: 'ButtonPressed' }); // should fail (cooldown)

dispatch({ type: 'Tick', dtMs: 1000 });
dispatch({ type: 'ButtonPressed' }); // still cooldown
dispatch({ type: 'Tick', dtMs: 1000 });
dispatch({ type: 'ButtonPressed' }); // should score again
