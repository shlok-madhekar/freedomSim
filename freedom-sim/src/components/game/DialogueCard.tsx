import { Card, CardContent } from "@/components/ui/card";
import { User, Bot } from "lucide-react";

interface DialogueCardProps {
  message: string;
  speaker: 'player' | 'npc';
  speakerName?: string;
  timestamp?: string;
}

export function DialogueCard({ message, speaker, speakerName, timestamp }: DialogueCardProps) {
  const isPlayer = speaker === 'player';
  
  return (
    <Card className={`bg-black/60 backdrop-blur-sm border-red-600/50 holographic mb-4 ${
      isPlayer ? 'ml-8' : 'mr-8'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPlayer ? 'bg-blue-600' : 'bg-red-600'
          } surveillance-glow`}>
            {isPlayer ? (
              <User className="h-5 w-5 text-white" />
            ) : (
              <Bot className="h-5 w-5 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-semibold text-white futuristic-text">
                {speakerName || (isPlayer ? 'You' : 'NPC')}
              </span>
              {timestamp && (
                <span className="text-xs text-gray-400">{timestamp}</span>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 