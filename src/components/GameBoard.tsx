import React from 'react';
import { NodeData } from '@/types/node';
import { validateGuess } from '@/lib/validation';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { ValidationState } from '@/types/validation';

interface GameBoardProps {
  attempts: NodeData[];
  target: NodeData;
}

const MAX_ATTEMPTS = 6;

function getBgColor(state: ValidationState): string {
  switch (state) {
    case 'correct': return 'bg-emerald-500 border-emerald-600 text-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    case 'partial': return 'bg-yellow-500 border-yellow-600 text-yellow-950';
    case 'incorrect':
    case 'higher':
    case 'lower':
      return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    default:
      return 'bg-zinc-900 border-zinc-800';
  }
}

function renderCell(value: string | number, state: ValidationState, label: string) {
  return (
    <div className={`relative flex flex-col items-center justify-center w-full h-16 sm:h-20 rounded-md border-2 transition-all ${getBgColor(state)}`}>
      <span className="text-[10px] sm:text-xs opacity-70 mb-1">{label}</span>
      <span className="font-bold text-xs sm:text-sm text-center leading-tight px-1">
        {value}
      </span>
      {state === 'higher' && <ArrowUp className="absolute top-1 right-1 w-3 h-3 opacity-50" />}
      {state === 'lower' && <ArrowDown className="absolute top-1 right-1 w-3 h-3 opacity-50" />}
    </div>
  );
}

export function GameBoard({ attempts, target }: GameBoardProps) {
  const rows = Array.from({ length: MAX_ATTEMPTS });

  return (
    <div className="w-full max-w-4xl flex flex-col gap-3 mt-8">
      {rows.map((_, i) => {
        const attempt = attempts[i];
        
        if (!attempt) {
          // Fila Vacía
          return (
            <div key={i} className="grid grid-cols-6 gap-2 opacity-30">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="w-full h-16 sm:h-20 rounded-md border-2 border-zinc-800 bg-zinc-900/50" />
              ))}
            </div>
          );
        }

        const validation = validateGuess(attempt, target);

        return (
          <div key={i} className="flex flex-col gap-1 mb-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <h3 className="text-sm font-semibold text-zinc-300 ml-1">{attempt.name}</h3>
            <div className="grid grid-cols-6 gap-2">
              {renderCell(attempt.software, validation.software, 'Software')}
              {renderCell(attempt.context, validation.context, 'Contexto')}
              {renderCell(attempt.category, validation.category, 'Categoría')}
              {renderCell(attempt.inputs, validation.inputs, 'Entradas')}
              {renderCell(attempt.outputs, validation.outputs, 'Salidas')}
              {renderCell(`Tier ${attempt.frequency_tier}`, validation.tier, 'Tier')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
