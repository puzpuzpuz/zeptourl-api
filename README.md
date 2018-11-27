# zeptourl-api

A lightweight TinyURL-like demo application, a RESTful web service. Built with Node.js and Cassandra.

## Overview

The main problem with TinyURL-like application is scaling. This app solves the problem in one of the most simple, yet scalable manners.

Each time when a new URL minification request is received, the app generates a random URL (let's call it zURL) which is a Base32-encoded string of a constant length (specified in the config). Then it tries to insert a new record into Cassandra. The insert fails in case of a possible collision (thanks to the [`IF NOT EXISTS` clause](https://docs.datastax.com/en/cql/3.3/cql/cql_reference/cqlInsert.html)). This process repeats several times.

While this design assumes that collisions will be happening more and more frequently with the DB grow, it may be enhanced in a quite simple way. Number of collisions per zURL generation request may be somehow monitored externally, e.g. via logging and ELK-stack. Once it reaches a certain threshold, say two collisions per 5th percentile of requests, new Node.js instances with an increased zURL length config parameter may be deployed.

## Requirements

The app assumes using Node.js 10 and Cassandra 3. You can use Docker and Docker Compose for dev environment as well.

## Dev environment

To start all application components run the following command:

```bash
docker-compose up
```

To start the Node.js application only run the following command:

```bash
npm run start
```

In the later case, you probably need to change DB connection settings (`app/config/development.json`).

## Configuration

Current configuration type is specified by `NODE_ENV` environment variable. Default configuration type is `development`. Parameters for each type are stored in `app/config/` directory.

The app is using [nconf](https://github.com/indexzero/nconf) internally to manage the configuration. So any config parameter can be overridden via environment variables. For instance, `app.zUrlGenRetries` parameter can be overridden by an env var with `app:zUrlGenRetries`.

## TODO

* In-code TODOs
* Unit tests
* Built-in Swagger spec
* Cassandra cluster (2+ nodes)
