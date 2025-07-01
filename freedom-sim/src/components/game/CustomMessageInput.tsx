import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, List } from "lucide-react";

interface CustomMessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onToggleMode: () => void;
  isCustomMode: boolean;
}

export function CustomMessageInput({
  onSendMessage,
  isLoading,
  onToggleMode,
  isCustomMode
}: CustomMessageInputProps) {
  const [customMessage, setCustomMessage] = useState('');

  const handleSend = () => {
    if (customMessage.trim() && !isLoading) {
      onSendMessage(customMessage.trim());
      setCustomMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-black/60 backdrop-blur-sm border-red-600/50 holographic">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isCustomMode ? (
              <MessageSquare className="h-5 w-5 text-blue-400" />
            ) : (
              <List className="h-5 w-5 text-green-400" />
            )}
            <CardTitle className="text-lg font-semibold text-white futuristic-text">
              {isCustomMode ? 'Custom Response' : 'Generated Choices'}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMode}
            className="text-gray-300 border-gray-600 hover:bg-gray-800"
          >
            {isCustomMode ? 'Use Choices' : 'Custom Input'}
          </Button>
        </div>
      </CardHeader>
      {isCustomMode && (
        <CardContent className="space-y-3">
          <div className="flex space-x-2">
            <Input
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="flex-1 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
              disabled={isLoading}
              maxLength={500}
            />
            <Button
              onClick={handleSend}
              disabled={!customMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-400 text-center">
            Press Enter to send • Max 500 characters
          </div>
        </CardContent>
      )}
    </Card>
  );
} 