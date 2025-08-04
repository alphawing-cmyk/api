# Note: This file is read from a folder above ../postgres

# Image
FROM postgres:latest

# Environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=vault

# Create the SSL directory
RUN mkdir -p /var/lib/postgresql/ssl

# Copy SSL certificates from the host to the container
COPY server.crt /var/lib/postgresql/ssl/server.crt
COPY ca.crt /var/lib/postgresql/ssl/ca.crt
COPY server.key /var/lib/postgresql/ssl/server.key


# Set permissions for the SSL certificates
RUN chown postgres:postgres /var/lib/postgresql/ssl/server.crt
RUN chown postgres:postgres /var/lib/postgresql/ssl/ca.crt
RUN chown postgres:postgres /var/lib/postgresql/ssl/server.key
RUN chmod 600 /var/lib/postgresql/ssl/server.crt /var/lib/postgresql/ssl/ca.crt /var/lib/postgresql/ssl/server.key

# Expose the PostgreSQL port
EXPOSE 5432
