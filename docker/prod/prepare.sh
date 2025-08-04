#!/bin/sh

cp ~/.AW/prod/vault/.env.prod ../../vault/.env.prod
docker compose up -d