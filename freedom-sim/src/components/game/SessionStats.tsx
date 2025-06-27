import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, Target, AlertTriangle, Shield, XCircle } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";
import { cn } from "@/lib/utils";

export function SessionStats() {
  const { sessionStats, gameSessions, currentSession, gamePhase } = useGameStore();

  const getEndingIcon = (ending: string) => {
    switch (ending) {
      case 'model_citizen': return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 'trusted': return <Shield className="h-5 w-5 text-green-400" />;
      case 'under_watch': return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'flagged': return <XCircle className="h-5 w-5 text-red-400" />;
      case 'vanished': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  const getEndingColor = (ending: string) => {
    switch (ending) {
      case 'model_citizen': return 'text-yellow-400';
      case 'trusted': return 'text-green-400';
      case 'under_watch': return 'text-orange-400';
      case 'flagged': return 'text-red-400';
      case 'vanished': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getEndingDescription = (ending: string) => {
    switch (ending) {
      case 'model_citizen': return 'Exemplary citizen behavior. Full privileges granted.';
      case 'trusted': return 'Reliable citizen. Limited privileges maintained.';
      case 'under_watch': return 'Suspicious behavior detected. Enhanced monitoring active.';
      case 'flagged': return 'Multiple violations recorded. Privileges suspended.';
      case 'vanished': return 'Critical violations. Citizen status terminated.';
      default: return 'Status unknown.';
    }
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = endTime ? endTime - startTime : Date.now() - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateAccuracy = () => {
    if (sessionStats.totalChoices === 0) return 0;
    return Math.round((sessionStats.safeChoices / sessionStats.totalChoices) * 100);
  };

  const getCurrentSessionDuration = () => {
    if (!currentSession) return '0:00';
    return formatDuration(currentSession.startTime);
  };

  return (
    <Card className="bg-red-900/30 border-red-600/50 holographic">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white futuristic-text">
          Session Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Current Session Stats */}
          <div className="space-y-3">
            <div className="text-sm text-gray-300 font-semibold">Current Session</div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 bg-black/20 rounded">
                <Clock className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="text-xs text-gray-400">Duration</div>
                  <div className="text-sm text-white font-semibold">
                    {getCurrentSessionDuration()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-black/20 rounded">
                <Target className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                  <div className="text-sm text-white font-semibold">
                    {calculateAccuracy()}%
                  </div>
                </div>
              </div>
            </div>

            {/* Choice Breakdown */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 font-semibold">Choice Breakdown</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-green-400" />
                    <span className="text-gray-300">Safe Choices</span>
                  </div>
                  <span className="text-white font-semibold">{sessionStats.safeChoices}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-yellow-400" />
                    <span className="text-gray-300">Risky Choices</span>
                  </div>
                  <span className="text-white font-semibold">{sessionStats.riskyChoices}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <XCircle className="h-3 w-3 text-red-400" />
                    <span className="text-gray-300">Dangerous Choices</span>
                  </div>
                  <span className="text-white font-semibold">{sessionStats.dangerousChoices}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Sessions */}
          {gameSessions.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm text-gray-300 font-semibold">Previous Sessions</div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {gameSessions.slice(-3).reverse().map((session) => (
                  <div 
                    key={session.id}
                    className="p-2 bg-black/20 rounded border-l-2 border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getEndingIcon(session.ending)}
                        <div>
                          <div className={cn("text-xs font-semibold", getEndingColor(session.ending))}>
                            {session.ending.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDuration(session.startTime, session.endTime)} • {session.totalChoices} choices
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white font-semibold">
                          {session.finalScore}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ending Preview */}
          {gamePhase === 'ended' && currentSession && (
            <div className="p-3 bg-black/40 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                {getEndingIcon(currentSession.ending)}
                <div className={cn("text-sm font-semibold", getEndingColor(currentSession.ending))}>
                  {currentSession.ending.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <div className="text-xs text-gray-300">
                {getEndingDescription(currentSession.ending)}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 