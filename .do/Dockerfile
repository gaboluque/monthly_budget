# Use an official Ruby runtime as a parent image
FROM ruby:3.3.5-slim as builder

# Set environment variables for build
ENV RAILS_ENV=${ENV} \
    NODE_ENV=${ENV} \
    BUNDLE_WITHOUT="development:test" \
    BUNDLE_FROZEN=1 \
    BUNDLE_JOBS=4

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    nodejs \
    postgresql-client \
    build-essential \
    git \
    libpq-dev \
    curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm install -g npm@latest && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install the specific version of Bundler
RUN gem install bundler

# Set the working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY server/Gemfile server/Gemfile.lock ./
COPY client/package.json client/package-lock.json ./client/

# Install gems and npm packages
RUN bundle install && \
    cd client && \
    npm ci && \
    npm install -g typescript && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

# Set client base url with env variable
ENV VITE_BASE_API_URL=${CLIENT_BASE_URL}

# Build the client
RUN cd client && npm run build

# Production stage
FROM ruby:3.3.5-slim as runner

# Set production environment variables
ENV RAILS_ENV=${ENV} \
    NODE_ENV=${ENV} \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

# Install runtime dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy gems from builder
COPY --from=builder /usr/local/bundle /usr/local/bundle

# Copy the server code
COPY server .

# Create public directory and copy the client build
RUN mkdir -p public
COPY --from=builder /app/client/dist/* ./public/

# Expose the port the app runs on
EXPOSE 80

# Start the server
CMD ["rails", "server", "-b", "0.0.0.0"]