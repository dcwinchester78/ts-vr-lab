import type { GameEvent, GameState } from '../engine/types';
import { runEffects } from '../engine/effects';
import { initialState, reduce } from '../engine/reducer';

/**
 * This function simulates a VR world.
 * index.ts will call this.
 */
export function runDemo(): void {
  // Local state for the simulation
  let state: GameState = initialState;

  /**
   * Pretend this function is the VR engine calling us.
   * In Horizon Worlds, this would be:
   *  - trigger enter
   *  - button press
   *  - timer tick
   */
  function dispatch(event: GameEvent) {

const result = reduce(state, event);
    state = result.state;

    console.log(`EVENT: ${event.type}`);
    console.log('STATE:', state);


    // Effects are side effects (sound, UI, animation)
    runEffects(result.effects);

    console.log('---');
  }

  // -------- SIMULATED VR EVENTS --------

  // Button pressed while NOT in zone → should fail
  dispatch({ type: 'ButtonPressed' });

  // Player enters trigger zone
  dispatch({ type: 'PlayerEnteredZone' });

  // Button pressed → should score
  dispatch({ type: 'ButtonPressed' });

  // Button pressed again → should fail (cooldown)
  dispatch({ type: 'ButtonPressed' });

  // Time passes (cooldown ticking)
  dispatch({ type: 'Tick', dtMs: 1000 });

  // Still on cooldown
  dispatch({ type: 'ButtonPressed' });

  // Cooldown finishes
  dispatch({ type: 'Tick', dtMs: 1000 });

  // Button pressed → should score again
  dispatch({ type: 'ButtonPressed' });
}
