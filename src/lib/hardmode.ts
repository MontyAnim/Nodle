import { NodeData } from '@/types/node';
import { validateGuess, CONTEXT_DOMAINS } from './validation';

export interface HardModeConstraints {
  software?: string;
  category?: string;
  context?: string;
  contextDomain?: string;
  minInputs: number;
  maxInputs: number;
  minOutputs: number;
  maxOutputs: number;
}

/**
 * Derives the current constraints based on past attempts.
 */
export function getHardModeConstraints(attempts: NodeData[], target: NodeData): HardModeConstraints {
  const constraints: HardModeConstraints = {
    minInputs: 0,
    maxInputs: Infinity,
    minOutputs: 0,
    maxOutputs: Infinity,
  };

  for (const attempt of attempts) {
    const validation = validateGuess(attempt, target);

    if (validation.software === 'correct') constraints.software = target.software;
    if (validation.category === 'correct') constraints.category = target.category;
    
    if (validation.context === 'correct') {
      constraints.context = target.context;
    } else if (validation.context === 'partial') {
      constraints.contextDomain = CONTEXT_DOMAINS[target.context];
    }

    if (validation.inputs === 'correct') {
      constraints.minInputs = target.inputs;
      constraints.maxInputs = target.inputs;
    } else if (validation.inputs === 'higher') {
      // The target is higher than the attempt, so attempt + 1 is the new minimum
      constraints.minInputs = Math.max(constraints.minInputs, attempt.inputs + 1);
    } else if (validation.inputs === 'lower') {
      // The target is lower than the attempt, so attempt - 1 is the new maximum
      constraints.maxInputs = Math.min(constraints.maxInputs, attempt.inputs - 1);
    }

    if (validation.outputs === 'correct') {
      constraints.minOutputs = target.outputs;
      constraints.maxOutputs = target.outputs;
    } else if (validation.outputs === 'higher') {
      constraints.minOutputs = Math.max(constraints.minOutputs, attempt.outputs + 1);
    } else if (validation.outputs === 'lower') {
      constraints.maxOutputs = Math.min(constraints.maxOutputs, attempt.outputs - 1);
    }
  }

  return constraints;
}

/**
 * Filters a list of nodes to only include those that satisfy the constraints.
 */
export function filterNodesByHardMode(nodes: NodeData[], constraints: HardModeConstraints): NodeData[] {
  return nodes.filter(node => {
    if (constraints.software && node.software !== constraints.software) return false;
    
    if (constraints.category && node.category.toLowerCase() !== constraints.category.toLowerCase()) return false;
    
    if (constraints.context) {
      if (node.context !== constraints.context) return false;
    } else if (constraints.contextDomain) {
      if (CONTEXT_DOMAINS[node.context] !== constraints.contextDomain) return false;
    }

    if (node.inputs < constraints.minInputs || node.inputs > constraints.maxInputs) return false;
    if (node.outputs < constraints.minOutputs || node.outputs > constraints.maxOutputs) return false;

    return true;
  });
}
