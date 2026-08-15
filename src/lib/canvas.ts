import { NodeData } from '@/types/node';
import { validateGuess } from './validation';
import { ValidationState } from '@/types/validation';
import { getUTCDayIndex } from './daily';

const COLORS = {
  bg: '#09090b', // zinc-950
  correct: '#10b981', // emerald-500
  partial: '#eab308', // yellow-500
  correctCb: '#E35622', // Colorblind Correct
  partialCb: '#0070B8', // Colorblind Partial
  incorrect: '#27272a', // zinc-800
  text: '#ffffff',
  textMuted: '#a1a1aa'
};

function getStateColor(state: ValidationState, isColorblind: boolean): string {
  if (state === 'correct') return isColorblind ? COLORS.correctCb : COLORS.correct;
  if (state === 'partial') return isColorblind ? COLORS.partialCb : COLORS.partial;
  return COLORS.incorrect;
}

function drawArrow(ctx: CanvasRenderingContext2D, cx: number, cy: number, direction: 'higher' | 'lower') {
  const size = 6;
  ctx.beginPath();
  if (direction === 'higher') {
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx - size, cy + size);
    ctx.lineTo(cx + size, cy + size);
  } else {
    ctx.moveTo(cx, cy + size);
    ctx.lineTo(cx - size, cy - size);
    ctx.lineTo(cx + size, cy - size);
  }
  ctx.fill();
}

/**
 * Dibuja el tablero en un canvas y lo retorna.
 */
function drawCanvas(attempts: NodeData[], target: NodeData, isColorblind: boolean): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const cols = 6;
  const rows = 6;
  const cellSize = 50;
  const gap = 8;
  const padding = 30;
  const headerHeight = 70;
  const footerHeight = 40;

  // Alta resolución
  const pixelRatio = typeof window !== 'undefined' ? (window.devicePixelRatio || 2) : 2;

  const logicalWidth = padding * 2 + (cols * cellSize) + ((cols - 1) * gap);
  const logicalHeight = padding * 2 + headerHeight + (rows * cellSize) + ((rows - 1) * gap) + footerHeight;

  canvas.width = logicalWidth * pixelRatio;
  canvas.height = logicalHeight * pixelRatio;

  ctx.scale(pixelRatio, pixelRatio);

  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Header (Nodle logo/text)
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Nodle', logicalWidth / 2, padding + 25);
  
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '14px sans-serif';
  const formatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' });
  const dateStr = formatter.format(new Date());
  ctx.fillText(`${dateStr} • ${attempts.length}/6`, logicalWidth / 2, padding + 50);

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

        ctx.fillStyle = getStateColor(state, isColorblind);
        
        // Dibujar borde curvo
        ctx.beginPath();
        ctx.roundRect(x, y, cellSize, cellSize, 6);
        ctx.fill();

        // Arrows
        if (state === 'higher' || state === 'lower') {
          ctx.fillStyle = '#ffffff';
          drawArrow(ctx, x + cellSize / 2, y + cellSize / 2, state);
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

  // Footer (nodle.app watermark)
  ctx.fillStyle = '#52525b'; // zinc-600
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('nodle.app', logicalWidth / 2, logicalHeight - 15);

  return canvas;
}

/**
 * Genera una imagen PNG del tablero actual como Data URL (Base64) usando Canvas 2D.
 */
export function generateShareImage(attempts: NodeData[], target: NodeData, isColorblind: boolean = false): string {
  const canvas = drawCanvas(attempts, target, isColorblind);
  return canvas ? canvas.toDataURL('image/png') : '';
}

/**
 * Genera y copia la imagen PNG al portapapeles del sistema operativo usando la Clipboard API.
 */
export async function copyShareImageToClipboard(attempts: NodeData[], target: NodeData, isColorblind: boolean = false): Promise<boolean> {
  try {
    const canvas = drawCanvas(attempts, target, isColorblind);
    if (!canvas) return false;

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;

    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    return false;
  }
}
