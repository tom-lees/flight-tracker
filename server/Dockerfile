#
#  0 Init
#
#  RUN ONCE CODE - STATUS: COMPLETED
#  Once the below Dockerfile has been completed, 
#  but before it has been run in anger, 
#  the server needs to be initialised,
#  powershell: docker compose run server npm init
#  To install the packages we need,
#  powershell: docker compose run server npm install express socket.io sqlite3
#  powershell: docker compose run server npm install --save-dev nodemon
#
#  This is done as the container is running on ubuntu, rather than windows,
#  packages will have differing releases/versions causing npm install to break.


# Use the official Node.js image from the Docker Hub
FROM node:18-alpine

# -m Creates a home dir for new user
# -s Sets default shell for new user
# -u User ID for new user
# agent0 is the username for new user
# (-ms creates the home dir and sets the default shell.  The home dir will be something like
# /home/<username>, NOT /bin/sh)

#***
# User management package.  Lean
RUN apk add --no-cache shadow
RUN useradd -ms /bin/sh -u 1001 agent0

# Set the working directory inside the container
WORKDIR /workspace

# Copy package.json and package-lock.json to the working directory
# The slash is just cosmetic and does not doing anything, you could just use -> .


# Install the dependencies
# Install nodemon globally before npm
# RUN npm install -g nodemon
# RUN npm install socket.io
# RUN npm install sqlite3
# RUN npm install express
# RUN npm install


# Copy the rest of the application code to the working directory
# COPY --chown=agent0:agent0 . .
COPY package*.json ./

RUN npm install

COPY . .


# Sets environment variables for application
ENV PORT=3000

# Listens on this port.
EXPOSE 3000

# Switch user context to our new 'agent0' user
RUN chown -R agent0:agent0 /workspace
USER agent0

# Runs the commands in cmd (>>> npm start)
# npx allows to run binaries nodemon without global installation.
CMD ["npx", "nodemon", "server.js"]
