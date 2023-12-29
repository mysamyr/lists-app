# Lister app - application for managing your lists.

## Setup

- Nodejs v.20+
- run `npm install` for root and both "api" and "client" projects
- create `.env` inside `/projects/api` according to `.env.example`
- create `env.json` inside `/projects/client` with `API_URL` field
- to launch api - `cd projects/api && npm start`
- to launch client - `cd projects/client && npm start`

API:
`docker build -f ./projects/api/Dockerfile -t lister-api:latest ./projects/api`
`docker run --name api -p 3001:3001 -d lister-api:latest`

WEB:
`docker build -f ./projects/client/Dockerfile -t lister-web:latest ./projects/client`
`docker run --name web -p 3000:3000 -d lister-web:latest`
