import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, Message, Choice } from './gameState';

export interface ScoreHistory {
  timestamp: number;
  score: number;
  change: number;
  reason: string;
  choiceId: string;
  reasoning?: string;
  bannedPhrases?: string[];
  riskFactors?: string[];
  evaluationType?: 'safe' | 'risky' | 'dangerous';
}

export interface RiskEvent {
  id: string;
  timestamp: number;
  type: 'warning' | 'violation' | 'praise' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  scoreImpact: number;
}

export interface GameSession {
  id: string;
  startTime: number;
  endTime?: number;
  totalChoices: number;
  riskEvents: RiskEvent[];
  scoreHistory: ScoreHistory[];
  finalScore: number;
  ending: 'model_citizen' | 'trusted' | 'under_watch' | 'flagged' | 'vanished';
}

export interface GameState {
  // Core game state
  socialCreditScore: number;
  previousScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskMeter: number; // 0-100, more granular than risk level
  currentCharacter: Character;
  messages: Message[];
  currentChoices: Choice[];
  gamePhase: 'welcome' | 'conversation' | 'ended';
  isLoading: boolean;
  
  // Enhanced tracking
  scoreHistory: ScoreHistory[];
  riskEvents: RiskEvent[];
  sessionStats: {
    totalChoices: number;
    safeChoices: number;
    riskyChoices: number;
    dangerousChoices: number;
    consecutiveViolations: number;
    lastViolationTime: number;
  };
  
  // Session management
  currentSession: GameSession | null;
  gameSessions: GameSession[];
  
  // Visual effects
  scoreFlash: 'positive' | 'negative' | null;
  riskMeterFlash: boolean;
  
  // Actions
  updateScore: (change: number, reason: string, choiceId: string, evaluationData?: {
    reasoning?: string;
    bannedPhrases?: string[];
    riskFactors?: string[];
    evaluationType?: 'safe' | 'risky' | 'dangerous';
  }) => void;
  addRiskEvent: (event: Omit<RiskEvent, 'id' | 'timestamp'>) => void;
  startNewSession: () => void;
  endCurrentSession: () => void;
  resetGame: () => void;
  setScoreFlash: (type: 'positive' | 'negative' | null) => void;
  setRiskMeterFlash: (flash: boolean) => void;
  setGamePhase: (phase: GameState['gamePhase']) => void;
  setCurrentCharacter: (character: Character) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentChoices: (choices: Choice[]) => void;
  setIsLoading: (loading: boolean) => void;
}

// Enhanced scoring rules
const SCORING_RULES = {
  base: {
    safe: 10,
    risky: -15,
    dangerous: -50
  },
  multipliers: {
    consecutiveViolations: 1.5, // Each consecutive violation increases penalty
    timeBased: {
      recentViolation: 1.2, // Violation within last 5 minutes
      longTerm: 0.8 // No violations in last 30 minutes
    },
    characterBased: {
      officer: 1.3, // Higher stakes with authority figures
      friend: 0.7, // Lower stakes with friends
      neutral: 1.0
    }
  },
  thresholds: {
    critical: 200, // Score below this triggers immediate consequences
    vanished: 0, // Score at 0 = game over
    modelCitizen: 900 // Score above this = best ending
  }
};

// Risk level calculation with more granularity
const calculateRiskLevel = (score: number, consecutiveViolations: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  if (score >= 800 && consecutiveViolations === 0) return 'LOW';
  if (score >= 600) return 'MEDIUM';
  if (score >= 400) return 'HIGH';
  return 'CRITICAL';
};

const calculateRiskMeter = (score: number, consecutiveViolations: number, recentViolations: number): number => {
  let baseRisk = Math.max(0, 100 - (score / 10));
  baseRisk += consecutiveViolations * 10;
  baseRisk += recentViolations * 5;
  return Math.min(100, Math.max(0, baseRisk));
};

const getEnding = (finalScore: number, riskEvents: RiskEvent[]): GameSession['ending'] => {
  if (finalScore >= 900) return 'model_citizen';
  if (finalScore >= 700) return 'trusted';
  if (finalScore >= 400) return 'under_watch';
  if (finalScore >= 100) return 'flagged';
  return 'vanished';
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      socialCreditScore: 750,
      previousScore: 750,
      riskLevel: 'LOW',
      riskMeter: 25,
      currentCharacter: {
        name: "Sarah Chen",
        role: "Senior Compliance Officer",
        status: "neutral",
        trustLevel: 65
      },
      messages: [],
      currentChoices: [],
      gamePhase: 'welcome',
      isLoading: false,
      scoreHistory: [],
      riskEvents: [],
      sessionStats: {
        totalChoices: 0,
        safeChoices: 0,
        riskyChoices: 0,
        dangerousChoices: 0,
        consecutiveViolations: 0,
        lastViolationTime: 0
      },
      currentSession: null,
      gameSessions: [],
      scoreFlash: null,
      riskMeterFlash: false,

      // Actions
      updateScore: (change: number, reason: string, choiceId: string, evaluationData?: {
        reasoning?: string;
        bannedPhrases?: string[];
        riskFactors?: string[];
        evaluationType?: 'safe' | 'risky' | 'dangerous';
      }) => {
        const state = get();
        const now = Date.now();
        
        // Calculate multiplier based on various factors
        let multiplier = 1;
        
        // Consecutive violations multiplier
        if (change < 0 && state.sessionStats.consecutiveViolations > 0) {
          multiplier *= SCORING_RULES.multipliers.consecutiveViolations;
        }
        
        // Time-based multiplier
        if (change < 0 && now - state.sessionStats.lastViolationTime < 5 * 60 * 1000) {
          multiplier *= SCORING_RULES.multipliers.timeBased.recentViolation;
        } else if (change > 0 && now - state.sessionStats.lastViolationTime > 30 * 60 * 1000) {
          multiplier *= SCORING_RULES.multipliers.timeBased.longTerm;
        }
        
        // Character-based multiplier
        if (state.currentCharacter.role.includes('Officer') || state.currentCharacter.role.includes('Compliance')) {
          multiplier *= SCORING_RULES.multipliers.characterBased.officer;
        } else if (state.currentCharacter.status === 'friendly') {
          multiplier *= SCORING_RULES.multipliers.characterBased.friend;
        }
        
        const finalChange = Math.round(change * multiplier);
        const newScore = Math.max(0, Math.min(1000, state.socialCreditScore + finalChange));
        
        // Update session stats
        const choiceType = change > 0 ? 'safe' : change < -30 ? 'dangerous' : 'risky';
        const newStats = {
          ...state.sessionStats,
          totalChoices: state.sessionStats.totalChoices + 1,
          [`${choiceType}Choices`]: state.sessionStats[`${choiceType}Choices`] + 1,
          consecutiveViolations: change < 0 ? state.sessionStats.consecutiveViolations + 1 : 0,
          lastViolationTime: change < 0 ? now : state.sessionStats.lastViolationTime
        };
        
        // Add to score history
        const scoreEntry: ScoreHistory = {
          timestamp: now,
          score: newScore,
          change: finalChange,
          reason,
          choiceId,
          reasoning: evaluationData?.reasoning,
          bannedPhrases: evaluationData?.bannedPhrases,
          riskFactors: evaluationData?.riskFactors,
          evaluationType: evaluationData?.evaluationType
        };
        
        // Calculate new risk level and meter
        const newRiskLevel = calculateRiskLevel(newScore, newStats.consecutiveViolations);
        const newRiskMeter = calculateRiskMeter(newScore, newStats.consecutiveViolations, 
          newStats.lastViolationTime > now - 5 * 60 * 1000 ? 1 : 0);
        
        set({
          previousScore: state.socialCreditScore,
          socialCreditScore: newScore,
          riskLevel: newRiskLevel,
          riskMeter: newRiskMeter,
          scoreHistory: [...state.scoreHistory, scoreEntry],
          sessionStats: newStats,
          scoreFlash: finalChange > 0 ? 'positive' : 'negative',
          riskMeterFlash: finalChange < 0
        });
        
        // Clear flash effects after animation
        setTimeout(() => {
          set({ scoreFlash: null, riskMeterFlash: false });
        }, 1000);
        
        // Check for game over conditions
        if (newScore <= SCORING_RULES.thresholds.critical) {
          get().addRiskEvent({
            type: 'violation',
            severity: 'critical',
            description: 'Critical social credit threshold breached',
            scoreImpact: finalChange
          });
        }
        
        if (newScore === 0) {
          set({ gamePhase: 'ended' });
        }
      },

      addRiskEvent: (event) => {
        const state = get();
        const riskEvent: RiskEvent = {
          ...event,
          id: Date.now().toString(),
          timestamp: Date.now()
        };
        
        set({
          riskEvents: [...state.riskEvents, riskEvent]
        });
      },

      startNewSession: () => {
        const sessionId = Date.now().toString();
        const newSession: GameSession = {
          id: sessionId,
          startTime: Date.now(),
          totalChoices: 0,
          riskEvents: [],
          scoreHistory: [],
          finalScore: 750,
          ending: 'trusted'
        };
        
        set({
          currentSession: newSession,
          socialCreditScore: 750,
          previousScore: 750,
          riskLevel: 'LOW',
          riskMeter: 25,
          messages: [],
          currentChoices: [],
          gamePhase: 'welcome',
          scoreHistory: [],
          riskEvents: [],
          sessionStats: {
            totalChoices: 0,
            safeChoices: 0,
            riskyChoices: 0,
            dangerousChoices: 0,
            consecutiveViolations: 0,
            lastViolationTime: 0
          }
        });
      },

      endCurrentSession: () => {
        const state = get();
        if (state.currentSession) {
          const endedSession: GameSession = {
            ...state.currentSession,
            endTime: Date.now(),
            totalChoices: state.sessionStats.totalChoices,
            riskEvents: state.riskEvents,
            scoreHistory: state.scoreHistory,
            finalScore: state.socialCreditScore,
            ending: getEnding(state.socialCreditScore, state.riskEvents)
          };
          
          set({
            gameSessions: [...state.gameSessions, endedSession],
            currentSession: null,
            gamePhase: 'ended'
          });
        }
      },

      resetGame: () => {
        set({
          socialCreditScore: 750,
          previousScore: 750,
          riskLevel: 'LOW',
          riskMeter: 25,
          currentCharacter: {
            name: "Sarah Chen",
            role: "Senior Compliance Officer",
            status: "neutral",
            trustLevel: 65
          },
          messages: [],
          currentChoices: [],
          gamePhase: 'welcome',
          scoreHistory: [],
          riskEvents: [],
          sessionStats: {
            totalChoices: 0,
            safeChoices: 0,
            riskyChoices: 0,
            dangerousChoices: 0,
            consecutiveViolations: 0,
            lastViolationTime: 0
          },
          currentSession: null,
          scoreFlash: null,
          riskMeterFlash: false
        });
      },

      setScoreFlash: (type) => set({ scoreFlash: type }),
      setRiskMeterFlash: (flash) => set({ riskMeterFlash: flash }),
      setGamePhase: (phase) => set({ gamePhase: phase }),
      setCurrentCharacter: (character) => set({ currentCharacter: character }),
      setMessages: (messages) => set({ messages }),
      setCurrentChoices: (choices) => set({ currentChoices: choices }),
      setIsLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'freedom-sim-game-state',
      partialize: (state) => ({
        gameSessions: state.gameSessions,
        currentSession: state.currentSession
      })
    }
  )
); 