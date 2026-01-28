# KOLPING HANDBUCH

## create .env file with following params:

```
POSTGRES_PASSWORD=[password]
POSTGRES_USER=[user]
POSTGRES_DB=[db]
NUXT_SESSION_PASSWORD=[password]
NUXT_POSTGRES_URL=postgres://[POSTGRES_USER]:[POSTGRES_PASSWORD]@[POSTGRES_DB]:5432/postgres
```

## setup ports in compose.yaml

```
postgres:
  ports:
    - "[port]:5432"
handbuch:
  ports:
    - "[port]:3000"
```

the port for "handbuch" must match the port setup with the subdomain "handbuch.kolping.at"

## build docker

```
sudo docker compose up --build
```

if started for the first time the database is empty, the postgres db init section creates the useres table and an admin account with the password "pw"
after the first login IMEDIATELY CHANGE THE PASSWORD

## postgres db init

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user','editor','admin')),
    last_login TIMESTAMP WITH TIME ZONE
);

INSERT INTO users (username, password_hash, role, last_login) VALUES
('admin', '$scrypt$n=16384,r=8,p=1$zG7Pe68fB3MZX4wup6Vq2Q$AwztDEp4/6vbqA7TdmpSNO9YRKo/6fc3uJUZuisFWJ/tISX+UKtCcDNsifaDTG5gC3Yp+QQXi/hZ9ec4CMhlDg', 'admin', NULL);

SELECT * FROM users;

DROP TABLE users;
```
