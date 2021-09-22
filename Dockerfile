FROM node:current-alpine as builder
WORKDIR /library
COPY . .
RUN npm i
RUN npm run build --development

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /library/dist/Library .
# COPY nginx.conf /etc/nginx/nginx.conf
# RUN chown root /usr/share/nginx/html/*
# RUN chmod 755 /usr/share/nginx/html/*
# EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]