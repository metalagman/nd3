"use strict";
const UserRepository = require('./user_repository');
const User = require('./user');
const router = require('express').Router();

class RestApi {
    constructor() {
        this.repository = new UserRepository();
    }

    index(request, response) {
        console.log('api index');
        let data = this.repository.fetchAll();

        const offset = request.query.offset;
        if (offset && offset > 0) {
            data.splice(0, offset);
        }

        const limit = request.query.limit;
        if (limit > 0 && limit < data.length) {
            data = data.slice(0, limit);
        }

        const fields = request.query.fields;
        if (fields) {
            let keepFields = fields.split(',');
            data.map(item => {
                Object.keys(item).map(key => {
                    if (keepFields.indexOf(key) == -1) {
                        delete item[key];
                    }
                })
            })
        }
        response.json(data);
    }

    create(request, response) {
        console.log('api create');
        let model = new User(request.body.name, request.body.score);
        if (!model.validate()) {
            response.status(422).send('Validation error');
        } else {
            this.repository.insert(model);
            response.status(201).json(model);
        }
    }

    view(request, response) {
        console.log('api view');
        let model = this.repository.fetch(request.params.id);
        if (null == model) {
            response.status(404).send('Not found');
        } else {
            response.json(model);
        }
    }

    update(request, response) {
        console.log('api update');
        let model = this.repository.fetch(request.params.id);
        if (!model) {
            response.status(404).send('Not found');
            return;
        }

        model.name = request.body.name;
        model.score = request.body.score;

        if (!model.validate()) {
            response.status(422).send('Validation error');
        } else {
            this.repository.replace(request.params.id, model);
            response.json(model);
        }
    }

    remove(request, response) {
        console.log('api remove');
        if (this.repository.remove(request.params.id)) {
            response.status(204).send();
        } else {
            response.status(404).send('Not found');
        }
    }

    reset(request, response) {
        console.log('api remove');
        this.repository.reset();
        response.status(204).send();
    }
}

let api = new RestApi();

router.delete("/users/all", api.reset.bind(api));
router.get('/users', api.index.bind(api));
router.post("/users", api.create.bind(api));
router.get("/users/:id", api.view.bind(api));
router.put("/users/:id", api.update.bind(api));
router.delete("/users/:id", api.remove.bind(api));

module.exports = router;