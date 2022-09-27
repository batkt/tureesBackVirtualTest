FROM node:16.14.2 as build

WORKDIR /app/turees

RUN yarn add --registry http://103.168.56.135:4873 zevback daalgavar sharp bcrypt

COPY . .

EXPOSE 8081

CMD ["npm", "start"]