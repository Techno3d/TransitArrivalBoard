build: src/* proto/* app/*
	cargo build --release
	npm run build
	cp config.ts out/
ifeq ($(OS),Windows_NT)
	cp target/release/transit-board.exe out/
	cp run.bat out/
else
	cp target/release/transit-board out/
	cp run.sh out/
endif
ifeq (, $(which zip))
	zip -r out.zip out/
endif
	touch out/.env
	cp export_readme.md out/README.md

install_deps:
	npm ci

clean:
	cargo clean
	rm -rf node_modules
