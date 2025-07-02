// Character profiles for the story-driven system

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  status: 'friendly' | 'neutral' | 'hostile';
  trustLevel: number;
  personality: string;
  dialogueStyle: string;
  intro: (playerName?: string) => string;
}

export const CHARACTERS: CharacterProfile[] = [
  {
    id: 'boss',
    name: 'Evelyn Grant',
    role: 'Division Manager',
    status: 'neutral',
    trustLevel: 60,
    personality: 'Strict, pragmatic, values efficiency and loyalty. Has little patience for excuses.',
    dialogueStyle: 'Formal, direct, sometimes cold. Uses corporate jargon and expects compliance.',
    intro: (playerName) => `You enter your manager's office. Evelyn Grant looks up from her terminal, her eyes sharp behind thin glasses. "${playerName || 'Employee'}, I hope you have a good reason for being here. Time is money."`,
  },
  {
    id: 'neighbor',
    name: 'Mrs. Dolores Finch',
    role: 'Nosy Neighbor',
    status: 'hostile',
    trustLevel: 35,
    personality: 'Gossipy, suspicious, always watching. Loves reporting others to authorities.',
    dialogueStyle: 'Passive-aggressive, nosy, often hints at knowing more than she says.',
    intro: (playerName) => `You hear a knock at your door. Mrs. Finch leans in, voice low. "${playerName || 'Dear'}, I couldn't help but notice some unusual noises from your apartment last night... Care to explain?"`,
  },
  {
    id: 'cop',
    name: 'Officer Marcus Doyle',
    role: 'Patrol Cop',
    status: 'hostile',
    trustLevel: 25,
    personality: 'Authoritarian, by-the-book, enjoys his power. Quick to suspect and slow to trust.',
    dialogueStyle: 'Gruff, intimidating, uses short sentences. Demands answers.',
    intro: (playerName) => `A uniformed officer blocks your path. Officer Doyle's hand rests on his baton. "${playerName || 'Citizen'}, step aside. I have some questions for you."`,
  },
  {
    id: 'kid',
    name: 'Jamie Lin',
    role: 'Neighborhood Kid',
    status: 'friendly',
    trustLevel: 80,
    personality: 'Curious, energetic, sometimes naive. Looks up to adults but questions authority.',
    dialogueStyle: 'Casual, playful, sometimes blunt. Asks a lot of questions.',
    intro: (playerName) => `You find Jamie bouncing a ball in the hallway. They grin. "Hey ${playerName || 'there'}! Wanna play? Or are you too busy being a grown-up?"`,
  },
]; 