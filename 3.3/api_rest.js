"use strict";
const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

class UserApi {
    index(req, res) {
        console.log('api index');
        User.find({}, function(err, data) {
            if (err) {
                res.status(500).send('Api error: ' + err.toString());
            } else {
                res.json(data);
            }
        });
    };

    create(req, res) {
        console.log('api post');
        let model = new User(req.body);
        model.save(function(err) {
            if (err) {
                res.status(500).send('Api error: ' + err.toString());
            } else {
                res.status(201).json(model);
            }
        });
    }

    update(req, res) {
        console.log('api update');
        User.findById(req.params.id, function(err, model) {
            if (err) {
                res.status(500).send('Api error: ' + err.toString());
            } else {
                model.name = req.body.name;
                model.save(function(err) {
                    if (err) {
                        res.status(500).send('Api error: ' + err.toString());
                    } else {
                        res.json(model);
                    }
                });
            }

        });

    }

    remove(req, res) {
        console.log('api remove');
        User.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(500).send('Api error: ' + err.toString());
            } else {
                res.status(204).send();
            }
        });

    }
}

module.exports = (config) => {
    mongoose.connect(config.mongo.db);
    let userApi = new UserApi();
    router.get('/users', userApi.index.bind(userApi));
    router.post('/users', userApi.create.bind(userApi));
    router.put('/users/:id', userApi.update.bind(userApi));
    router.delete('/users/:id', userApi.remove.bind(userApi));
    return router;
};

