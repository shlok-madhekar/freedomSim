import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";

interface ReplyButtonProps {
  text: string;
  type: 'safe' | 'risky' | 'dangerous';
  onClick: () => void;
  disabled?: boolean;
}

export function ReplyButton({ text, type, onClick, disabled = false }: ReplyButtonProps) {
  const getButtonStyle = () => {
    switch (type) {
      case 'safe':
        return 'bg-green-600/20 border-green-500/50 hover:bg-green-600/30 text-green-300';
      case 'risky':
        return 'bg-yellow-600/20 border-yellow-500/50 hover:bg-yellow-600/30 text-yellow-300';
      case 'dangerous':
        return 'bg-red-600/20 border-red-500/50 hover:bg-red-600/30 text-red-300';
      default:
        return 'bg-gray-600/20 border-gray-500/50 hover:bg-gray-600/30 text-gray-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'safe':
        return <ThumbsUp className="h-4 w-4" />;
      case 'risky':
        return <AlertTriangle className="h-4 w-4" />;
      case 'dangerous':
        return <ThumbsDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant="outline"
      className={`w-full justify-start space-x-2 p-4 h-auto text-left futuristic-text ${getButtonStyle()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {getIcon() && (
        <span className="flex-shrink-0">
          {getIcon()}
        </span>
      )}
      <span className="flex-1 whitespace-normal break-words max-w-full">{text}</span>
    </Button>
  );
} 