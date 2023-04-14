NAME = transcendence
USER = gavaniwast

all: clean dev

dev:
	docker compose up --build

check:
	NODE_ENV="check" docker-compose run back --build
	NODE_ENV="check" docker-compose run front --build
	docker-compose down
	
debug:
	NODE_ENV="debug" BUILDKIT_PROGRESS=plain docker-compose up --build

stop:
	docker-compose down

clean: stop
	docker system prune -f

fclean: stop
	rm -rf */volume/node_modules
	docker system prune -af --volumes

re: fclean dev

.PHONY: all dev check debug stop clean fclean re 
