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
	echo "#Running Transit Board\nTo run Transit board, make sure you have python installed or change the run script to use a different http server.\n\n"

install_deps:
	npm ci

clean:
	cargo clean
	rm -rf node_modules
