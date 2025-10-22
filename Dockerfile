# Use a lightweight and secure base image for serving static content
# nginx:stable-alpine is a minimal image, reducing the attack surface.
FROM nginx:stable-alpine

# Set the working directory to the default NGINX web root directory
WORKDIR /usr/share/nginx/html

# Copy all the static application files (HTML, CSS, JS, images) into the container.
# The .dockerignore file will prevent unnecessary files from being included.
COPY . .

# Inform Docker that the container listens on port 80 at runtime
EXPOSE 80

# The base image already has a CMD to start the NGINX server,
# so no explicit CMD is needed here.
# CMD ["nginx", "-g", "daemon off;"]
