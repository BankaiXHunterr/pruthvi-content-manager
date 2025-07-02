
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Settings, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import { websocketService } from '../services/websocketService';

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Backend Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
            className="bg-icici-orange hover:bg-icici-red text-white"
          >
            Save Configuration
          </Button>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Expected API Endpoints:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>GET /websites - Get all websites</li>
            <li>POST /websites - Create new website</li>
            <li>PUT /websites/:id - Update website</li>
            <li>DELETE /websites/:id - Delete website</li>
            <li>GET /websites/:id/comments - Get comments</li>
            <li>POST /websites/:id/comments - Create comment</li>
          </ul>
          
          <p className="mt-4"><strong>Expected WebSocket Events:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>website:update - Website data changed</li>
            <li>website:create - New website created</li>
            <li>website:delete - Website deleted</li>
            <li>comment:update - Comment count updated</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendConfig;
