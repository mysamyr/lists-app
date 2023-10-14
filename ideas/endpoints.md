### Renderers

`GET /` - render home page <br/>
`GET /create-list-page` - render create list page <br/>
`GET /list-page/:id` - render specific list <br/>
`GET /print-list/:id` - render list's compact view <br/>

### List

`GET /list` - get list of lists <br/>
`POST /list` - create new list <br/>
`PUT /list/:id` - rename list <br/>
`DELETE /list/:id` - delete list <br/>

### List item

`GET /list/:id` - get list details <br/>
`POST /list/:id` - create new list item <br/>
`PUT /list/:listId/item/:id` - update list item <br/>
`DELETE /list/:listId/item/:id` - delete list item <br/>

### Other

\*`GET /audits/:id` - get audits for list (JSON) <br/>
`GET /:file` - get file (CSS, JS, favicon) <br/>
