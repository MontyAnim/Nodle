export type ValidationState = 'correct' | 'incorrect' | 'partial' | 'higher' | 'lower';

export interface GuessValidation {
  software: ValidationState;
  context: ValidationState;
  category: ValidationState;
  inputs: ValidationState;
  outputs: ValidationState;
  tier: ValidationState;
}
