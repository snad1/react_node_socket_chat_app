FROM node:latest
RUN mkdir -p /server
WORKDIR /server
COPY ["package.json", "package-lock.json*", "/server/"]
RUN npm install
COPY . ./server
EXPOSE 5000
CMD ["npm","build"]
CMD ["npm","start"]