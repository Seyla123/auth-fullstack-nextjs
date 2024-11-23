# Step 1: Use the official Node.js Alpine image as a base
FROM node:20-alpine AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install project dependencies
RUN npm install 

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Build the Next.js app
RUN npm run build


# Step 8: Expose the port the app will run on
EXPOSE 3000

# Step 9: Start the Next.js app in production mode
CMD ["npm", "start"]
