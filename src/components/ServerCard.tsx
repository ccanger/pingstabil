import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Server {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline" | "checking";
  responseTime?: number;
  lastChecked?: Date;
}

interface ServerCardProps {
  server: Server;
  onDelete: (id: string) => void;
  onUpdate: (server: Server) => void;
}

const ServerCard = ({ server, onDelete, onUpdate }: ServerCardProps) => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const pingServer = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch(server.url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      
      const responseTime = Date.now() - startTime;
      const updatedServer = {
        ...server,
        status: "online" as const,
        responseTime,
        lastChecked: new Date(),
      };
      
      onUpdate(updatedServer);
    } catch (error) {
      const updatedServer = {
        ...server,
        status: "offline" as const,
        responseTime: undefined,
        lastChecked: new Date(),
      };
      
      onUpdate(updatedServer);
      toast({
        title: "Server Offline",
        description: `${server.name} is not responding`,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking) {
        pingServer();
      }
    }, 30000); // Check every 30 seconds

    // Initial check
    pingServer();

    return () => clearInterval(interval);
  }, [server.url]);

  const getStatusColor = () => {
    switch (server.status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusText = () => {
    if (isChecking) return "Checking...";
    return server.status === "online" ? "Online" : "Offline";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{server.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={pingServer}
            disabled={isChecking}
          >
            <Activity className="h-4 w-4 mr-1" />
            Test Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(server.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground mb-2">{server.url}</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
              <Badge variant={server.status === "online" ? "default" : "destructive"}>
                {getStatusText()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            {server.responseTime && (
              <p className="text-2xl font-bold text-green-600">
                {server.responseTime}ms
              </p>
            )}
            {server.lastChecked && (
              <p className="text-xs text-muted-foreground">
                Last: {server.lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerCard;