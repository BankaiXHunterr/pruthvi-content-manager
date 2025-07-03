import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Database, MessageSquare, Users, Settings, Globe, Lock } from 'lucide-react';

const ApiDocumentation: React.FC = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Development Mode:</strong> This app includes comprehensive API documentation and mock data fallbacks. 
          Configure your backend endpoints using the "Backend Config" button, or develop without a backend using the built-in mock data.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="auth">Auth Flow</TabsTrigger>
          <TabsTrigger value="websocket">WebSocket</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Architecture Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Base Configuration</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <code>
                      Base URL: http://localhost:3001/api<br />
                      WebSocket: ws://localhost:3001
                    </code>
                  </div>
                  <p className="text-sm text-gray-600">
                    Default endpoints. Change via Backend Config button to match your server setup.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Fallback Strategy</h4>
                  <div className="space-y-2">
                    <Badge className="bg-green-100 text-green-800">1. API First</Badge>
                    <Badge className="bg-blue-100 text-blue-800">2. localStorage Backup</Badge>
                    <Badge className="bg-gray-100 text-gray-800">3. Mock Data</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    App gracefully falls back to local storage, then mock data if API is unavailable.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Expected Response Headers</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <code>
                    Content-Type: application/json<br />
                    Access-Control-Allow-Origin: *<br />
                    Access-Control-Allow-Methods: GET, POST, PUT, DELETE<br />
                    Access-Control-Allow-Headers: Content-Type, Authorization
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="websites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Website Project Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* GET /websites */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-100 text-green-800">GET</Badge>
                  <code className="text-sm">/websites</code>
                </div>
                <p className="text-sm text-gray-600 mb-3">Retrieve all website projects for dashboard display</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Request</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <code>No body required</code>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`[
  {
    "id": "string",
    "name": "string",
    "url": "string", 
    "description": "string",
    "status": "draft|marketing-review-in-progress|...",
    "commentCount": number,
    "createdBy": "string",
    "createdAt": "ISO string",
    "updatedAt": "ISO string",
    "content": "HTML/CSS string",
    "lastUpdated": "DD/MM/YYYY"
  }
]`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* POST /websites */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                  <code className="text-sm">/websites</code>
                </div>
                <p className="text-sm text-gray-600 mb-3">Create new website project (Marketing Creator role)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Request Body</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "name": "Project Name",
  "url": "https://example.com",
  "description": "Project description",
  "content": "<html>...</html>",
  "createdBy": "user@company.com"
}`}</pre>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "id": "generated-uuid",
  "name": "Project Name",
  "status": "draft",
  "commentCount": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  ...
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* PUT /websites/:id */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-orange-100 text-orange-800">PUT</Badge>
                  <code className="text-sm">/websites/:id</code>
                </div>
                <p className="text-sm text-gray-600 mb-3">Update website project (content, status, metadata)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Request Body (Partial)</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "status": "marketing-review-completed",
  "content": "updated HTML/CSS",
  "description": "updated description"
}`}</pre>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "id": "uuid",
  "updatedAt": "2024-01-01T00:00:00Z",
  ...updated fields
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* DELETE /websites/:id */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-red-100 text-red-800">DELETE</Badge>
                  <code className="text-sm">/websites/:id</code>
                </div>
                <p className="text-sm text-gray-600 mb-3">Delete website project (Admin only, draft status only)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Request</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <code>No body required</code>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "success": true,
  "message": "Website deleted successfully"
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Threads API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* GET /websites/:id/comments */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-100 text-green-800">GET</Badge>
                  <code className="text-sm">/websites/:websiteId/comments</code>
                </div>
                <p className="text-sm text-gray-600 mb-3">Get all comments for a specific website project</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">URL Parameters</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <code>websiteId: UUID of the website project</code>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`[
  {
    "id": "string",
    "websiteId": "string",
    "content": "Comment text",
    "author": "User Name",
    "authorRole": "marketing-reviewer",
    "createdAt": "ISO string",
    "parentId": "string|null"
  }
]`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* POST /websites/:id/comments */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                  <code className="text-sm">/websites/:websiteId/comments</code>
                </div>
                <p className="text-sm text-gray-600 mb-3">Add new comment to website project</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Request Body</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "content": "Comment text",
  "author": "User Name",
  "authorRole": "marketing-reviewer",
  "parentId": "uuid|null"
}`}</pre>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "id": "generated-uuid",
  "websiteId": "uuid",
  "content": "Comment text",
  "createdAt": "2024-01-01T00:00:00Z",
  ...
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threads endpoints */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-purple-100 text-purple-800">THREADS</Badge>
                  <code className="text-sm">/websites/:websiteId/threads</code>
                </div>
                <p className="text-sm text-gray-600 mb-3">Organized discussion threads for compliance reviews</p>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium">Thread Object Structure</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{`{
  "id": "string",
  "projectId": "string",
  "title": "Thread title",
  "status": "open|resolved|needs-revision",
  "createdBy": "User Name",
  "createdAt": "ISO string",
  "comments": [Comment]
}`}</pre>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium">Usage in Workflow</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Compliance reviewers create threads for organized feedback</li>
                      <li>• Status "needs-revision" triggers notifications to marketing team</li>
                      <li>• Threads can be resolved once issues are addressed</li>
                      <li>• All comments within a thread maintain context</li>
                    </ul>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Authentication & Role Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Mode:</strong> Currently using mock authentication. 
                  In production, integrate with your authentication provider and ensure API endpoints verify user roles.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-semibold">User Roles & Permissions</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="border rounded p-3">
                      <Badge className="bg-blue-100 text-blue-800 mb-2">marketing-creator</Badge>
                      <ul className="text-sm space-y-1">
                        <li>• Create new website projects</li>
                        <li>• Edit content in draft status</li>
                        <li>• Submit for marketing review</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded p-3">
                      <Badge className="bg-green-100 text-green-800 mb-2">marketing-reviewer</Badge>
                      <ul className="text-sm space-y-1">
                        <li>• Review and edit marketing content</li>
                        <li>• Approve for compliance review</li>
                        <li>• Comment on projects</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="border rounded p-3">
                      <Badge className="bg-purple-100 text-purple-800 mb-2">compliance-reviewer</Badge>
                      <ul className="text-sm space-y-1">
                        <li>• Final compliance approval</li>
                        <li>• Send back for revisions</li>
                        <li>• Create structured feedback threads</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded p-3">
                      <Badge className="bg-orange-100 text-orange-800 mb-2">website-developer</Badge>
                      <ul className="text-sm space-y-1">
                        <li>• Download approved content</li>
                        <li>• Deploy to production</li>
                        <li>• Read-only access to projects</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Expected Auth Headers</h5>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <pre>{`Authorization: Bearer <jwt-token>
X-User-Role: marketing-creator
X-User-Email: user@company.com`}</pre>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Your API should validate these headers and enforce role-based permissions server-side.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="websocket" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Real-time WebSocket Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  WebSocket connection enables real-time updates across all connected clients. 
                  Essential for team collaboration and status change notifications.
                </p>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-3">Connection Setup</h5>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <pre>{`// Client connects to
ws://localhost:3001

// Expected connection flow:
1. Client connects
2. Server sends welcome message
3. Client subscribes to relevant channels
4. Server broadcasts updates to subscribed clients`}</pre>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Event Types</h5>
                  
                  <div className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">website:update</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Triggered:</strong> When website status, content, or metadata changes</p>
                      <div className="bg-gray-50 p-2 rounded text-xs mt-2">
                        <pre>{`{
  "type": "website:update",
  "data": {
    "id": "website-uuid",
    "status": "compliance-approved",
    "updatedAt": "ISO string",
    "updatedBy": "user@company.com"
  }
}`}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-800">website:create</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Triggered:</strong> When new website project is created</p>
                      <div className="bg-gray-50 p-2 rounded text-xs mt-2">
                        <pre>{`{
  "type": "website:create",
  "data": {
    // Full website object
    "id": "new-uuid",
    "name": "New Project",
    "status": "draft",
    ...
  }
}`}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-100 text-purple-800">comment:update</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Triggered:</strong> When comment count changes or new comments added</p>
                      <div className="bg-gray-50 p-2 rounded text-xs mt-2">
                        <pre>{`{
  "type": "comment:update",
  "data": {
    "websiteId": "website-uuid",
    "commentCount": 5,
    "lastComment": {
      "author": "John Smith",
      "createdAt": "ISO string"
    }
  }
}`}</pre>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="border rounded-lg p-4 bg-blue-50">
                  <h5 className="font-medium mb-2">Implementation Notes</h5>
                  <ul className="text-sm space-y-1">
                    <li>• WebSocket connection auto-reconnects on failure (5 attempts)</li>
                    <li>• Falls back to 30-second polling if WebSocket unavailable</li>
                    <li>• All data changes persist to localStorage as backup</li>
                    <li>• Events should include timestamp for conflict resolution</li>
                  </ul>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocumentation;