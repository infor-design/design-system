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
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		-v /Users/agolub/.ssh/github_id_rsa:/root/.ssh/id_rsa \
		-v ${PWD}:/usr/src \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)

shell :
	docker run -it --rm --name $(CONTAINER) \
		--entrypoint /bin/sh \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		-v /Users/agolub/.ssh/github_id_rsa:/root/.ssh/id_rsa \
		-v ${PWD}:/usr/src \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)

shell-darling :
	docker run -it --rm --name darling \
		--entrypoint /bin/bash \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		-v /Users/agolub/.ssh/github_id_rsa:/root/.ssh/id_rsa \
		-v ${PWD}/sketchtool:/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool \
		-v ${PWD}/bin/sketchtool:/Applications/Sketch.app/Contents/MacOS/sketchtool \
		-v ${PWD}/darling-docker/darling-dkms_1.0_all.deb:/root/darling-dkms_1.0_all.deb \
		-v ${PWD}:/usr/src \
		darling1

shell-ubuntu :
	docker run -it \
		--name ubuntu \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v ${PWD}:/usr/src \
		ubuntu:20.04
