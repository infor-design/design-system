ORGANIZATION = hookandloop
CONTAINER = design-system-builder
VERSION = 0.1.0

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build

all-image : build-image push-image

build-image :
	docker build -t $(ORGANIZATION)/$(CONTAINER):$(VERSION) .

push-image :
	docker push $(ORGANIZATION)/$(CONTAINER):$(VERSION)

build :
	docker run --rm --name $(CONTAINER) \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env RELEASE_INCREMENT=${RELEASE_INCREMENT} \
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		--env BRANCH=${BRANCH} \
		--env REPO_OWNER_NAME=${REPO_OWNER_NAME} \
		-v ${PWD}/.gitconfig:/root/.gitconfig \
		-v ${PWD}/build:/root/design-system \
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
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		--env BRANCH=${BRANCH} \
		--env REPO_OWNER_NAME=${REPO_OWNER_NAME} \
		-v ${PWD}/.gitconfig:/root/.gitconfig \
		-v ${PWD}/build:/root/design-system \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)
