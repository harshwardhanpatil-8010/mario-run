FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy all static assets from the repository
# This assumes an index.html, game.js, and an images/ directory exist
COPY . .

# Expose port 80 for the web server
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
