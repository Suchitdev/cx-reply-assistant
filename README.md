# CX Reply Assistant

An AI-powered customer support assistant that helps support agents generate policy-aware replies to customer messages.

## Features

- AI-generated customer support replies using OpenRouter
- Brand-specific policies for returns, refunds, shipping, and cancellations
- Review and approve generated replies before adding them to the conversation
- Safe fallback responses for unsupported policy questions
- React-based customer support interface
- Flask REST API backend
- Docker containers for frontend and backend
- Docker Compose for local development

## Tech Stack

- **Frontend:** React, Vite, JavaScript
- **Backend:** Python, Flask
- **AI Integration:** OpenRouter API
- **Containers:** Docker, Docker Compose
- **Cloud Deployment:** Render
- **Version Control:** Git and GitHub

## Architecture

```text
Customer Support Agent
        |
        v
React Frontend
        |
        v
Flask REST API
        |
        v
OpenRouter API
        |
        v
AI-Generated Reply
        |
        v
Agent Reviews and Approves
```

## Live Deployment

- **Frontend:** Add your actual Render frontend URL here.
- **Backend Health Check:** https://cx-reply-assistant-5ytz.onrender.com/api/health

The backend health endpoint verifies that the deployed service is responding.

## Run Locally with Docker Compose

### Prerequisites

- Docker Desktop with WSL 2 integration enabled, or Docker Engine in Ubuntu
- An OpenRouter API key

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Suchitdev/cx-reply-assistant.git
   cd cx-reply-assistant
   ```

2. Create the backend environment file:

   ```bash
   nano backend/.env
   ```

3. Add your own API key:

   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

   Replace the placeholder with your own key. Never commit or share this file.

4. Build and start the containers:

   ```bash
   docker compose up -d --build
   ```

5. Open the frontend:

   http://localhost:5173

### Verify the Backend

```bash
curl http://localhost:5001/api/health
```

Expected response:

```json
{
  "application": "CX Reply Assistant",
  "status": "healthy"
}
```

### Stop the Application

```bash
docker compose down
```

## Security Notes

- Keep API keys in environment variables.
- Do not commit `.env` files or expose secrets in source code.
- Review AI-generated replies before approving them.
- Use appropriate authentication and access controls before production use.

## Current Limitations

- Approve & Send is a demo workflow; it does not send messages to an external customer support platform.
- Customer conversations and activity are handled within the demo application and are not backed by a production customer-support integration.
- The current prototype does not implement production authentication or persistent conversation storage.
- AI-generated responses may be incorrect and must be reviewed by an agent.
- Production use would require additional security, monitoring, testing, and reliable data storage.

## Future Improvements

- Add user authentication and role-based access control.
- Add persistent conversation storage using PostgreSQL or another suitable database.
- Add automated tests for API responses and policy handling.
- Integrate with a real customer support platform.
- Add retrieval-augmented generation for larger policy collections.
- Add monitoring, logging, and production-grade error handling.

## Author

**Suchit Deshmukh**

- GitHub: [Suchitdev](https://github.com/Suchitdev)
- Project Repository: [CX Reply Assistant](https://github.com/Suchitdev/cx-reply-assistant)
