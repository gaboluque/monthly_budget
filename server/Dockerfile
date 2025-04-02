# Use an official Ruby runtime as a parent image

FROM ruby:3.3.5-slim

# Install dependencies
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client build-essential git libpq-dev

# Install the specific version of Bundler
RUN gem install bundler

# Set the working directory
WORKDIR /app

# Copy the Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["rails", "server", "-b", "0.0.0.0"]