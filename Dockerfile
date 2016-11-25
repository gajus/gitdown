FROM node
ENV UPDATED_AT 2016-08-11a
ADD . /app
RUN cd /app && npm install
ENTRYPOINT ["/app/src/bin/index.js"]
