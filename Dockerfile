FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY images/ /usr/share/nginx/html/images/
COPY fonts/ /usr/share/nginx/html/fonts/
COPY media/ /usr/share/nginx/html/media/
COPY vendor/ /usr/share/nginx/html/vendor/
COPY nginx-gzip.conf /etc/nginx/conf.d/gzip.conf
EXPOSE 80
