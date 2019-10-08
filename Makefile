.PHONY: build clean

build:
	npx babel ./source --out-dir ./ --ignore ./node_modules,./.babelrc,./package.json,./npm-debug.log --copy-files

clean:
	rm -f  ./*.js
	rm -rf ./RomFactory