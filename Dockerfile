# Use Node.js for building the React app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as the web server
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx files
RUN rm -rf ./*

# Copy the built React app to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the correct port
EXPOSE 8080

# Set environment variable for Cloud Run
ENV PORT=8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
