# BoardInboxAI Backend

This is the backend for generating Pipedream Connect links for HOA customers.  
It uses a Vercel Serverless API route and the @pipedream/sdk package.

## 🚀 API Endpoints

### **POST /api/connect-link**

Generate a Pipedream Connect link for an HOA manager, which they can click to authorize Gmail access.

#### Request Body:
```json
{
  "userId": "hoa-123"
}
