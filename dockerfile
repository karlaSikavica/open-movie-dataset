FROM postgres:15-alpine
ENV POSTGRES_PASSWORD=neverMinD44
ENV POSTGRES_DB=filmovi
COPY filmovi.sql /docker-entrypoint-initdb.d/
