ORGANIZATION = agolub
CONTAINER = design-system-builder
VERSION = 0.1.0

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build

build-image :
	docker build -t $(ORGANIZATION)/$(CONTAINER):$(VERSION) ./cd

build :
	docker run --rm --name $(CONTAINER) \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env RELEASE_INCREMENT=${RELEASE_INCREMENT} \
		--env DRY_RUN=${DRY_RUN} \
		-v ${PWD}/secrets:/usr/src/secrets/secrets \
		-v ${PWD}/github_rsa:/root/.ssh/github_rsa \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)

shell :
	docker run -it --rm --name $(CONTAINER) \
		--entrypoint /bin/sh \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env RELEASE_INCREMENT=${RELEASE_INCREMENT} \
		--env DRY_RUN=${DRY_RUN} \
		-v ${PWD}/secrets:/usr/src/secrets \
		-v ${PWD}/github_rsa:/root/.ssh/github_rsa \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)
