NODEENV_VERSION = $(shell nodeenv --version | egrep ^[0-9]*)
NODEENVRC_VERSION = $(shell egrep -o [0-9].* .nodeenvrc)


default: env node_modules ## Default set-up of the cloud-portal-webapp.

new_environment: clean_env default ## Same as default, but removes env folder beforehand and without asking. Make sure you want to delete the Folder!

new_node_modules: clean_node_modules default ## Same es default, but removes node_modules folder beforehand and without asking. Make sure you want to delete the Folder!

new_env_and_node: clean_env clean_node_modules default ## Same as default, but removes env and node_modules folders beforehand and without asking. Make sure you want to delete the Folders!

serve: default ng_serve ## Same as default, but serves the webapp in the end.

check_nodeenv: ## Checks if a version of nodeenv is installed by calling nodeenv --version and asserting that a version number exists
	@echo ---Checking your Nodeenv version:
ifeq ($(NODEENV_VERSION),)
	$(warning Nodeenv was not found.)
	$(error Please install Nodeenv.)
else
	@echo Your Nodeenv version is $(NODEENV_VERSION); \
	if [ ! -n $$(nodeenv --version | egrep ^[1]*) ]; \
	then echo Please update your Nodeenv to the newest update!; \
	fi
endif

env: check_nodeenv .nodeenvrc ## Creates an env folder if not already existing. Also removes and creates a new env folder if
	@echo ---Checking for env folder and version:; \
	if ! test -d env; \
	then echo Env folder does not exist. Creating env folder.; \
	nodeenv -C .nodeenvrc env; \
	. env/bin/activate; \
    echo Rebuilding node-sass; \
    npm rebuild node-sass; \
	elif [ $$(find env/src/ -maxdepth 1 -name "*$(NODEENVRC_VERSION)*" | wc -l) -eq 0 ]; \
	then echo Env folder found, but node version is not the same as in the .nodeenvrc.; \
	while [ -z "$$CONTINUE" ]; do \
        read -r -p "Do you want to remove the env Folder (rm -R env) and recreate with the node version set in .nodeenvrc? [y/n]" CONTINUE; \
    done ; \
	    if [ $$CONTINUE = "y" ] || [ $$CONTINUE = "Y" ]; \
	    then make clean_env; \
      nodeenv -C .nodeenvrc env; \
      . env/bin/activate; \
      echo Rebuilding node-sass; \
      npm rebuild node-sass; \
		else echo Not deleting. It is recommended to use the version set in the .nodeenvrc.; \
		fi; \
	else echo Env folder found and node version same as in the .nodeenvrc.; \
	fi

clean_env: ## Removes the env folder without asking. Make sure you want to delete the Folder.
	@echo ---Removing env folder:; \
	rm -R env; \
	echo Env folder removed.

clean_node_modules: ## Removes the node_modules folder without asking. Make sure you want to delete the Folder.
	@echo ---Removing node_modules folder:; \
	rm -R node_modules; \
	echo Node modules folder removed.

node_modules: package.json ## Activates the virtual environment and creates node_modules/ installs packages from package.json
	@echo ---Installing dependencies from package.json:; \
	. env/bin/activate && \
	npm install && \
	npm install -g @angular/cli

ng_serve: ## Activates the env environment and serves the angular webapp
	@ echo ---Starting Webapp; \
	. env/bin/activate && \
	ng serve

check_deps: ## Checks dependencies and devDependencies of package.json with a dev-package.json
	python3 compare_two_package_json.py package.json dev-package.json

.PHONY: default new_environment new_node_modules new_env_and_node serve check_nodeenv clean_env clean_node_modules ng_serve

help:
	    @egrep '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'
