BACKEND_BINARY = ./backend/target/release/transit-board
FRONTEND_URL = http://localhost:5173

build: src/* proto/* app/*
	cd backend && cargo build --release
	cd frontend && npm run build

run:
	@$(BACKEND_BIN) & 
	@npm run start & 
	@sleep 5 
	@firefox --new-tab $(FRONTEND_URL) ||"C:\Program Files\Mozilla Firefox\firefox.exe" $(FRONTEND_URL)

install:
	cd backend && cargo test
	cd frontend && npm ci

format:
	cd backend && cargo fmt
	cd frontend && npm run fmt

clean:
	cd backend && cargo clean
	cd frontend && npm run clean
