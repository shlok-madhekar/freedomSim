import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Shield, AlertTriangle, XCircle, Skull, RotateCcw } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";
import { cn } from "@/lib/utils";

export function GameEnding() {
  const { 
    socialCreditScore, 
    sessionStats, 
    gameSessions, 
    startNewSession,
    resetGame 
  } = useGameStore();

  const getEndingData = () => {
    if (socialCreditScore >= 900) {
      return {
        title: "MODEL CITIZEN",
        subtitle: "Exemplary Behavior Detected",
        icon: <Trophy className="h-16 w-16 text-yellow-400" />,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        borderColor: "border-yellow-400/50",
        description: "Your unwavering commitment to social harmony has been noted. Full privileges granted. You are a shining example of what every citizen should aspire to be.",
        status: "Status: Elite Citizen",
        privileges: "Privileges: Unlimited Access"
      };
    } else if (socialCreditScore >= 700) {
      return {
        title: "TRUSTED CITIZEN",
        subtitle: "Reliable Behavior Confirmed",
        icon: <Shield className="h-16 w-16 text-green-400" />,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/50",
        description: "Your consistent compliance with social norms has earned you trusted status. Limited privileges maintained. Continue your exemplary behavior.",
        status: "Status: Trusted",
        privileges: "Privileges: Standard Access"
      };
    } else if (socialCreditScore >= 400) {
      return {
        title: "UNDER WATCH",
        subtitle: "Suspicious Behavior Detected",
        icon: <AlertTriangle className="h-16 w-16 text-orange-400" />,
        color: "text-orange-400",
        bgColor: "bg-orange-400/10",
        borderColor: "border-orange-400/50",
        description: "Multiple concerning choices have been recorded. Enhanced monitoring protocols activated. Consider adjusting your behavior to avoid further consequences.",
        status: "Status: Monitored",
        privileges: "Privileges: Restricted Access"
      };
    } else if (socialCreditScore >= 100) {
      return {
        title: "FLAGGED CITIZEN",
        subtitle: "Multiple Violations Recorded",
        icon: <XCircle className="h-16 w-16 text-red-400" />,
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/50",
        description: "Your repeated violations of social protocols have resulted in flagged status. Privileges suspended. Expect increased surveillance and potential re-education.",
        status: "Status: Flagged",
        privileges: "Privileges: Suspended"
      };
    } else {
      return {
        title: "CITIZEN TERMINATED",
        subtitle: "Critical Violations Detected",
        icon: <Skull className="h-16 w-16 text-red-600" />,
        color: "text-red-600",
        bgColor: "bg-red-600/20",
        borderColor: "border-red-600/50",
        description: "Your behavior has been deemed irredeemable. Citizen status terminated. You have been removed from the social credit system. Goodbye.",
        status: "Status: Terminated",
        privileges: "Privileges: None"
      };
    }
  };

  const endingData = getEndingData();
  const totalSessions = gameSessions.length + 1;
  const averageScore = totalSessions > 1 
    ? Math.round(gameSessions.reduce((sum, session) => sum + session.finalScore, socialCreditScore) / totalSessions)
    : socialCreditScore;

  return (
    <Card className={cn(
      "bg-black/60 backdrop-blur-sm holographic border-2",
      endingData.borderColor
    )}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {endingData.icon}
        </div>
        <CardTitle className={cn("text-3xl font-bold futuristic-text", endingData.color)}>
          {endingData.title}
        </CardTitle>
        <CardDescription className="text-xl text-gray-300">
          {endingData.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="text-center">
          <p className="text-gray-300 leading-relaxed">
            {endingData.description}
          </p>
        </div>

        {/* Final Stats */}
        <div className={cn("p-4 rounded-lg", endingData.bgColor)}>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-400">Final Score</div>
              <div className={cn("text-2xl font-bold", endingData.color)}>
                {socialCreditScore}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Choices</div>
              <div className="text-2xl font-bold text-white">
                {sessionStats.totalChoices}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Safe Choices</div>
              <div className="text-lg font-semibold text-green-400">
                {sessionStats.safeChoices}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Violations</div>
              <div className="text-lg font-semibold text-red-400">
                {sessionStats.riskyChoices + sessionStats.dangerousChoices}
              </div>
            </div>
          </div>
        </div>

        {/* Status and Privileges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-black/40 rounded-lg">
            <div className="text-sm text-gray-400">Status</div>
            <div className="text-white font-semibold">{endingData.status}</div>
          </div>
          <div className="p-3 bg-black/40 rounded-lg">
            <div className="text-sm text-gray-400">Privileges</div>
            <div className="text-white font-semibold">{endingData.privileges}</div>
          </div>
        </div>

        {/* Session History */}
        {totalSessions > 1 && (
          <div className="p-3 bg-black/40 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Session History</div>
            <div className="text-xs text-gray-300">
              Total Sessions: {totalSessions} • Average Score: {averageScore}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => {
              resetGame();
              startNewSession();
            }}
            className="futuristic-text bg-red-600 hover:bg-red-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 