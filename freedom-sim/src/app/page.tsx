'use client';

import { useState } from 'react';
import Image from "next/image";
import { Eye, Shield, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [socialCreditScore] = useState(750);
  const [riskLevel] = useState('LOW');

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 600) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-gray-400';
    }
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
            <div className={`text-3xl font-bold ${getScoreColor(socialCreditScore)}`}>
              {socialCreditScore}
            </div>
            <div className={`text-xs ${getRiskColor(riskLevel)}`}>
              Risk Level: {riskLevel}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="max-w-6xl mx-auto px-4">
        {/* Welcome Screen */}
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

            {/* Start Game Button */}
            <div className="text-center">
              <Button variant="propaganda" size="xl" className="futuristic-text">
                <span>INITIALIZE GAME</span>
                <br />
                <span className="text-sm font-normal">Begin Simulation</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game UI Shell - Placeholder */}
        <Card className="mt-8 bg-black/40 backdrop-blur-sm border-red-600/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white futuristic-text">
              Game Interface Shell
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Character Info */}
              <Card className="bg-red-900/30 border-red-600/50">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Character</h4>
                  <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-center text-gray-300">[Character Name]</p>
                  <p className="text-center text-gray-400 text-sm">[Character Role]</p>
                </CardContent>
              </Card>

              {/* Conversation Area */}
              <Card className="bg-red-900/30 border-red-600/50">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Conversation</h4>
                  <div className="h-32 bg-gray-800 rounded mb-2 flex items-center justify-center">
                    <p className="text-gray-400">[Conversation will appear here]</p>
                  </div>
                </CardContent>
              </Card>

              {/* Choice Buttons */}
              <Card className="bg-red-900/30 border-red-600/50">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Choices</h4>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-700 rounded"></div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-12 p-4 text-center text-gray-400 text-sm">
        <p>© 3099 Central Algorithm™ - All Rights Reserved</p>
        <p className="text-xs mt-1">Your compliance is appreciated</p>
      </footer>
    </div>
  );
}
