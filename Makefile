build: src/* proto/* app/*
	cd backend && cargo build --release
	cd frontend && npm run build

install:
	cd backend && cargo test
	cd frontend && npm ci

format:
	cd backend && cargo fmt
	cd frontend && npm run fmt

clean:
	cd backend && cargo clean
	cd frontend && npm run clean
