FROM node:latest
RUN mkdir -p /client
WORKDIR /client
COPY ["package.json", "package-lock.json*", "/client/"]
RUN npm install
COPY . ./client
EXPOSE 3000
CMD ["npm","start"]