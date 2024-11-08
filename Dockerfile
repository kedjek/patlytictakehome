# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build the app (if needed for frontend assets)
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
