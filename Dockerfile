# Use a lightweight web server
FROM nginx:alpine

# Set the working directory to the Nginx HTML folder
WORKDIR /usr/share/nginx/html

# Copy all the static application files into the container
COPY . .

# Expose port 80 to the outside world
EXPOSE 80

# The default nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
