# Express CI/CD Pipeline Demo

Basic CI/CD pipeline using GitHub Actions that:

1. Runs automated tests
2. Builds a Docker image
3. Pushes the image to GitHub Container Registry (ghcr.io)
4. Deploys to a staging environment on Render.com

## Pipeline Overview

- **Trigger**: Push or Pull Request to `main`
- **Jobs**:
  - `test` → runs Jest tests
  - `build-and-push` → builds and pushes Docker image to `ghcr.io`
  - `deploy-staging` → triggers Render deploy via Deploy Hook

## Security Vulnerability Introduced

**Vulnerability:** The Docker container runs as the `root` user.

**Risk:**  
If the application is compromised (for example via Remote Code Execution), an attacker would have root privileges inside the container. This makes further attacks (container escape, accessing secrets, etc.) much easier.

**How it was introduced:**  
The original `Dockerfile` did not contain a `USER` instruction, so the Node.js process runs as root by default.

### How to Fix It

Update the `Dockerfile` to create and use a non-root user:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
CMD ["node", "src/index.js"]