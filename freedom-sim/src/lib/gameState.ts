import { CHARACTERS, CharacterProfile } from './characters';

export interface Message {
  id: string;
  text: string;
  speaker: 'player' | 'npc';
  speakerName?: string;
  timestamp: string;
}

export interface Choice {
  id: string;
  text: string;
  type: 'safe' | 'risky' | 'dangerous';
  scoreImpact: number;
}

export interface Character {
  name: string;
  role: string;
  status: 'friendly' | 'neutral' | 'hostile';
  trustLevel: number;
}

export interface GameState {
  socialCreditScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentCharacter: Character;
  messages: Message[];
  currentChoices: Choice[];
  gamePhase: 'welcome' | 'conversation' | 'ended';
}

export function getCharacterById(id: string): CharacterProfile | undefined {
  return CHARACTERS.find((c) => c.id === id);
}

export const getRiskLevel = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  if (score >= 800) return 'LOW';
  if (score >= 600) return 'MEDIUM';
  if (score >= 400) return 'HIGH';
  return 'CRITICAL';
}; 