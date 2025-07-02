'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from "next/image";
import { Eye, Shield, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CharacterDisplay } from "@/components/game/CharacterDisplay";
import { CreditScoreTracker } from "@/components/game/CreditScoreTracker";
import { ConversationArea } from "@/components/game/ConversationArea";
import { RiskEventLog } from "@/components/game/RiskEventLog";
import { SessionStats } from "@/components/game/SessionStats";
import { GameEnding } from "@/components/game/GameEnding";
import { AIEvaluationFeedback } from "@/components/game/AIEvaluationFeedback";
import { CustomMessageInput } from "@/components/game/CustomMessageInput";
import { useGameStore } from "@/lib/gameStore";
import {
  Message,
  Choice,
  Character,
  getCharacterById
} from "@/lib/gameState";
import { CHARACTERS, CharacterProfile } from '@/lib/characters';

async function fetchGptChoices(messages: Message[], character: Character, numChoices = 3): Promise<Choice[]> {
  const res = await fetch('/api/gpt-replies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, character, numChoices })
  });
  const data = await res.json();
  return data.choices || [];
}

async function fetchGptScore(messages: Message[], character: Character, playerReply: string) {
  const res = await fetch('/api/gpt-replies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, character, playerReply, mode: 'score' })
  });
  const data = await res.json();
  return data.score || { scoreImpact: 0, type: 'safe', reasoning: 'No evaluation', bannedPhrases: [], riskFactors: [] };
}

// Story progression state
const STORY_SEQUENCE: string[] = ['boss', 'neighbor', 'cop', 'kid'];

export default function Home() {
  const {
    socialCreditScore,
    riskLevel,
    currentCharacter,
    messages,
    currentChoices,
    gamePhase,
    isLoading,
    updateScore,
    setGamePhase,
    setCurrentCharacter,
    setMessages,
    setCurrentChoices,
    setIsLoading,
    startNewSession,
    endCurrentSession,
    resetGame
  } = useGameStore();

  const [evaluationFeedback, setEvaluationFeedback] = useState<{
    reasoning: string;
    bannedPhrases: string[];
    riskFactors: string[];
    evaluationType: 'safe' | 'risky' | 'dangerous';
    scoreImpact: number;
    isVisible: boolean;
  }>({
    reasoning: '',
    bannedPhrases: [],
    riskFactors: [],
    evaluationType: 'safe',
    scoreImpact: 0,
    isVisible: false
  });

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [playerName] = useState('Player'); // Optionally make this dynamic

  // Move startStoryConversation here so it can access all state
  const startStoryConversation = useCallback(async (characterId?: string) => {
    const id = characterId || STORY_SEQUENCE[storyIndex];
    const character = getCharacterById(id) as CharacterProfile;
    if (!character) return;
    setGamePhase('conversation');
    setCurrentCharacter(character);
    // Dynamic intro as a system/narrator message
    const introMessage: Message = {
      id: `intro-${id}`,
      text: character.intro(playerName),
      speaker: 'npc',
      speakerName: character.name,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([introMessage]);
    setConversationHistory((prev: Message[]) => [...prev, introMessage]);
    setIsLoading(true);
    const gptChoices = await fetchGptChoices([introMessage], character);
    setCurrentChoices(gptChoices.map((c: Choice, idx: number) => ({ ...c, id: `gpt-${Date.now()}-${idx}` })));
    setIsLoading(false);
  }, [storyIndex, setGamePhase, setCurrentCharacter, setMessages, setIsLoading, setCurrentChoices, setConversationHistory, playerName]);

  // Initialize game session on mount
  useEffect(() => {
    if (gamePhase === 'welcome') {
      setStoryIndex(0);
      setConversationHistory([]);
      startStoryConversation(STORY_SEQUENCE[0]);
    }
  }, [gamePhase, startStoryConversation]);

  // Progress to next story character
  const progressStory = () => {
    if (storyIndex < STORY_SEQUENCE.length - 1) {
      setStoryIndex(storyIndex + 1);
      startStoryConversation(STORY_SEQUENCE[storyIndex + 1]);
    } else {
      endCurrentSession();
    }
  };

  const handleChoiceSelect = async (choiceId: string) => {
    setIsLoading(true);
    const selectedChoice = currentChoices.find(choice => choice.id === choiceId);
    if (!selectedChoice) return;
    const scoreEvaluation = await fetchGptScore(messages, currentCharacter, selectedChoice.text);
    setEvaluationFeedback({
      reasoning: scoreEvaluation.reasoning,
      bannedPhrases: scoreEvaluation.bannedPhrases,
      riskFactors: scoreEvaluation.riskFactors,
      evaluationType: scoreEvaluation.type,
      scoreImpact: scoreEvaluation.scoreImpact,
      isVisible: true
    });
    setTimeout(() => {
      setEvaluationFeedback(prev => ({ ...prev, isVisible: false }));
    }, 5000);
    updateScore(
      scoreEvaluation.scoreImpact,
      `AI Evaluation: ${scoreEvaluation.reasoning}`,
      choiceId,
      {
        reasoning: scoreEvaluation.reasoning,
        bannedPhrases: scoreEvaluation.bannedPhrases,
        riskFactors: scoreEvaluation.riskFactors,
        evaluationType: scoreEvaluation.type
      }
    );
    const playerMessage: Message = {
      id: Date.now().toString(),
      text: selectedChoice.text,
      speaker: 'player',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...messages, playerMessage];
    setMessages(updatedMessages);
    setConversationHistory((prev) => [...prev, playerMessage]);
    // 1. Get NPC response
    const npcRes = await fetch('/api/gpt-replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages, character: currentCharacter, mode: 'npc' })
    });
    const npcData = await npcRes.json();
    const npcMessage: Message = {
      id: Date.now().toString() + '-npc',
      text: npcData.npc || '...',
      speaker: 'npc',
      speakerName: currentCharacter.name,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const convoWithNpc = [...updatedMessages, npcMessage];
    setMessages(convoWithNpc);
    setConversationHistory((prev) => [...prev, npcMessage]);
    // 2. Get new player choices
    const gptChoices = await fetchGptChoices(convoWithNpc, currentCharacter);
    const nextChoices = gptChoices.map((c: Choice, idx: number) => ({ ...c, id: `gpt-${Date.now()}-${idx}` }));
    setCurrentChoices(nextChoices);
    setIsLoading(false);
    // If conversation is over (e.g., no more choices), progress story
    if (nextChoices.length === 0) {
      progressStory();
    }
    // Check if game should end
    const newScore = socialCreditScore + scoreEvaluation.scoreImpact;
    if (newScore <= 0) {
      endCurrentSession();
    }
  };

  const handleCustomMessage = async (message: string) => {
    setIsLoading(true);
    const scoreEvaluation = await fetchGptScore(messages, currentCharacter, message);
    setEvaluationFeedback({
      reasoning: scoreEvaluation.reasoning,
      bannedPhrases: scoreEvaluation.bannedPhrases,
      riskFactors: scoreEvaluation.riskFactors,
      evaluationType: scoreEvaluation.type,
      scoreImpact: scoreEvaluation.scoreImpact,
      isVisible: true
    });
    setTimeout(() => {
      setEvaluationFeedback(prev => ({ ...prev, isVisible: false }));
    }, 5000);
    updateScore(
      scoreEvaluation.scoreImpact,
      `AI Evaluation: ${scoreEvaluation.reasoning}`,
      `custom-${Date.now()}`,
      {
        reasoning: scoreEvaluation.reasoning,
        bannedPhrases: scoreEvaluation.bannedPhrases,
        riskFactors: scoreEvaluation.riskFactors,
        evaluationType: scoreEvaluation.type
      }
    );
    const playerMessage: Message = {
      id: Date.now().toString(),
      text: message,
      speaker: 'player',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...messages, playerMessage];
    setMessages(updatedMessages);
    setConversationHistory((prev) => [...prev, playerMessage]);
    // 1. Get NPC response
    const npcRes = await fetch('/api/gpt-replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages, character: currentCharacter, mode: 'npc' })
    });
    const npcData = await npcRes.json();
    const npcMessage: Message = {
      id: Date.now().toString() + '-npc',
      text: npcData.npc || '...',
      speaker: 'npc',
      speakerName: currentCharacter.name,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const convoWithNpc = [...updatedMessages, npcMessage];
    setMessages(convoWithNpc);
    setConversationHistory((prev) => [...prev, npcMessage]);
    // 2. Get new player choices
    const gptChoices = await fetchGptChoices(convoWithNpc, currentCharacter);
    const nextChoices = gptChoices.map((c: Choice, idx: number) => ({ ...c, id: `gpt-${Date.now()}-${idx}` }));
    setCurrentChoices(nextChoices);
    setIsLoading(false);
    if (nextChoices.length === 0) {
      progressStory();
    }
    const newScore = socialCreditScore + scoreEvaluation.scoreImpact;
    if (newScore <= 0) {
      endCurrentSession();
    }
  };

  const handleResetGame = () => {
    endCurrentSession();
    resetGame();
    startNewSession();
  };

  const toggleCustomMode = () => {
    setIsCustomMode(!isCustomMode);
  };

  return (
    <div className="scanlines min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-red-800">
      {/* Header */}
      <header className="propaganda-border bg-black/80 backdrop-blur-sm p-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 surveillance-glow">
              <Image
                src="/logo.svg"
                alt="Free Speech Simulator Logo"
                width={48}
                height={48}
                className="w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white futuristic-text">
                FREE SPEECH SIMULATOR
              </h1>
              <p className="text-red-300 text-sm">Social Credit Edition</p>
            </div>
          </div>
          
          {/* Social Credit Score Display */}
          <div className="text-right">
            <div className="text-sm text-gray-300">Social Credit Score</div>
            <div className={`text-3xl font-bold ${
              socialCreditScore >= 800 ? 'text-green-400' : 
              socialCreditScore >= 600 ? 'text-yellow-400' : 
              socialCreditScore >= 400 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {socialCreditScore}
            </div>
            <div className={`text-xs ${
              riskLevel === 'LOW' ? 'text-green-400' : 
              riskLevel === 'MEDIUM' ? 'text-yellow-400' : 
              riskLevel === 'HIGH' ? 'text-orange-400' : 'text-red-400'
            }`}>
              Risk Level: {riskLevel}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="max-w-6xl mx-auto px-4">
        {gamePhase === 'welcome' ? (
          /* Welcome Screen */
          <Card className="bg-black/60 backdrop-blur-sm border-red-600/50 holographic">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-white futuristic-text distorted">
                WELCOME TO THE NEW ORDER
              </CardTitle>
              <CardDescription className="text-xl text-gray-300">
                Navigate the Surveillance State
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-red-600 rounded-full flex items-center justify-center surveillance-glow mb-6">
                  <Eye className="text-white text-4xl" />
                </div>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  You are a citizen trying to make it to payday without getting &ldquo;re-educated.&rdquo; 
                  Navigate conversations carefully - your Social Credit Score depends on it.
                </p>
              </div>

              {/* Game Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-red-900/30 border-red-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Status</h3>
                    </div>
                    <p className="text-green-400">Employed</p>
                    <p className="text-yellow-400 text-sm">Under Surveillance</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-900/30 border-red-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-5 w-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-white">Location</h3>
                    </div>
                    <p className="text-gray-300">Sector 7</p>
                    <p className="text-gray-400 text-sm">Zone: Residential</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-900/30 border-red-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Reputation</h3>
                    </div>
                    <p className="text-gray-300">Average Citizen</p>
                    <p className="text-gray-400 text-sm">No flags detected</p>
                  </CardContent>
                </Card>
              </div>

              {/* Start Game Buttons */}
              <div className="text-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="propaganda" 
                    size="xl" 
                    className="futuristic-text"
                    onClick={() => startStoryConversation('boss')}
                  >
                    <span>BOSS</span>
                    <br />
                    <span className="text-sm font-normal">Office Politics</span>
                  </Button>
                  
                  <Button 
                    variant="propaganda" 
                    size="xl" 
                    className="futuristic-text"
                    onClick={() => startStoryConversation('neighbor')}
                  >
                    <span>NEIGHBOR</span>
                    <br />
                    <span className="text-sm font-normal">Community Watch</span>
                  </Button>
                  
                  <Button 
                    variant="propaganda" 
                    size="xl" 
                    className="futuristic-text"
                    onClick={() => startStoryConversation('cop')}
                  >
                    <span>COP</span>
                    <br />
                    <span className="text-sm font-normal">Community Watch</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : gamePhase === 'ended' ? (
          /* Game Ending Screen */
          <GameEnding />
        ) : (
          /* Game Interface */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Character and Stats */}
            <div className="space-y-6">
              <CharacterDisplay
                name={currentCharacter.name}
                role={currentCharacter.role}
                status={currentCharacter.status}
                trustLevel={currentCharacter.trustLevel}
              />
              
              <CreditScoreTracker />
            </div>

            {/* Center - Conversation Area */}
            <div className="lg:col-span-2">
              <ConversationArea
                messages={conversationHistory}
                choices={currentChoices}
                onChoiceSelect={async (choiceId) => await handleChoiceSelect(choiceId)}
                isLoading={isLoading}
                showChoices={!isCustomMode}
              />
              
              {/* Custom Message Input or Generated Choices */}
              <div className="mt-4">
                <CustomMessageInput
                  onSendMessage={handleCustomMessage}
                  isLoading={isLoading}
                  onToggleMode={toggleCustomMode}
                  isCustomMode={isCustomMode}
                />
              </div>
              
              {/* AI Evaluation Feedback */}
              <div className="mt-4">
                <AIEvaluationFeedback
                  reasoning={evaluationFeedback.reasoning}
                  bannedPhrases={evaluationFeedback.bannedPhrases}
                  riskFactors={evaluationFeedback.riskFactors}
                  evaluationType={evaluationFeedback.evaluationType}
                  scoreImpact={evaluationFeedback.scoreImpact}
                  isVisible={evaluationFeedback.isVisible}
                />
              </div>
              
              {/* Reset Button */}
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleResetGame}
                  className="text-gray-300 border-gray-600 hover:bg-gray-800"
                >
                  Reset Game
                </Button>
              </div>
            </div>

            {/* Right Sidebar - Event Log and Stats */}
            <div className="space-y-6">
              <RiskEventLog />
              <SessionStats />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 p-4 text-center text-gray-400 text-sm">
        <p>© 3099 Central Algorithm™ - All Rights Reserved</p>
        <p className="text-xs mt-1">Your compliance is appreciated</p>
      </footer>
    </div>
  );
}
