# Usando imagem oficial e ultra-leve do Nginx Alpine
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia a configuração customizada do Nginx com Gzip e Cache
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos do site para o diretório raiz do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80 padrão HTTP
EXPOSE 80

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
