FROM node:21.5-bookworm-slim

WORKDIR /usr/app/webapp/

RUN npm install -g \ 
    npm@10.3.0

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./tsconfig.json

COPY src/ src/

RUN npm run build

COPY ./entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]

CMD ["node", "./dist/index.js", "--trace-deprecation", "--trace-warnings"]
