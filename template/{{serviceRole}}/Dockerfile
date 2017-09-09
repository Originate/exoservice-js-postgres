FROM nodesource/node
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# These steps ensure that yarn install is only run when package.json changes
COPY ./package.json .
COPY ./yarn.lock .
RUN $HOME/.yarn/bin/yarn install
COPY . .
