TODO

Реструктуризувати базу, щоб зберігати колекцію list, яка буде містити списки з ід - name, списком полів і їх конфігурацій і самих даних.
```
{
    _id: ObjectID,
    name: "Jars",
    fields: [
        {
            field: "name",
            type: "string",
            min: 3,
            max: 30,
        },
        {
            field: "capacity",
            type: "number",
            min: 0.2,
            max: 3,
        },
        {
            field: "count",
            type: "number",
            min: 0,
            max: 999,
        },
    ],
    data: [
        {
            "name": "Голубці",
            "capacity": 1,
            "count": 0
        }
    ],
    created: ""
}
```
Змінити роутер, щоб він сприймав різні списки по імені або ід

GET / - render index.html
GET /lists - get lists (names)