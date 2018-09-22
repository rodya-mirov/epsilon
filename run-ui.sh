docker build -t epsilon-frontend -f ui.Dockerfile . \
    && docker run -p 3000:3000 -i epsilon-frontend 
