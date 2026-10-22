# CX Reply Assistant

An AI-powered customer support assistant that helps support agents generate policy-aware replies to customer messages.

## Features

- AI-generated customer support replies using OpenRouter
- Brand-specific policies for returns, refunds, shipping, and cancellations
- Review and approve generated replies before adding them to the conversation
- React-based customer support interface
- Flask REST API backend
- Docker containers for frontend and backend
- Docker Compose for running the application locally

## Tech Stack

- **Frontend:** React, Vite, JavaScript
- **Backend:** Python, Flask
- **AI:** OpenRouter API
- **Containers:** Docker, Docker Compose
- **Version Control:** Git and GitHub

## Architecture

```text
Customer Support Agent
        |
        v
React Frontend (Port 5173)
        |
        v
Flask Backend (Port 5001)
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

## Run Locally with Docker Compose

### Prerequisites

- Docker Desktop with the WSL 2 integration enabled, or Docker Engine in Ubuntu
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

Check the API health endpoint:

```bash
curl http://localhost:5001/api/health
```

Expected response:

```json
{"application":"CX Reply Assistant","status":"healthy"}
```

### Stop the Application

```bash
docker compose down
```

## Security Notes

- Keep API keys in environment variables.
- Do not commit `.env` files or expose secrets in source code.
- Review AI-generated replies before sending them to customers.

## Current Limitations

- The Approve & Send workflow is a local demo; it does not send messages to an external customer support platform.
- Customer conversations and demo activity are handled by the application rather than a production customer support integration.
- Production deployment requires appropriate API configuration, authentication, monitoring, and secure secret management.

## Future Improvements

- Deploy the frontend and backend to a cloud platform.
- Add automated tests for API responses and policy handling.
- Add user authentication and persistent conversation storage.
- Integrate with a real customer support platform.

## Author

**Suchit Deshmukh**

- GitHub: [Suchitdev](https://github.com/Suchitdev)
- Project Repository: [CX Reply Assistant](https://github.com/Suchitdev/cx-reply-assistant)
