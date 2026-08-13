# Express CI/CD Pipeline Demo

A basic Continuous Integration and Continuous Deployment (CI/CD) pipeline built with **GitHub Actions**, **Docker**, and **Render**.

The pipeline automatically:
1. Runs unit tests
2. Builds a Docker image
3. Pushes the image to GitHub Container Registry (`ghcr.io`)
4. Deploys the application to a staging environment on Render

---

## Live Demo

- **Staging Environment**: [https://express-ci-cd-staging.onrender.com.](https://express-ci-cd-staging.onrender.com.)

- **GitHub Repository**: [https://github.com/KyeiEdwin/express-ci-cd](https://github.com/KyeiEdwin/express-ci-cd)

---

## Tech Stack

| Component              | Technology                          |
|------------------------|-------------------------------------|
| Runtime                | Node.js 22                          |
| Framework              | Express.js                          |
| Testing                | Jest + Supertest                    |
| Containerization       | Docker                              |
| CI/CD                  | GitHub Actions                      |
| Container Registry     | GitHub Container Registry (ghcr.io) |
| Staging Environment    | Render.com                          |

---

## Project Structure

```text
express-ci-cd/
├── src/
│   └── index.js              # Express application
├── tests/
│   └── app.test.js           # Unit tests
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # CI/CD pipeline
├── Dockerfile
├── .dockerignore
├── .gitignore
├── package.json
└── README.md

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