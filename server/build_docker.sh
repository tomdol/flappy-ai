#!/usr/bin/env bash

DOCKER_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd)

docker build --build-arg all_proxy=${all_proxy} \
             --build-arg http_proxy=${http_proxy} \
             --build-arg https_proxy=${https_proxy} \
             --build-arg no_proxy=${no_proxy} \
             -t issondl-game $DOCKER_DIR

