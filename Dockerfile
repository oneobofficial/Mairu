# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using `npm ci` for reliable, reproducible builds
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the production bundle
RUN npm run build

# Serve Stage
FROM nginx:alpine

# Set the PORT environment variable to the Cloud Run default
# Cloud Run can override this value at runtime
ENV PORT=8080

# The standard nginx image supports env-substituted templates
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Remove the default nginx index page and copy our built app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the configurable port
EXPOSE $PORT

# Nginx automatically runs envsubst on files in templates, generating /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
