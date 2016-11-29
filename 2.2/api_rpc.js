const UserRepository = require('./user_repository');
const User = require('./user');
const router = require('express').Router();

class Error {
    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

class ErrorResponse {
    constructor(id, error) {
        this.jsonrpc = '2.0';
        this.error = error;
        this.id = id;
    }
}

class SuccessResponse {
    constructor(id, result) {
        this.jsonrpc = '2.0';
        this.result = result;
        this.id = id;
    }
}

class RPC {
    constructor() {
        this.repository = new UserRepository();
    }

    index(args, result) {
        console.log('rpc index');
        console.log(this);
        result(null, this.repository.fetchAll());
    }

    create(args, result) {
        console.log('rpc create');
        let model = new User(args.name, args.score);
        if (!model.validate()) {
            result(new Error(422, 'Validation error'));
        } else {
            this.repository.insert(model);
            result(null, model);
        }
    }

    view(args, result) {
        console.log('rpc view');
        let model = this.repository.fetch(args.id);
        if (null == model) {
            result(new Error(404, 'Not found'));
        } else {
            result(null, model);
        }
    }

    update(args, result) {
        console.log('rpc update');
        let model = this.repository.fetch(args.id);
        if (!model) {
            result(new Error(404, 'Not found'));
        }

        model.name = args.name;
        model.score = args.score;

        if (!model.validate()) {
            result(new Error(422, 'Validation error'));
        } else {
            this.repository.replace(args.id, model);
            result(null, model);
        }
    }

    remove(args, result) {
        console.log('rpc remove');
        if (this.repository.remove(args.id)) {
            result(null, true);
        } else {
            result(new Error(404, 'Not found'));
        }
    }

}

const rpc = new RPC();

router.post('/', (request, response) => {
    const id = request.body.id;
    const version = request.body.jsonrpc;
    if (version != '2.0') {
        response.json(new ErrorResponse(id, new Error(400, 'Unsupported JSON-RPC version')));
    }

    const method = rpc[request.body.method];

    if (!method) {
        response.json(new ErrorResponse(id, new Error(404, 'Method not found')));
        return;
    }

    method.bind(rpc)(request.body.params, (error, result) => {
        if (error) {
            response.json(new ErrorResponse(id, error));
        } else {
            response.json(new SuccessResponse(id, result));
        }
    });

});

module.exports = router;