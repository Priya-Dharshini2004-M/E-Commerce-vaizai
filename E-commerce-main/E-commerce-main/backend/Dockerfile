FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (omit dev)
RUN npm ci --omit=dev

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]