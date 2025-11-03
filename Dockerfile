# Stage 1: Use a lightweight Nginx web server for serving static content
FROM nginx:1.25-alpine

# Set the working directory to the Nginx web root
WORKDIR /usr/share/nginx/html

# Remove the default Nginx welcome page
RUN rm -f index.html

# Copy all the static application files (HTML, CSS, JS, images) into the container
# It's assumed your project has an index.html, styles, game.js, and an images directory.
COPY . .

# Expose port 80 to the outside world
EXPOSE 80

# The base Nginx image already has a CMD to start the server, so we don't need to add one.
# The default command is: CMD ["nginx", "-g", "daemon off;"]
