# Build stage
FROM ruby:3.2-slim as builder

# Install build dependencies
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install bundler
RUN gem install bundler

WORKDIR /app

# Copy Gemfile and install dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# Production stage
FROM ruby:3.2-slim

# Install runtime dependencies
RUN apt-get update -qq && apt-get install -y \
    libpq-dev \
    nodejs \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy gems from builder
COPY --from=builder /usr/local/bundle /usr/local/bundle

WORKDIR /app

# Copy application code
COPY . .

# Precompile assets
RUN bundle exec rake assets:precompile

# Set production environment
ENV RAILS_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true

# Expose port
EXPOSE 3000

# Start the server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"] 