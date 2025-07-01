import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, ThumbsUp, ThumbsDown, Info } from "lucide-react";

interface AIEvaluationFeedbackProps {
  reasoning: string;
  bannedPhrases: string[];
  riskFactors: string[];
  evaluationType: 'safe' | 'risky' | 'dangerous';
  scoreImpact: number;
  isVisible: boolean;
}

export function AIEvaluationFeedback({
  reasoning,
  bannedPhrases,
  riskFactors,
  evaluationType,
  scoreImpact,
  isVisible
}: AIEvaluationFeedbackProps) {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (evaluationType) {
      case 'safe':
        return <ThumbsUp className="h-5 w-5 text-green-400" />;
      case 'risky':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'dangerous':
        return <ThumbsDown className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getColorClass = () => {
    switch (evaluationType) {
      case 'safe':
        return 'border-green-500/50 bg-green-900/20';
      case 'risky':
        return 'border-yellow-500/50 bg-yellow-900/20';
      case 'dangerous':
        return 'border-red-500/50 bg-red-900/20';
      default:
        return 'border-blue-500/50 bg-blue-900/20';
    }
  };

  const getTitle = () => {
    switch (evaluationType) {
      case 'safe':
        return 'Central Algorithm™ Approval';
      case 'risky':
        return 'Central Algorithm™ Warning';
      case 'dangerous':
        return 'Central Algorithm™ Violation';
      default:
        return 'Central Algorithm™ Analysis';
    }
  };

  return (
    <Card className={`bg-black/60 backdrop-blur-sm border-2 holographic ${getColorClass()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <CardTitle className="text-lg font-semibold text-white futuristic-text">
            {getTitle()}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Impact */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            scoreImpact > 0 ? 'text-green-400' : 
            scoreImpact < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {scoreImpact > 0 ? '+' : ''}{scoreImpact} Social Credit
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis:</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{reasoning}</p>
        </div>

        {/* Banned Phrases */}
        {bannedPhrases.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-2">🚨 Banned Phrases Detected:</h4>
            <div className="flex flex-wrap gap-1">
              {bannedPhrases.map((phrase, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-900/50 border border-red-500/50 rounded text-xs text-red-300">
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {riskFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Risk Factors:</h4>
            <ul className="space-y-1">
              {riskFactors.map((factor, idx) => (
                <li key={idx} className="text-gray-400 text-sm flex items-start space-x-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Compliance Notice */}
        <div className="text-center pt-2 border-t border-gray-600/50">
          <p className="text-xs text-gray-500">
            This evaluation has been logged for compliance purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 