FROM node:18-alpine

WORKDIR /app

# Copy package files from server folder
COPY server/package*.json ./

# Install production dependencies (nodemon not needed in container)
RUN npm install --omit=dev

# Copy server code
COPY server/ .

EXPOSE 3000

# Run using node directly (nodemon is for development only)
CMD ["node", "app.js"]