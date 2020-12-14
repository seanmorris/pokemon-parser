.PHONY: build clean

build:
	npx babel ./source --out-dir ./

clean:
	rm -f  ./*.js
	rm -rf ./RomFactory
