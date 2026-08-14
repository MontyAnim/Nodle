import { NodeData } from '@/types/node';
import { validateGuess } from './validation';
import { ValidationState } from '@/types/validation';
import { getUTCDayIndex } from './daily';

const COLORS = {
  bg: '#09090b', // zinc-950
  correct: '#10b981', // emerald-500
  partial: '#eab308', // yellow-500
  incorrect: '#27272a', // zinc-800
  text: '#ffffff',
  textMuted: '#a1a1aa'
};

function getStateColor(state: ValidationState): string {
  if (state === 'correct') return COLORS.correct;
  if (state === 'partial') return COLORS.partial;
  return COLORS.incorrect;
}

/**
 * Genera una imagen PNG del tablero actual como Data URL (Base64) usando Canvas 2D.
 */
export function generateShareImage(attempts: NodeData[], target: NodeData): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cols = 6;
  const rows = 6;
  const cellSize = 50;
  const gap = 8;
  const padding = 30;
  const headerHeight = 70;

  canvas.width = padding * 2 + (cols * cellSize) + ((cols - 1) * gap);
  canvas.height = padding * 2 + headerHeight + (rows * cellSize) + ((rows - 1) * gap);

  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header (Nodle logo/text)
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Nodle', canvas.width / 2, padding + 25);
  
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '14px sans-serif';
  const day = getUTCDayIndex();
  ctx.fillText(`Día ${day} • ${attempts.length}/6`, canvas.width / 2, padding + 50);

  // Grid
  const startX = padding;
  const startY = padding + headerHeight;

  for (let r = 0; r < rows; r++) {
    const attempt = attempts[r];
    
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (cellSize + gap);
      const y = startY + r * (cellSize + gap);
      
      if (attempt) {
        const validation = validateGuess(attempt, target);
        // Col order: software, context, category, inputs, outputs, tier
        let state: ValidationState = 'incorrect';
        if (c === 0) state = validation.software;
        else if (c === 1) state = validation.context;
        else if (c === 2) state = validation.category;
        else if (c === 3) state = validation.inputs;
        else if (c === 4) state = validation.outputs;
        else if (c === 5) state = validation.tier;

        ctx.fillStyle = getStateColor(state);
        
        // Dibujar borde curvo
        ctx.beginPath();
        ctx.roundRect(x, y, cellSize, cellSize, 6);
        ctx.fill();

        // Arrows (Unicode para mayor compatibilidad de Canvas)
        if (state === 'higher' || state === 'lower') {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(state === 'higher' ? '↑' : '↓', x + cellSize / 2, y + cellSize / 2 + 2);
        }
      } else {
        // Empty slot
        ctx.fillStyle = '#18181b'; // zinc-900
        ctx.beginPath();
        ctx.roundRect(x, y, cellSize, cellSize, 6);
        ctx.fill();
        
        ctx.strokeStyle = '#27272a'; // zinc-800
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }

  return canvas.toDataURL('image/png');
}
