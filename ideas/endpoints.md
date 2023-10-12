`GET /` - render home page <br/>
`GET /list` - render create list page <br/>
`GET /list/:id` - render specific list <br/>
`GET /list/:id/print` - render list's compact view <br/>

`POST /list` - create new list <br/>
`PUT /list/:listId` - rename list <br/>
`DELETE /list/:listId` - delete list <br/>

`POST /list/:id` - create new list item <br/>
`GET /list/:listId/item/:id` - get list item's details <br/>
`GET /list/:id/fields` - get field list for list item's creation <br/>
`PUT /list/:listId/item/:id` - update list item <br/>
`DELETE /list/:listId/item/:id` - delete list item <br/>
`GET /audits/:id` - get audits for list (JSON) <br/>

`GET /:file` - get file (CSS, JS, favicon) <br/>
