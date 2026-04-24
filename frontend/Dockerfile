# --- Stage 1: Build Stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# We pass the API URL as a build arg so it's baked into the React bundle
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# --- Stage 2: Production Stage ---
FROM nginx:stable-alpine

# Copy build files from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config for React Router
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
