import { NodeData } from '@/types/node';
import { validateGuess } from './validation';
import { ValidationState } from '@/types/validation';

function getEmoji(state: ValidationState, colorblind: boolean): string {
  if (state === 'correct') return colorblind ? '🟧' : '🟩';
  if (state === 'partial') return colorblind ? '🟦' : '🟨';
  return '⬛';
}

/**
 * Genera el texto con emojis para compartir los resultados estilo Wordle.
 */
export function generateEmojiGridText(
  attempts: NodeData[],
  target: NodeData,
  modeName: string,
  dayIndex: number,
  colorblindMode: boolean
): string {
  // Remove "Daily Challenge" or "Reto Diario" from mode name
  const cleanModeName = modeName
    .replace(' Daily Challenge', '')
    .replace('Reto Diario ', '');

  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit'
  });

  const header = `Nodle.online ${cleanModeName} ${dateString} - ${attempts.length}/6`;
  
  const grid = attempts.map(attempt => {
    const v = validateGuess(attempt, target);
    return [
      getEmoji(v.software, colorblindMode),
      getEmoji(v.context, colorblindMode),
      getEmoji(v.category, colorblindMode),
      getEmoji(v.inputs, colorblindMode),
      getEmoji(v.outputs, colorblindMode),
      getEmoji(v.tier, colorblindMode),
    ].join('');
  }).join('\n');

  return `${header}\n\n${grid}`;
}
