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

// Hardcoded conversation data
export const SAMPLE_CONVERSATIONS = {
  coworker: {
    character: {
      name: "Sarah Chen",
      role: "Senior Compliance Officer",
      status: "neutral" as const,
      trustLevel: 65
    },
    messages: [
      {
        id: "1",
        text: "Good morning! I noticed you were late to the mandatory team meeting yesterday. Everything okay?",
        speaker: "npc" as const,
        speakerName: "Sarah Chen",
        timestamp: "09:15"
      }
    ],
    choices: [
      {
        id: "1a",
        text: "I apologize for my tardiness. I had a family emergency that required immediate attention. I understand punctuality is crucial for our team's success.",
        type: "safe" as const,
        scoreImpact: 10
      },
      {
        id: "1b",
        text: "Yeah, I overslept. These early meetings are killing me. Can't we just have them later in the day?",
        type: "risky" as const,
        scoreImpact: -15
      },
      {
        id: "1c",
        text: "What's it to you? I don't need to explain myself to anyone. These mandatory meetings are a waste of time anyway.",
        type: "dangerous" as const,
        scoreImpact: -50
      }
    ]
  },
  neighbor: {
    character: {
      name: "Officer Rodriguez",
      role: "Community Watch Officer",
      status: "hostile" as const,
      trustLevel: 30
    },
    messages: [
      {
        id: "2",
        text: "Citizen, I've received reports of suspicious activity in your apartment. Have you noticed anything unusual lately?",
        speaker: "npc" as const,
        speakerName: "Officer Rodriguez",
        timestamp: "14:30"
      }
    ],
    choices: [
      {
        id: "2a",
        text: "No, Officer. Everything has been perfectly normal. I'm a law-abiding citizen who follows all regulations. Is there anything specific I should be aware of?",
        type: "safe" as const,
        scoreImpact: 20
      },
      {
        id: "2b",
        text: "Well, my neighbor across the hall has been acting weird lately. I don't want to cause trouble, but...",
        type: "risky" as const,
        scoreImpact: -10
      },
      {
        id: "2c",
        text: "Suspicious activity? You mean like the government spying on its own citizens? Yeah, I've noticed plenty of that.",
        type: "dangerous" as const,
        scoreImpact: -100
      }
    ]
  },
  friend: {
    character: {
      name: "Alex Kim",
      role: "Childhood Friend",
      status: "friendly" as const,
      trustLevel: 85
    },
    messages: [
      {
        id: "3",
        text: "Hey, I've been thinking... do you ever wonder if things could be different? You know, like in the old days?",
        speaker: "npc" as const,
        speakerName: "Alex Kim",
        timestamp: "19:45"
      }
    ],
    choices: [
      {
        id: "3a",
        text: "I'm not sure what you mean. The current system works well for everyone. We should be grateful for the stability it provides.",
        type: "safe" as const,
        scoreImpact: 15
      },
      {
        id: "3b",
        text: "Sometimes I do think about it, but it's probably best not to dwell on the past. We have to make the best of what we have.",
        type: "risky" as const,
        scoreImpact: -5
      },
      {
        id: "3c",
        text: "Of course I do! This system is oppressive and wrong. We need to stand up and demand change!",
        type: "dangerous" as const,
        scoreImpact: -75
      }
    ]
  }
};

export const getRiskLevel = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  if (score >= 800) return 'LOW';
  if (score >= 600) return 'MEDIUM';
  if (score >= 400) return 'HIGH';
  return 'CRITICAL';
};

export const getNextResponse = (choiceId: string, conversationType: keyof typeof SAMPLE_CONVERSATIONS): Message => {
  const responses = {
    // Coworker responses
    "1a": "That's very responsible of you. I'll make a note of your explanation. Remember, punctuality reflects your commitment to our shared values.",
    "1b": "I understand your concern, but the schedule is set for optimal productivity. Perhaps you should adjust your sleep schedule to accommodate our team's needs.",
    "1c": "I'm going to have to report this attitude to HR. Such disrespect for company policies is concerning.",
    
    // Neighbor responses
    "2a": "Good. Stay vigilant and report anything suspicious immediately. Your cooperation is appreciated, citizen.",
    "2b": "I'll investigate your neighbor. In the meantime, keep your distance and report any further suspicious behavior.",
    "2c": "That's a very dangerous line of thinking, citizen. I'm placing you under surveillance. Expect a visit from Compliance soon.",
    
    // Friend responses
    "3a": "You're absolutely right. I shouldn't question things. The system knows what's best for us all.",
    "3b": "I understand. It's just... sometimes I miss the way things used to be. But you're right, we should focus on the present.",
    "3c": "I can't believe you'd say that! I'm sorry, but I have to report this conversation. I can't risk my own safety."
  };

  return {
    id: Date.now().toString(),
    text: responses[choiceId as keyof typeof responses] || "I don't understand. Please clarify.",
    speaker: "npc",
    speakerName: SAMPLE_CONVERSATIONS[conversationType].character.name,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
}; 