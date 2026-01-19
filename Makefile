install:
	cargo test
	npm ci

build: src/* proto/* app/*
	cargo build --release
	npm run build

clean:
	cargo clean
	rm -rf node_modules
