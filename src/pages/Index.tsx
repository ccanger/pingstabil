import { useState, useEffect } from "react";
import ServerCard, { Server } from "@/components/ServerCard";
import AddServerForm from "@/components/AddServerForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server as ServerIcon, AlertCircle } from "lucide-react";

const Index = () => {
  const [servers, setServers] = useState<Server[]>([]);

  // Load servers from localStorage on mount
  useEffect(() => {
    const savedServers = localStorage.getItem("pingStabil-servers");
    if (savedServers) {
      setServers(JSON.parse(savedServers));
    }
  }, []);

  // Save servers to localStorage whenever servers change
  useEffect(() => {
    localStorage.setItem("pingStabil-servers", JSON.stringify(servers));
  }, [servers]);

  const addServer = (name: string, url: string) => {
    const newServer: Server = {
      id: Date.now().toString(),
      name,
      url,
      status: "checking",
    };
    setServers([...servers, newServer]);
  };

  const deleteServer = (id: string) => {
    setServers(servers.filter(server => server.id !== id));
  };

  const updateServer = (updatedServer: Server) => {
    setServers(servers.map(server => 
      server.id === updatedServer.id ? updatedServer : server
    ));
  };

  const onlineServers = servers.filter(s => s.status === "online").length;
  const offlineServers = servers.filter(s => s.status === "offline").length;
  const totalServers = servers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Activity className="h-10 w-10 text-blue-600" />
            PingStabil
          </h1>
          <p className="text-lg text-gray-600">
            Real-time Server Monitoring Dashboard
          </p>
        </div>

        {/* Stats Overview */}
        {totalServers > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Servers</p>
                  <p className="text-2xl font-bold">{totalServers}</p>
                </div>
                <ServerIcon className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Online</p>
                  <p className="text-2xl font-bold text-green-600">{onlineServers}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-red-600">{offlineServers}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Server Form */}
          <div className="lg:col-span-1">
            <AddServerForm onAdd={addServer} />
          </div>

          {/* Servers List */}
          <div className="lg:col-span-2">
            {servers.length === 0 ? (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <ServerIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                      No servers added yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add your first server to start monitoring
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Monitored Servers</h2>
                  <Badge variant="outline">
                    {servers.length} server{servers.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                {servers.map((server) => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    onDelete={deleteServer}
                    onUpdate={updateServer}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;