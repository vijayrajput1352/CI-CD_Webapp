#!/bin/bash
cd knex_migrations && knex migrate:latest --env=stage-az && knex seed:run --env=stage-az && cd ..
pm2-runtime /source/server/index.js
