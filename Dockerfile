FROM node:20-alpine as development

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 3000

CMD ["node", "dist/index.js"]