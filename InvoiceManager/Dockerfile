FROM node:alpine as base
WORKDIR /app
USER root
ARG datbaase_configuration="Server=sql-farm.servers.zip;Database=invoicing;User Id=root;Password=8a8d1ashdioij123asdadito==;"
COPY . .
RUN npm i
CMD ["node", "./bin/www"]
