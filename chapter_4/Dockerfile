#use an official node.js runtime as a parent image 
FROM node:22-alpine

# Set the working directory in the container 
WORKDIR /app

#Copy the packages.json and the package-lock.json (if available) to the working directory
COPY package*.json ./

#Install Dependencies 
RUN npm install

#copy the rest of the application code 
COPY . ./ 

#EXPOSE the port the app runs on 
EXPOSE 5003 

#define the command to run the application
CMD ["node","./src/server.js"]