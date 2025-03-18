# Use the official nginx image as a base
FROM nginx:alpine

# Copy all website files to the nginx html directory
COPY . /usr/share/nginx/html/

# Remove the default nginx index page
RUN rm /usr/share/nginx/html/index.html.default 2>/dev/null || true

# Expose port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]