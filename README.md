## Security Vulnerability Introduced

**Vulnerability:** The Docker container runs as the `root` user.

**Risk:**  
If an attacker exploits a vulnerability in the application (e.g. Remote Code Execution), they would gain root privileges inside the container. This increases the blast radius and makes container escape or privilege escalation easier.

**How it was introduced:**  
The original Dockerfile did not include a `USER` instruction, so the process runs as root by default.

### How to Fix It

Add a non-root user in the Dockerfile:

```dockerfile
# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# ... (copy files, install dependencies)

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

CMD ["node", "src/index.js"]