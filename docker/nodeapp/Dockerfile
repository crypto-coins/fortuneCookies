FROM node:latest

# Apt has no cli interface.  why??


RUN apt update && apt install -y nano net-tools


COPY src /app
RUN cd /app && npm install

# web port
EXPOSE 8088


# Copy the entrypoint script.
COPY "start-node.sh" .
RUN chmod +x start-node.sh


WORKDIR /app
CMD ["node", "/app/server/app.js"]
