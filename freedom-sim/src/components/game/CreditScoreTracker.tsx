import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface CreditScoreTrackerProps {
  score: number;
  previousScore?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  maxScore?: number;
}

export function CreditScoreTracker({ 
  score, 
  previousScore, 
  riskLevel, 
  maxScore = 1000 
}: CreditScoreTrackerProps) {
  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 600) return 'text-yellow-400';
    if (score >= 400) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-orange-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getScorePercentage = () => (score / maxScore) * 100;
  const scoreChange = previousScore ? score - previousScore : 0;
  const hasChanged = scoreChange !== 0;

  return (
    <Card className="bg-red-900/30 border-red-600/50 holographic">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white futuristic-text">
          Social Credit Score
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Score Display */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              {hasChanged && (
                <div className="flex items-center space-x-1">
                  {scoreChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                  <span className={`text-sm font-semibold ${
                    scoreChange > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {scoreChange > 0 ? '+' : ''}{scoreChange}
                  </span>
                </div>
              )}
            </div>
            <span className="text-gray-400 text-sm">out of {maxScore}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Progress</span>
              <span className="text-sm text-gray-300">{Math.round(getScorePercentage())}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  score >= 800 ? 'bg-green-500' : 
                  score >= 600 ? 'bg-yellow-500' : 
                  score >= 400 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${getScorePercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Risk Level</span>
            </div>
            <span className={`text-sm font-semibold ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </span>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-black/20 rounded">
              <div className="text-gray-400">Status</div>
              <div className="text-white font-semibold">
                {score >= 800 ? 'Model Citizen' : 
                 score >= 600 ? 'Trusted' : 
                 score >= 400 ? 'Under Watch' : 'Flagged'}
              </div>
            </div>
            <div className="text-center p-2 bg-black/20 rounded">
              <div className="text-gray-400">Privileges</div>
              <div className="text-white font-semibold">
                {score >= 800 ? 'Full Access' : 
                 score >= 600 ? 'Limited' : 
                 score >= 400 ? 'Restricted' : 'Suspended'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 