all: build build-compress copy

build:
	@wrup -r boxspring ./ > boxspring.js
	@echo "File written to 'boxspring.js'"

build-compress:
	@wrup -r boxspring ./ > boxspring.min.js --compress
	@echo "File written to 'boxspring.min.js'"

copy:
	@cp boxspring.js ../boxspring-ios/BoxSpringApp/App/main.js

test:
	@./node_modules/mocha/bin/mocha --reporter spec \
		test/core/*

.PHONY: test