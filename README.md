# zeptourl-api

A lightweight TinyURL-like demo application, a RESTful web service. Built with Node.js and Cassandra.

## Overview

The main problem with TinyURL-like application is scaling. This app solves the problem in one of the most simple, yet good enough manners.

Each time when a new URL minification request is received, the app generates a random URL (let's call it zURL) which is a Base32-encoded string of a constant length (specified in the config). Then it tries to insert a new record into Cassandra. The insert fails in case of a possible collision (thanks to the [`IF NOT EXISTS` clause](https://docs.datastax.com/en/cql/3.3/cql/cql_reference/cqlInsert.html)). This process repeats several times (also specified in the config).

While this design assumes that collisions will be happening more and more frequently while the DB grows, it may be enhanced in a quite simple way. Number of collisions per zURL generation request may be somehow monitored externally, e.g. via logging and ELK-stack. Once it reaches a certain threshold, say two collisions per 5th percentile of requests, new Node.js instances with an increased value of the length parameter may be deployed.

## Requirements

The app assumes using Node.js 10 and Cassandra 3. You can use Docker and Docker Compose for dev environment as well.

## Dev Environment

To start all application components run the following command:

```bash
docker-compose up
```

This command will start a Cassandra cluster of two nodes and the app itself, so it may take a while (at least 60s). Also make sure that you have at least 2GB of memory available for Docker.

Once started the API will be available on [http://localhost:3000/api/v1](http://localhost:3000/api/v1).

To start the Node.js application only run the following commands:

```bash
npm ci
npm run start
```

In this case, you might need to change DB connection settings (see `app/config/development.json` config).

## Configuration

Current configuration type is specified by `NODE_ENV` environment variable. Default configuration type is `development`. Parameters for each type are stored in `app/config/` directory.

The app is using [nconf](https://github.com/indexzero/nconf) internally to manage the configuration. So any config parameter can be overridden via environment variables. For instance, `app.zUrlGenRetries` parameter can be overridden by an env var with `app:zUrlGenRetries`.

## API Specification

API specification is described in `api-spec.yml` file (in Open API v3.0 format). Once dev environment is started by docker-compose, Swagger UI becomes available on [http://localhost:8080/](http://localhost:8080/).

## License

Copyright 2018 puzpuzpuz

Licensed under MIT.

## TODOs

* Implement sufficient amount of unit tests (started)
* Integrate [loopbench](https://github.com/mcollina/loopbench) into system-info#metrics
* Use a more lightweight logger (see [pino](https://github.com/pinojs/pino))
