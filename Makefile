ORGANIZATION = agolub
CONTAINER = design-system-builder
VERSION = 0.1.0

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build

build-image :
	docker build -t $(ORGANIZATION)/$(CONTAINER):$(VERSION) .

build :
	docker run --rm --name $(CONTAINER) \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		-v ${PWD}:/usr/src \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)
