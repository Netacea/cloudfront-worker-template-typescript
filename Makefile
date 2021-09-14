.PHONY: build-LambdaEdgeOriginResponse build-LambdaEdgeViewerRequest build-LambdaEdgeViewerResponse build-RuntimeDependenciesLayer

build-LambdaEdgeOriginResponse:
	npm install
	npm run build
	cp -r dist "$(ARTIFACTS_DIR)/"

build-LambdaEdgeViewerRequest:
	npm install
	npm run build
	cp -r dist "$(ARTIFACTS_DIR)/"

build-LambdaEdgeViewerResponse:
	npm install
	npm run build
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes don't relate to dependencies