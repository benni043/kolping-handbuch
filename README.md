# KOLPING HANDBUCH

## environment variables

```
POSTGRES_PASSWORD=[password]
POSTGRES_USER=[user]
POSTGRES_DB=[db]
NUXT_SESSION_PASSWORD=[password]
NUXT_POSTGRES_URL=postgres://[db_user]:[password]@[localhost/postgres]:5432/postgres
```

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user','editor','admin'))
);

INSERT INTO users (username, password_hash, role) VALUES
('user', '$scrypt$n=16384,r=8,p=1$zG7Pe68fB3MZX4wup6Vq2Q$AwztDEp4/6vbqA7TdmpSNO9YRKo/6fc3uJUZuisFWJ/tISX+UKtCcDNsifaDTG5gC3Yp+QQXi/hZ9ec4CMhlDg', 'user'),
('editor', '$scrypt$n=16384,r=8,p=1$zG7Pe68fB3MZX4wup6Vq2Q$AwztDEp4/6vbqA7TdmpSNO9YRKo/6fc3uJUZuisFWJ/tISX+UKtCcDNsifaDTG5gC3Yp+QQXi/hZ9ec4CMhlDg', 'editor'),
('admin', '$scrypt$n=16384,r=8,p=1$zG7Pe68fB3MZX4wup6Vq2Q$AwztDEp4/6vbqA7TdmpSNO9YRKo/6fc3uJUZuisFWJ/tISX+UKtCcDNsifaDTG5gC3Yp+QQXi/hZ9ec4CMhlDg', 'admin');

SELECT * FROM users;

DROP TABLE users
```

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```
