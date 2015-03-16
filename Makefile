BIN = ./node_modules/.bin

.PHONY: bootstrap release watch build;

SRC = $(shell find ./lib ./errors ./http ./constants ./*.js -type f -name '*.js')

bootstrap: package.json
	@npm install

lint:
	@$(BIN)/jscs $(SRC);

build:
	@mkdir -p dist
	@$(BIN)/browserify --require ./index.js --standalone MartyClipboard -o dist/marty-clipboard.js

watch:
	@mkdir -p dist
	@$(BIN)/watchify --require ./index.js --standalone MartyClipboard -v -o dist/marty-clipboard.js