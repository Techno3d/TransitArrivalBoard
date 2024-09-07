build: src/* proto/* app/*
	cargo build --release
	npm run build

install_deps:
	npm ci

clean:
	cargo clean
	rm -rf node_modules
