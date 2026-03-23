# KOLPING HANDBUCH

## Project Setup

1. Create a folder (e.g. `kolping`)
2. Clone the Nuxt project into the created folder
3. Inside `kolping`, there should now be a folder named `kolping-handbuch`
4. Navigate into `kolping-handbuch` and create a `.env` file

Note:
The outer folder `kolping` is required because the database initialization process will create a new folder named `postgres-data`.
This folder stores all PostgreSQL data, including user information, and must persist outside the project directory to
prevent data loss when rebuilding or updating the application.

## Create `.env` File

Create a `.env` file with the following variables:

```
POSTGRES_PASSWORD=[password]
POSTGRES_USER=[user]
POSTGRES_DB=[db]
NUXT_SESSION_PASSWORD=[password]
NUXT_POSTGRES_URL=postgres://[POSTGRES_USER]:[POSTGRES_PASSWORD]@handbuch-postgres:5432/[POSTGRES_DB]
```

`NUXT_SESSION_PASSWORD` must have at least 32 characters

## Configure ports in `compose.yaml`

```
postgres:
  ports:
    - "[port]:5432"
handbuch:
  ports:
    - "[port]:3000"
```

Note:
The port for handbuch must match the port configured for the subdomain.

## Build and Start Docker

```
sudo docker compose up --build
```

Note:

When starting for the first time, the database is empty.
The PostgreSQL initialization script will:

- Create the `users` table
- Create an `admin` account with the default password: `pw`

After the first login, CHANGE THE PASSWORD IMMEDIATELY.

## Connect to DB

```
docker exec -it [container-id] psql -U [postgres-user] -d [postgres-db]
```

## PostgreSQL Database Initialization Script

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
```
