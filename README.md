# cmov-p1-server

To start the server in production:
```
docker-compose up -d --build
```

To shutdown:
```
docker-compose down
```

To run in development, install Node.js 8 and run:

```
npm run docker:dev
```

or
```
docker-compose run -d -p 5432:5432 postgres
docker-compose run -d -p 6379:6379 redis
```

and then run:
```
npm run dev
```

In order to setup the Let's Encrypt SSL certificates edit docker-compose.yml, replacing *EXAMPLE.COM* with your website domain and *EMAIL@EXAMPLE.COM* with your email address.

### TypeORM

In order to run typeorm commands, use the *npm run orm* script.
For example:

```npm run orm -- --help```

```npm run orm -- schema:drop```

```npm run orm -- migrations:generate -n test```
