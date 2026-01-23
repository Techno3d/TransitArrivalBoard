build: src/* proto/* app/*
	cd backend && cargo build --release
	cd frontend && npm run build

install:
	cd backend && cargo test
	cd frontend && npm ci

clean:
	cd backend && cargo clean
	cd frontend && rm -rf node_modules
