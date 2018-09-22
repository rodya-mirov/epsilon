FROM node:8

EXPOSE 80

WORKDIR /epsilon/epsilonfrontend

# Install dependencies
COPY ./epsilonfrontend/package*.json ./

RUN npm install

# Install and run the app
COPY ./epsilonfrontend .

EXPOSE 3000

CMD ["npm", "start"]
