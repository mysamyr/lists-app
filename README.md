# List Application

## Setup

1. create `config/keys-dev.js` file with exported fields `PORT`, `MONGODB_URI` and `MONGODB_DB_NAME` (example in `config/keys-prod.js`).
2. run `npm install`

## General info

Application on **Node.js** with **Mongodb** that works with lists. Server renders HTML, send files and JSON.

Endpoints can be found in `ideas/endpoints.md`, database structure in `ideas/db.js`.

## Lists

There are 3 types with lists: **Simple**, **Todo** and **Complex** lists. All list items can be created, deleted and renamed.

**Simple** lists contains only messages.

**Todo** lists have messages and possibility to be marked as done.

**Complex** list items includes different fields (e.g. `name`, `count`, etc.). Field `name` is obligatory, if field `count` is present you can manage count of list items in list.

Messages have limitations to 50 characters, list names - to 30. Count cannot be negative
