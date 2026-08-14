import { NodeData } from '@/types/node';
import { ValidationState, GuessValidation } from '@/types/validation';

/**
 * Mapping of node contexts to functional domains to allow partial matches.
 */
const CONTEXT_DOMAINS: Record<string, string> = {
  // Shading / Rendering
  'Shader': 'shading',           // Blender
  'Shader Graph': 'shading',     // Unity
  'Material': 'shading',         // Unreal
  'VOP': 'shading',              // Houdini
  
  // Geometry / Logic
  'Geometry': 'logic',           // Blender
  'Blueprint': 'logic',          // Unreal
  'SOP': 'logic',                // Houdini
  
  // Compositing / Texturing
  'Compositing': 'compositing',  // Substance
};

/**
 * Evaluates a numeric value against a target.
 */
function evaluateNumeric(guessVal: number, targetVal: number): ValidationState {
  if (guessVal === targetVal) return 'correct';
  if (guessVal < targetVal) return 'higher'; // Target is higher
  return 'lower'; // Target is lower
}

/**
 * Evaluates a guess against the target daily node.
 */
export function validateGuess(guess: NodeData, target: NodeData): GuessValidation {
  return {
    software: guess.software === target.software ? 'correct' : 'incorrect',
    
    context: (() => {
      if (guess.context === target.context) return 'correct';
      // Evaluate partial match via domains
      const guessDomain = CONTEXT_DOMAINS[guess.context];
      const targetDomain = CONTEXT_DOMAINS[target.context];
      if (guessDomain && targetDomain && guessDomain === targetDomain) {
        return 'partial';
      }
      return 'incorrect';
    })(),
    
    category: guess.category.toLowerCase() === target.category.toLowerCase() ? 'correct' : 'incorrect',
    
    inputs: evaluateNumeric(guess.inputs, target.inputs),
    
    outputs: evaluateNumeric(guess.outputs, target.outputs),
    
    tier: guess.frequency_tier === target.frequency_tier ? 'correct' : 'incorrect',
  };
}
