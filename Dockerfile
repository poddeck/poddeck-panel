FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN VITE_API_BASE_URL=/v1/ npm run build

FROM nginx:1.29.8

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh && \
    chown -R 1000:1000 /usr/share/nginx/html /etc/nginx/conf.d /var/cache/nginx /var/run

USER 1000

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO /dev/null http://localhost:8081/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
