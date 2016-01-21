#!/usr/bin/env bash

docker build --tag pfe . && docker run --tty --interactive --rm --env-file <(env) pfe $1
