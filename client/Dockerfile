# Use an official Node.js runtime as a parent image
FROM node:18
 
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the development server with hot reloading
CMD ["npm", "run", "dev"] 