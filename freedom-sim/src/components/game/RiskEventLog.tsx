import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Shield, XCircle } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";
import { cn } from "@/lib/utils";

export function RiskEventLog() {
  const { riskEvents, scoreHistory } = useGameStore();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'violation': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'praise': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'compliance': return <Shield className="h-4 w-4 text-blue-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-l-yellow-400 bg-yellow-400/10';
      case 'medium': return 'border-l-orange-400 bg-orange-400/10';
      case 'high': return 'border-l-red-400 bg-red-400/10';
      case 'critical': return 'border-l-red-600 bg-red-600/20';
      default: return 'border-l-gray-400 bg-gray-400/10';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const recentEvents = [...riskEvents, ...scoreHistory]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return (
    <Card className="bg-red-900/30 border-red-600/50 holographic">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white futuristic-text">
          Event Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentEvents.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">
              No events recorded yet
            </div>
          ) : (
            recentEvents.map((event, index) => {
              const isRiskEvent = 'type' in event;
              
              if (isRiskEvent) {
                return (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border-l-4 transition-all duration-200 event-slide-in",
                      getEventColor(event.severity),
                      event.severity === 'critical' && "critical-pulse"
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium">
                          {event.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatTime(event.timestamp)} • {event.type.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-300">
                        {event.scoreImpact > 0 ? '+' : ''}{event.scoreImpact}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div 
                    key={`score-${index}`}
                    className={cn(
                      "p-3 rounded-lg border-l-4 transition-all duration-200 event-slide-in",
                      event.change > 0 
                        ? "border-l-green-400 bg-green-400/10" 
                        : "border-l-red-400 bg-red-400/10"
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      {event.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium">
                          {event.reason}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatTime(event.timestamp)} • Score: {event.score}
                        </div>
                      </div>
                      <div className={cn(
                        "text-xs font-semibold",
                        event.change > 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {event.change > 0 ? '+' : ''}{event.change}
                      </div>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
} 