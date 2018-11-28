CREATE KEYSPACE IF NOT EXISTS zepto_db
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 2};

USE zepto_db;

CREATE TABLE IF NOT EXISTS z_urls (
  z_url text,
  original_url text,
  created_on timestamp,
  PRIMARY KEY (z_url)
);
