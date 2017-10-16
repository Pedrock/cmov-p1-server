'use strict';
require('dotenv-safe').load({ allowEmptyValues: true });
const { exec } = require('child_process');

exec(`docker-compose run -d -p ${process.env.DB_PORT || 5432}:5432 postgres`).stdout.pipe(process.stdout);
exec(`docker-compose run -d -p ${process.env.REDIS_PORT || 5432}:6379 redis`).stdout.pipe(process.stdout);
