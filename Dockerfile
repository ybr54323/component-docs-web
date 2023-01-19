FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf.template
COPY ./docs/.vuepress/dist/ /usr/share/nginx/html/docs
# SSL keys and certs
#COPY nginx_ssl/nginx-selfsigned.key /etc/ssl/private/
#COPY nginx_ssl/nginx-selfsigned.crt /etc/ssl/certs/
ENV VUE_APP_API_BASE_URL="http://ip:port/"
ENV GATEWAY_URL="http://ip:port/"
ENV DATASHARE_URL="http://ip:port/"
ENV MOCK_URL="http://ip:port/"
ENV UNIFIED_URL="http://ip:port/"
ENV VUE_APP_AUTHORIZE_SERVER_URL="http://ip:port/"
ENV VUE_APP_REDIRECT_URL_LOGOUT="http://ip:port/"
ENV VUE_APP_REDIRECT_URL="http://ip:port/"
ENV VUE_APP_AUTHORIZATION_CLIENT_ID="634737676733382656"
ENV FORM_RENDER_URL="http://ip.port/"
EXPOSE 443
EXPOSE 80

CMD envsubst '$VUE_APP_AUTHORIZE_SERVER_URL $MOCK_URL $GATEWAY_URL $DATASHARE_URL $UNIFIED_URL $VUE_APP_REDIRECT_URL_LOGOUT $VUE_APP_REDIRECT_URL $FORM_RENDER_URL' </etc/nginx/nginx.conf.template >/etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
