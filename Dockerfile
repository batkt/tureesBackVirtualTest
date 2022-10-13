FROM --platform=linux/amd64 node:16.14.2

WORKDIR /app/turees

RUN yarn add --registry http://103.168.56.135:4873 zevback daalgavar sharp bcrypt zuragpack

COPY . .

EXPOSE 8081

CMD ["npm", "start"]