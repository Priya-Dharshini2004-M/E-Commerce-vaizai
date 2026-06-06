# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the backend code
COPY . .

# Expose the port your backend runs on (5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]