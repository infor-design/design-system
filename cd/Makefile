ORGANIZATION = hookandloop
CONTAINER = design-system-builder
VERSION = 0.2.0

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build

all : build push

build :
	docker build --platform linux/amd64 \
		-t $(ORGANIZATION)/$(CONTAINER):$(VERSION) .

push :
	docker push $(ORGANIZATION)/$(CONTAINER):$(VERSION)

shell :
	docker run -it --rm --name $(CONTAINER) \
		--entrypoint /bin/sh \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env DRY_RUN=${DRY_RUN} \
		--env BRANCH=${BRANCH} \
		--env REPO_OWNER_NAME=${REPO_OWNER_NAME} \
		-v ${PWD}/.gitconfig:/root/.gitconfig \
		-v ${PWD}/build:/root/design-system \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)
