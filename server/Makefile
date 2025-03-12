## This file list useful commands to interact with the application containers without directly invoking docker commands.
## ---

# Define variables
DOCKER_COMPOSE = docker compose
WEB_CONTAINER_NAME = web

# Define targets
.PHONY: start stop update logs console attach pristine init-dev-db init-test-db init-db rspec rspec-file seed-helix reseed-helix sidekiq-health

attach: ## Attach local stdin, stdout, stderr, to the running web container
	docker attach monthly_budget-server-1

%: # Catch all for unknown targets so Make won't complaining about the additional arguments
	@:
