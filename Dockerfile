#stage 1 - Initialize React App
FROM node:18-alpine AS client_builder

# make the 'client' folder the current working directory
WORKDIR /client

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json /client/

# copy yarn lock
COPY yarn.lock /client/

# copy project files and folders to the current working directory (i.e. 'client' folder)
COPY . /client/

# install project dependencies
RUN yarn install

# build client for production with minification
RUN yarn run build
# test
# EXPOSE 3000
# CMD ["npm install -g serve", "serve -s build"]

# Stage 2 - Build and Deploy Nginx Server
FROM nginx
COPY --from=client_builder ./client/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
