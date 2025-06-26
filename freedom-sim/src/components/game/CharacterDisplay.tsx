import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface CharacterDisplayProps {
  name: string;
  role: string;
  avatar?: string;
  status: 'friendly' | 'neutral' | 'hostile';
  trustLevel: number;
}

export function CharacterDisplay({ name, role, avatar, status, trustLevel }: CharacterDisplayProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'friendly': return 'text-green-400';
      case 'neutral': return 'text-yellow-400';
      case 'hostile': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'friendly': return <Shield className="h-4 w-4 text-green-400" />;
      case 'neutral': return <User className="h-4 w-4 text-yellow-400" />;
      case 'hostile': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-red-900/30 border-red-600/50 holographic">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white futuristic-text">
          Current Character
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center surveillance-glow">
            {avatar ? (
              <Image 
                src={avatar} 
                alt={name} 
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white futuristic-text">{name}</h3>
            <p className="text-gray-400 text-sm">{role}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusIcon(status)}
              <span className={`text-sm ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Trust Level</span>
            <span className="text-sm text-gray-300">{trustLevel}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                trustLevel >= 70 ? 'bg-green-500' : 
                trustLevel >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${trustLevel}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 