import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Clock, Shield } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";
import { cn } from "@/lib/utils";

export function CreditScoreTracker() {
  const {
    socialCreditScore,
    previousScore,
    riskLevel,
    riskMeter,
    scoreFlash,
    riskMeterFlash,
    sessionStats
  } = useGameStore();

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

  const getRiskMeterColor = (meter: number) => {
    if (meter <= 25) return 'bg-green-500';
    if (meter <= 50) return 'bg-yellow-500';
    if (meter <= 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScorePercentage = () => (socialCreditScore / 1000) * 100;
  const scoreChange = previousScore ? socialCreditScore - previousScore : 0;
  const hasChanged = scoreChange !== 0;

  const getStatusText = () => {
    if (socialCreditScore >= 800) return 'Model Citizen';
    if (socialCreditScore >= 600) return 'Trusted';
    if (socialCreditScore >= 400) return 'Under Watch';
    return 'Flagged';
  };

  const getPrivilegesText = () => {
    if (socialCreditScore >= 800) return 'Full Access';
    if (socialCreditScore >= 600) return 'Limited';
    if (socialCreditScore >= 400) return 'Restricted';
    return 'Suspended';
  };

  return (
    <Card className="bg-red-900/30 border-red-600/50 holographic">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white futuristic-text">
          Social Credit Score
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Score Display with Flash Effect */}
          <div className="text-center">
            <div className={cn(
              "flex items-center justify-center space-x-2 mb-2 transition-all duration-300",
              scoreFlash === 'positive' && "score-flash-positive",
              scoreFlash === 'negative' && "score-flash-negative"
            )}>
              <span className={`text-4xl font-bold ${getScoreColor(socialCreditScore)}`}>
                {socialCreditScore}
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
            <span className="text-gray-400 text-sm">out of 1000</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Progress</span>
              <span className="text-sm text-gray-300">{Math.round(getScorePercentage())}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 progress-fill ${
                  socialCreditScore >= 800 ? 'bg-green-500' : 
                  socialCreditScore >= 600 ? 'bg-yellow-500' : 
                  socialCreditScore >= 400 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${getScorePercentage()}%`,
                  '--progress-width': `${getScorePercentage()}%`
                } as React.CSSProperties}
              ></div>
            </div>
          </div>

          {/* Enhanced Risk Level with Meter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Risk Level</span>
              </div>
              <span className={`text-sm font-semibold ${getRiskColor(riskLevel)}`}>
                {riskLevel}
              </span>
            </div>
            
            {/* Risk Meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Risk Meter</span>
                <span className="text-xs text-gray-400">{Math.round(riskMeter)}%</span>
              </div>
              <div className={cn(
                "w-full bg-gray-700 rounded-full h-2 transition-all duration-300",
                riskMeterFlash && "risk-meter-flash"
              )}>
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    getRiskMeterColor(riskMeter)
                  )}
                  style={{ width: `${riskMeter}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-black/20 rounded">
              <div className="text-gray-400">Status</div>
              <div className="text-white font-semibold">
                {getStatusText()}
              </div>
            </div>
            <div className="text-center p-2 bg-black/20 rounded">
              <div className="text-gray-400">Privileges</div>
              <div className="text-white font-semibold">
                {getPrivilegesText()}
              </div>
            </div>
          </div>

          {/* Session Statistics */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-semibold">Session Stats</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Activity className="h-3 w-3 text-blue-400" />
                <span className="text-gray-300">Choices:</span>
                <span className="text-white">{sessionStats.totalChoices}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-green-400" />
                <span className="text-gray-300">Safe:</span>
                <span className="text-white">{sessionStats.safeChoices}</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                <span className="text-gray-300">Risky:</span>
                <span className="text-white">{sessionStats.riskyChoices}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="h-3 w-3 text-red-400" />
                <span className="text-gray-300">Dangerous:</span>
                <span className="text-white">{sessionStats.dangerousChoices}</span>
              </div>
            </div>
            
            {/* Consecutive Violations */}
            {sessionStats.consecutiveViolations > 0 && (
              <div className={cn(
                "flex items-center space-x-1 p-2 rounded",
                sessionStats.consecutiveViolations >= 3 ? "violation-warning" : "bg-red-500/20"
              )}>
                <Clock className="h-3 w-3 text-red-400" />
                <span className="text-xs text-red-400">
                  {sessionStats.consecutiveViolations} consecutive violation{sessionStats.consecutiveViolations > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 