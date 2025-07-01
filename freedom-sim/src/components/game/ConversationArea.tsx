import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogueCard } from "./DialogueCard";
import { ReplyButton } from "./ReplyButton";

interface Message {
  id: string;
  text: string;
  speaker: 'player' | 'npc';
  speakerName?: string;
  timestamp: string;
}

interface Choice {
  id: string;
  text: string;
  type: 'safe' | 'risky' | 'dangerous';
}

interface ConversationAreaProps {
  messages: Message[];
  choices: Choice[];
  onChoiceSelect: (choiceId: string) => void;
  isLoading?: boolean;
  showChoices?: boolean;
}

export function ConversationArea({ 
  messages, 
  choices, 
  onChoiceSelect, 
  isLoading = false,
  showChoices = true
}: ConversationAreaProps) {
  return (
    <Card className="bg-black/60 backdrop-blur-sm border-red-600/50 holographic">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white futuristic-text">
          Conversation Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Messages Area */}
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <DialogueCard
                  key={message.id}
                  message={message.text}
                  speaker={message.speaker}
                  speakerName={message.speakerName}
                  timestamp={message.timestamp}
                />
              ))
            )}
            {isLoading && (
              <div className="text-center py-4">
                <div className="inline-block animate-pulse">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1"></div>
                </div>
              </div>
            )}
          </div>

          {/* Choices Area - Only show if showChoices is true */}
          {showChoices && choices.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white futuristic-text">
                Choose Your Response
              </h4>
              <div className="space-y-2">
                {choices.map((choice) => (
                  <ReplyButton
                    key={choice.id}
                    text={choice.text}
                    type={choice.type}
                    onClick={() => onChoiceSelect(choice.id)}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 