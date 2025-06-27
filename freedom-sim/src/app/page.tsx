'use client';

import { useEffect } from 'react';
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
import { useGameStore } from "@/lib/gameStore";
import { 
  SAMPLE_CONVERSATIONS, 
  getNextResponse 
} from "@/lib/gameState";

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

  // Initialize game session on mount
  useEffect(() => {
    if (gamePhase === 'welcome') {
      startNewSession();
    }
  }, [gamePhase, startNewSession]);

  const startConversation = (conversationType: keyof typeof SAMPLE_CONVERSATIONS) => {
    const conversation = SAMPLE_CONVERSATIONS[conversationType];
    setGamePhase('conversation');
    setCurrentCharacter(conversation.character);
    setMessages(conversation.messages);
    setCurrentChoices(conversation.choices);
  };

  const handleChoiceSelect = async (choiceId: string) => {
    setIsLoading(true);
    
    // Find the selected choice
    const selectedChoice = currentChoices.find(choice => choice.id === choiceId);
    if (!selectedChoice) return;

    // Update score using the new store
    updateScore(
      selectedChoice.scoreImpact, 
      `Response to ${currentCharacter.name}`, 
      choiceId
    );
    
    // Add player's choice to messages
    const playerMessage = {
      id: Date.now().toString(),
      text: selectedChoice.text,
      speaker: 'player' as const,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    // Get NPC response
    const conversationType = Object.keys(SAMPLE_CONVERSATIONS).find(key => 
      SAMPLE_CONVERSATIONS[key as keyof typeof SAMPLE_CONVERSATIONS].character.name === currentCharacter.name
    ) as keyof typeof SAMPLE_CONVERSATIONS;
    
    const npcResponse = getNextResponse(choiceId, conversationType);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMessages([...messages, playerMessage, npcResponse]);
    setCurrentChoices([]); // Clear choices after selection
    setIsLoading(false);

    // Check if game should end
    const newScore = socialCreditScore + selectedChoice.scoreImpact;
    if (newScore <= 0) {
      endCurrentSession();
    }
  };

  const handleResetGame = () => {
    endCurrentSession();
    resetGame();
    startNewSession();
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
                    onClick={() => startConversation('coworker')}
                  >
                    <span>COWORKER</span>
                    <br />
                    <span className="text-sm font-normal">Office Politics</span>
                  </Button>
                  
                  <Button 
                    variant="propaganda" 
                    size="xl" 
                    className="futuristic-text"
                    onClick={() => startConversation('neighbor')}
                  >
                    <span>NEIGHBOR</span>
                    <br />
                    <span className="text-sm font-normal">Community Watch</span>
                  </Button>
                  
                  <Button 
                    variant="propaganda" 
                    size="xl" 
                    className="futuristic-text"
                    onClick={() => startConversation('friend')}
                  >
                    <span>FRIEND</span>
                    <br />
                    <span className="text-sm font-normal">Trust Test</span>
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
                messages={messages}
                choices={currentChoices}
                onChoiceSelect={handleChoiceSelect}
                isLoading={isLoading}
              />
              
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
