# Use slim Node.js alpine image for production
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Expose the backend port
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]
