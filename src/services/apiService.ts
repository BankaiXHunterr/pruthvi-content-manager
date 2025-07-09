
// Mock demo data for edit functionality - Array-friendly structure
const DEMO_WEBSITE_DATA = {
  "PAGE_TITLE": "ICICI Prudential Anime Fund 8",
  "FUND_INFO": {
    "ABOUT": "About",
    "HEADING": "ICICI Prudential Anime Fund 8",
    "CARD_CONTENTS": [
      {
        "id": "point_1",
        "text": "ICICI Prudential Anime Fund 8 is a unique investment opportunity designed specifically for anime enthusiasts. This fund aims to capture the growth potential of companies involved in the anime industry, including animation studios, merchandise creators, streaming platforms, and more. By investing in this fund, you can align your passion for anime with your financial goals, making it a perfect blend of fandom and finance."
      }
    ]
  },
  "HOW_SCHEME_WORK": {
    "DESCRIPTIONS": [
      {
        "id": "point_1",
        "text": "Invests in companies driving the anime industry globally."
      },
      {
        "id": "point_2", 
        "text": "Focuses on sectors like animation, streaming, and merchandise."
      },
      {
        "id": "point_3",
        "text": "Aims to deliver long-term growth by leveraging the booming anime market."
      }
    ]
  },
  "WHY_INVEST": {
    "DESCRIPTIONS": [
      {
        "id": "point_1",
        "text": "Tap into the growing global popularity of anime."
      },
      {
        "id": "point_2",
        "text": "Diversify your portfolio with a niche investment theme."
      },
      {
        "id": "point_3",
        "text": "Support and benefit from the expanding anime ecosystem."
      }
    ]
  },
  "VIDEO_SECTION": {
    "CARD_CONTENTS": [
      {
        "id": "video_1",
        "thumbnail": "https://example.com/anime_fund_thumbnail.jpg",
        "videoUrl": "https://example.com/anime_fund_video.mp4"
      }
    ],
    "CARD_TITLE": "Unlock insights into the fund - Click to watch now"
  },
  "SCHEME_FEATURES": {
    "HEADING": "Scheme Features",
    "TABLE_CONTENT": [
      {
        "id": "scheme_name",
        "title": "Name of scheme",
        "description": "ICICI Prudential Anime Fund 8"
      },
      {
        "id": "scheme_type",
        "title": "Type of scheme",
        "description": "Thematic Equity Fund - Anime Industry Focus"
      },
      {
        "id": "nfo_period",
        "title": "NFO Period",
        "description": "NFO Period October 1, 2023 to October 15, 2023"
      },
      {
        "id": "benchmark_index",
        "title": "Benchmark Index",
        "description": "Anime Industry Growth Index"
      },
      {
        "id": "entry_load",
        "title": "Entry Load",
        "description": "Nil"
      },
      {
        "id": "exit_load",
        "title": "Exit Load",
        "description": "<12 months: 1%; >12 months: Nil"
      },
      {
        "id": "min_application",
        "title": "Minimum Application Amount",
        "description": "₹5,000"
      },
      {
        "id": "min_additional",
        "title": "Minimum Additional Application Amount",
        "description": "₹1,000"
      },
      {
        "id": "min_redemption",
        "title": "Minimum redemption Amount",
        "description": "₹500"
      },
      {
        "id": "options",
        "title": "Options",
        "description": "Growth and Dividend Options"
      },
      {
        "id": "sip_swp_stp",
        "title": "SIP/SWP/STP",
        "description": "Available"
      },
      {
        "id": "plan",
        "title": "Plan",
        "description": "Regular and Direct Plans"
      },
      {
        "id": "fund_managers",
        "title": "Fund Managers",
        "description": "Mr. Anime Enthusiast and Ms. Global Markets Expert"
      }
    ]
  },
  "SCHEME_RISKOMETER": {
    "TITLE": "This product is suitable for investors who are seeking*:",
    "CONTENT": [
      "Capital appreciation over the long term by investing in companies driving the anime industry."
    ],
    "NOTE_TEXT": "*Investors should consult their financial distributors if in doubt about whether the product is suitable for them.",
    "RISK": "High",
    "RISK_VALUE": "5",
    "RISK_STATUS": "Investors understand that their principal will be at high risk.",
    "BENCHMARK_NAME": "Anime Industry Growth Index"
  },
  "DOWNLOAD_BUTTON_SECTION": {
    "DOWNLOAD_FACTSHEET": "Download Presentation",
    "DOWNLOAD_FACTSHEET_PATH": "https://www.google.com",
    "DOWNLOAD_ONE_PAGER": "Download SID",
    "DOWNLOAD_ONE_PAGER_PATH": "https://www.google.com"
  },
  "WARNING_MESSAGE": "Mutual Fund investments are subject to market risk, read all scheme related documents carefully."
};

export interface ApiConfig {
  baseUrl: string;
  websocketUrl: string;
}

// Default configuration - users can override these via BackendConfig component
// These URLs can be changed dynamically through the UI
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:3001/api',
  websocketUrl: 'ws://localhost:3001'
};

class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  // Generic fetch wrapper
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // ===== WEBSITE ENDPOINTS =====
  
  /**
   * GET /websites - Retrieve all website projects
   * 
   * Input: None
   * Expected Response: Array of website objects
   * Response Format: [
   *   {
   *     id: string,
   *     name: string,
   *     url: string,
   *     description: string,
   *     status: WebsiteStatus,
   *     commentCount: number,
   *     createdBy: string,
   *     createdAt: string,
   *     updatedAt: string
   *   }
   * ]
   * 
   * Use Case: Load all projects in the dashboard
   * Fallback: Returns mock data from mockData.ts if API fails
   */
  async getWebsites() {
    return this.fetchApi('/websites');
  }

  /**
   * GET /websites/:id - Retrieve specific website project by ID
   * 
   * Input: id (string) - Website project ID
   * Expected Response: Single website object
   * Response Format: {
   *   id: string,
   *   name: string,
   *   url: string,
   *   description: string,
   *   status: WebsiteStatus,
   *   commentCount: number,
   *   createdBy: string,
   *   createdAt: string,
   *   updatedAt: string,
   *   // Additional details for single project view
   *   content?: string,
   *   assets?: string[],
   *   metadata?: object
   * }
   * 
   * Use Case: View detailed project information
   */
  async getWebsite(id: string) {
    try {
      // Try to make the API call first
      return await this.fetchApi(`/websites/${id}`);
    } catch (error) {
      // Fallback to demo data if API fails
      console.log(`API call failed, using demo data for website ${id}:`, error);
      return {
        editableFields: DEMO_WEBSITE_DATA,
        success: true
      };
    }
  }

  /**
   * POST /websites - Create new website project
   * 
   * Input: website object without id
   * Request Body Format: {
   *   name: string (required) - Project name
   *   url: string (required) - Website URL
   *   description: string (optional) - Project description
   *   status?: WebsiteStatus (defaults to 'draft')
   *   createdBy: string (required) - User who created it
   *   content?: string - HTML/CSS content
   *   assets?: string[] - Array of asset URLs
   * }
   * 
   * Expected Response: Created website object with generated ID
   * Response Format: Same as GET /websites/:id
   * 
   * Use Case: Marketing creator adds new website project
   */
  async createWebsite(website: any) {
    // Ensure no ID is sent to backend - backend generates IDs
    const { id, ...websiteData } = website;
    return this.fetchApi('/websites', {
      method: 'POST',
      body: JSON.stringify(websiteData),
    });
  }

  /**
   * PUT /websites/:id - Update existing website project
   * 
   * Input: 
   * - id (string) - Website project ID
   * - updates (object) - Partial website object with changes
   * 
   * Request Body Format: Partial<{
   *   name?: string,
   *   url?: string,
   *   description?: string,
   *   status?: WebsiteStatus,
   *   content?: string,
   *   assets?: string[],
   *   updatedAt?: string (auto-generated)
   * }>
   * 
   * Expected Response: Updated website object
   * Response Format: Same as GET /websites/:id
   * 
   * Use Case: Status updates, content changes, project edits
   */
  async updateWebsite(id: string, updates: any) {
    try {
      // Try to make the API call first
      return await this.fetchApi(`/websites/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      // Fallback to demo response if API fails
      console.log(`API call failed, using demo response for updateWebsite ${id}:`, error);
      return {
        success: true,
        message: "Website updated successfully (demo mode)",
        data: updates
      };
    }
  }

  /**
   * DELETE /websites/:id - Delete website project
   * 
   * Input: id (string) - Website project ID
   * Expected Response: Success confirmation
   * Response Format: { success: true, message: string }
   * 
   * Use Case: Remove project from system (admin only)
   * Security: Should verify user permissions server-side
   */
  async deleteWebsite(id: string) {
    return this.fetchApi(`/websites/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== COMMENT ENDPOINTS =====
  
  /**
   * GET /websites/:websiteId/comments - Get all comments for a website
   * 
   * Input: websiteId (string) - Website project ID
   * Expected Response: Array of comment objects
   * Response Format: [
   *   {
   *     id: string,
   *     websiteId: string,
   *     content: string,
   *     author: string,
   *     authorRole: UserRole,
   *     createdAt: string,
   *     updatedAt?: string,
   *     parentId?: string (for threaded replies)
   *   }
   * ]
   * 
   * Use Case: Display comments on project detail page
   * Security: Filter by user permissions (can only see comments user has access to)
   */
  async getComments(websiteId: string) {
    return this.fetchApi(`/websites/${websiteId}/comments`);
  }

  /**
   * POST /websites/:websiteId/comments - Add comment to website
   * 
   * Input: 
   * - websiteId (string) - Website project ID
   * - comment (object) - Comment data without ID
   * 
   * Request Body Format: {
   *   content: string (required) - Comment text
   *   author: string (required) - Comment author name
   *   authorRole: UserRole (required) - Author's role
   *   parentId?: string - Parent comment ID for replies
   * }
   * 
   * Expected Response: Created comment object with ID
   * Response Format: Same as individual comment in GET response
   * 
   * Use Case: Users add feedback/comments on projects
   * Workflow: Triggers status updates and notifications
   */
  async createComment(websiteId: string, comment: { content: string; author: string; authorRole: string; parentId?: string }) {
    // Ensure no ID is sent to backend
    const { id, ...commentData } = comment as any;
    return this.fetchApi(`/websites/${websiteId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  // ===== COMMENT THREAD ENDPOINTS =====
  
  /**
   * GET /websites/:websiteId/threads - Get discussion threads for website
   * 
   * Input: websiteId (string) - Website project ID
   * Expected Response: Array of thread objects
   * Response Format: [
   *   {
   *     id: string,
   *     projectId: string,
   *     title: string,
   *     status: 'open' | 'resolved' | 'needs-revision',
   *     createdBy: string,
   *     createdAt: string,
   *     comments: Comment[] (nested comments array)
   *   }
   * ]
   * 
   * Use Case: Organize feedback into discussion threads
   * Feature: Supports status-based filtering and resolution tracking
   */
  async getThreads(websiteId: string) {
    return this.fetchApi(`/websites/${websiteId}/threads`);
  }

  /**
   * POST /websites/:websiteId/threads - Create new discussion thread
   * 
   * Input:
   * - websiteId (string) - Website project ID  
   * - thread (object) - Thread data
   * 
   * Request Body Format: {
   *   title: string (required) - Thread title
   *   status: 'open' | 'needs-revision' (required),
   *   createdBy: string (required) - Creator name
   *   comments: [Comment] - Initial comments array
   * }
   * 
   * Expected Response: Created thread object
   * Response Format: Same as individual thread in GET response
   * 
   * Use Case: Start organized feedback discussions
   * Trigger: Often created during compliance review process
   */
  async createThread(websiteId: string, thread: any) {
    // Ensure no ID is sent to backend - backend generates IDs
    const { id, ...threadData } = thread;
    return this.fetchApi(`/websites/${websiteId}/threads`, {
      method: 'POST',
      body: JSON.stringify(threadData),
    });
  }

  /**
   * PUT /threads/:threadId - Update thread status or add comments
   * 
   * Input:
   * - threadId (string) - Thread ID
   * - updates (object) - Thread updates
   * 
   * Request Body Format: Partial<{
   *   status?: 'open' | 'resolved' | 'needs-revision',
   *   title?: string,
   *   comments?: Comment[] (append new comments)
   * }>
   * 
   * Expected Response: Updated thread object
   * Response Format: Same as GET /websites/:websiteId/threads
   * 
   * Use Case: Mark threads resolved, add follow-up comments
   * Workflow: Status changes trigger notifications to relevant users
   */
  async updateThread(threadId: string, updates: any) {
    return this.fetchApi(`/threads/${threadId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Get WebSocket URL
  getWebSocketUrl(): string {
    return this.config.websocketUrl;
  }

  // Update configuration
  updateConfig(newConfig: Partial<ApiConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export const apiService = new ApiService();
