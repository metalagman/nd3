const UserRepository = require('./user_repository');
const User = require('./user');
const router = require('express').Router();

class RestApi {
    constructor() {
        this.repository = new UserRepository();
    }

    index(request, response) {
        console.log('api index');
        response.json(this.repository.fetchAll());
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
}

let api = new RestApi();

router.get('/users', (request, response) => api.index(request, response));
router.post("/users", (request, response) => api.create(request, response));
router.get("/users/:id", (request, response) => api.view(request, response));
router.put("/users/:id", (request, response) => api.update(request, response));
router.delete("/users/:id", (request, response) => api.remove(request, response));

module.exports = router;