# [Choice] Python version (use -bullseye variants on local arm64/Apple Silicon): 3, 3.10, 3.9, 3.8, 3.7, 3.6, 3-bullseye, 3.10-bullseye, 3.9-bullseye, 3.8-bullseye, 3.7-bullseye, 3.6-bullseye, 3-buster, 3.10-buster, 3.9-buster, 3.8-buster, 3.7-buster, 3.6-buster
ARG VARIANT=3-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/python:${VARIANT}

# [Choice] Node.js version: none, lts/*, 16, 14, 12, 10
ARG NODE_VERSION="none"
RUN if [ "${NODE_VERSION}" != "none" ]; then su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi

# install npm concurrently
RUN npm install -g concurrently

# [Optional] If your pip requirements rarely change, uncomment this section to add them to the image.
COPY server/requirements.txt /tmp/pip-tmp/
RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
    && rm -rf /tmp/pip-tmp

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# install node_modules in mathtts-site
# copy package.json and package-lock.json
COPY client/package.json client/package-lock.json /workspaces/math-tts/client/
RUN cd /workspaces/math-tts/client && npm install

# based on architecture, download pandoc
RUN if [ "$(uname -m)" = "x86_64" ]; then \
    wget https://github.com/jgm/pandoc/releases/download/2.19.2/pandoc-2.19.2-1-amd64.deb && dpkg -i pandoc-2.19.2-1-amd64.deb; else \
    wget https://github.com/jgm/pandoc/releases/download/2.19.2/pandoc-2.19.2-1-arm64.deb && dpkg -i pandoc-2.19.2-1-arm64.deb; fi

COPY . .
