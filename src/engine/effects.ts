

import type { Effect } from './types';

export function runEffects(effects: Effect[]): void {
  for (const e of effects) {
    switch (e.type) {
      case 'PlaySound':
        console.log(`[SOUND] ${e.name}`);
        break;
      case 'ShowMessage':
        console.log(`[UI] ${e.text}`);
        break;
    }
  }
}
