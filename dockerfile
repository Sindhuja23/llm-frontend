# Step 1: Use Node.js as a base image
FROM node:16 as build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy all the files
COPY . .

# Step 5: Build the app for production
RUN npm run build

# Step 6: Use Nginx to serve the build
FROM nginx:alpine

# Step 7: Copy the build files from the previous stage to Nginx's default folder
COPY --from=build /app/build /usr/share/nginx/html

# Step 8: Expose the port on which Nginx is running (default port 80)
EXPOSE 80

# Step 9: Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
