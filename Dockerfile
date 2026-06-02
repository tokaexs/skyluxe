# Production Node.js environment
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose server port
EXPOSE 5000

# Start production server
CMD ["node", "server.js"]
