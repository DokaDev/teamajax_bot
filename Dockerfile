FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript code to JavaScript
RUN npm run build

# Environment configuration - production mode
ENV NODE_ENV=production

# Command to run when the container starts
CMD ["npm", "start"] 