# Lister Application

## Setup

1. create `config/keys-dev.js` file with exported fields `NODE_ENV`, `PORT`, `MONGODB_URI` and `MONGODB_DB_NAME` (example in `config/keys-prod.js`).
   1. `NODE_ENV` = "production" or "development"
   2. `PORT` = port, on which app will run
   3. `MONGODB_URI` = url with connection to Mongo DB
   4. `MONGODB_DB_NAME` = database's name
2. run `npm install` to install all dependencies
3. run `npm run start` to start application

## General info

Application on **Node.js** with **Mongodb** that works with lists. Server renders HTML, send files and JSON.

Endpoints can be found in `ideas/endpoints.md`, database structure examples - in `ideas/db.js`.

## Lists

There are 3 types with lists: **Simple**, **Todo** and **Complex** lists. All list items can be created, deleted and renamed.

**Simple** lists contains only messages.

**Todo** lists have messages and possibility to mark them as completed.

**Complex** list items includes different fields (e.g. `name`, `count`, etc.). Field `name` is obligatory, if field `count` is present you can manage count of list items in list.

Messages have limitations to 50 characters. Count cannot be negative

## Tips

If you don't have access to file system on your deployment machine, don't set `NODE_ENV = production` manually.
This will not install your devDependencies and will fail webpack bundling process.
