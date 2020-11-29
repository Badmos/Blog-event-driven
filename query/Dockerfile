#Base Image
FROM node:alpine

#Set working director inside container to avoid namespace collision
WORKDIR /usr/app/

#Copy dependency file to Container before running npm install (will help caching)
COPY ./package.json ./

#Install project Dependencies
RUN npm install

#Copy other source files to container
COPY ./ ./

CMD ["npm", "start"]



