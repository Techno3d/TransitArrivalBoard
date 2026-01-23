build: src/* proto/* app/*
	cargo build --release
	npm run build

install:
	cargo test
	npm ci

clean:
	cargo clean
	rm -rf node_modules .next types next-env.d.ts
