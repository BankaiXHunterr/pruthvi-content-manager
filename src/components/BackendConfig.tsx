
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Wifi, WifiOff, CheckCircle, AlertCircle, Book } from 'lucide-react';
import { apiService } from '../services/apiService';
import { websocketService } from '../services/websocketService';
import ApiDocumentation from './ApiDocumentation';

interface BackendConfigProps {
  onConfigChange?: () => void;
}

const BackendConfig: React.FC<BackendConfigProps> = ({ onConfigChange }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [websocketUrl, setWebsocketUrl] = useState('');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [isTestingWs, setIsTestingWs] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [wsStatus, setWsStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load saved configuration
    const savedApiUrl = localStorage.getItem('backend_api_url') || 'http://localhost:3001/api';
    const savedWsUrl = localStorage.getItem('backend_websocket_url') || 'ws://localhost:3001';
    
    setApiUrl(savedApiUrl);
    setWebsocketUrl(savedWsUrl);

    // Update API service configuration
    apiService.updateConfig({
      baseUrl: savedApiUrl,
      websocketUrl: savedWsUrl
    });
  }, []);

  const testApiConnection = async () => {
    setIsTestingApi(true);
    setApiStatus('unknown');
    
    try {
      // Update API service configuration
      apiService.updateConfig({ baseUrl: apiUrl, websocketUrl: websocketUrl });
      
      // Test API connection
      await apiService.getWebsites();
      setApiStatus('connected');
      setMessage('API connection successful!');
    } catch (error) {
      setApiStatus('error');
      setMessage(`API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  const testWebSocketConnection = () => {
    setIsTestingWs(true);
    setWsStatus('unknown');

    const timeout = setTimeout(() => {
      setWsStatus('error');
      setMessage('WebSocket connection timeout');
      setIsTestingWs(false);
      websocketService.disconnect();
    }, 5000);

    websocketService.connect({
      onConnect: () => {
        clearTimeout(timeout);
        setWsStatus('connected');
        setMessage('WebSocket connection successful!');
        setIsTestingWs(false);
        websocketService.disconnect();
      },
      onError: (error) => {
        clearTimeout(timeout);
        setWsStatus('error');
        setMessage('WebSocket connection failed');
        setIsTestingWs(false);
      }
    });
  };

  const saveConfiguration = () => {
    localStorage.setItem('backend_api_url', apiUrl);
    localStorage.setItem('backend_websocket_url', websocketUrl);
    
    // Update API service configuration
    apiService.updateConfig({
      baseUrl: apiUrl,
      websocketUrl: websocketUrl
    });

    setMessage('Configuration saved successfully!');
    onConfigChange?.();
  };

  const getStatusBadge = (status: 'unknown' | 'connected' | 'error', isLoading: boolean) => {
    if (isLoading) {
      return <Badge className="bg-yellow-100 text-yellow-800">Testing...</Badge>;
    }
    
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            API Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Backend Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development Mode:</strong> Configure your backend endpoints here. 
                  The app will work with mock data if your API is not ready yet.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Base URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="http://localhost:3001/api"
                      className="flex-1"
                    />
                    <Button
                      onClick={testApiConnection}
                      disabled={isTestingApi || !apiUrl}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {apiStatus === 'connected' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      Test
                    </Button>
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(apiStatus, isTestingApi)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your backend should implement the REST endpoints documented in the API Documentation tab.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WebSocket URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={websocketUrl}
                      onChange={(e) => setWebsocketUrl(e.target.value)}
                      placeholder="ws://localhost:3001"
                      className="flex-1"
                    />
                    <Button
                      onClick={testWebSocketConnection}
                      disabled={isTestingWs || !websocketUrl}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {wsStatus === 'connected' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                      Test
                    </Button>
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(wsStatus, isTestingWs)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Enables real-time updates. App works without WebSocket using periodic sync.
                  </p>
                </div>
              </div>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={saveConfiguration}
                  disabled={!apiUrl || !websocketUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Configuration
                </Button>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Quick Start for Backend Development</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>1. <strong>Start with mock data:</strong> The app works immediately with built-in mock data</p>
                  <p>2. <strong>Check API docs:</strong> See the "API Documentation" tab for detailed endpoint specifications</p>
                  <p>3. <strong>Implement incrementally:</strong> Start with GET /websites, then add other endpoints</p>
                  <p>4. <strong>Test connections:</strong> Use the Test buttons above to verify your backend</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <ApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackendConfig;
