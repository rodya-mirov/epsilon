docker build -t epsilon-server -f api.Dockerfile . \
    && docker run -p 8123:8080 -i -t epsilon-server 
