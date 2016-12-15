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

class TaskApi {
    index(req, res) {
        console.log('api index');
        Task.find({}, function(err, data) {
            if (err) {
                res.status(500).send('Api error: ' + err.toString());
            } else {
                res.json(data);
            }
        });
    };

    create(req, res) {
        console.log('api post');
        let model = new Task(req.body);
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
        Task.findById(req.params.id, function(err, model) {
            if (err) {
                res.status(500).send('Api error: ' + err.toString());
            } else {
                model.name = req.body.name;
                model.description = req.body.description;
                model.is_open = req.body.is_open;
                model.user_id = req.body.user_id;
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
        Task.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(500).send('Api error: ' + err.toString());
            } else {
                res.status(204).send();
            }
        });

    }
}

const openTask =  (req, res) => {
    Task.findById(req.params.task_id, function(err, model) {
        if (err) {
            res.status(500).send('Api error: ' + err.toString());
        } else {
            model.is_open = true;
            model.save(function(err) {
                if (err) {
                    res.status(500).send('Api error: ' + err.toString());
                } else {
                    res.json(model);
                }
            });
        }
    });
};

const closeTask =  (req, res) => {
    Task.findById(req.params.task_id, function(err, model) {
        if (err) {
            res.status(500).send('Api error: ' + err.toString());
        } else {
            model.is_open = false;
            model.save(function(err) {
                if (err) {
                    res.status(500).send('Api error: ' + err.toString());
                } else {
                    res.json(model);
                }
            });
        }
    });
};

const assignTask =  (req, res) => {
    Task.findById(req.params.task_id, function(err, model) {
        if (err) {
            res.status(500).send('Api error: ' + err.toString());
        } else {
            model.user_id = req.params.user_id;
            model.save(function(err) {
                if (err) {
                    res.status(500).send('Api error: ' + err.toString());
                } else {
                    res.json(model);
                }
            });
        }
    });
};

const findTask = (req, res) => {
    let conditions = [];
    console.log(req.body);
    if (req.body.name) {
        conditions.push({name: {$regex: req.body.name}});
    }
    if (req.body.description) {
        conditions.push({name: {$regex: req.body.description}});
    }
    if (req.body.last_name) {
        conditions.push({last_name: {$regex: req.body.last_name}});
    }
    let search = {};
    if (conditions.length > 0) {
        search = {$or: conditions};
    }

    User.find(search, function(err, data) {
        if (err) {
            res.status(500).send('Api error: ' + err.toString());
        } else {
            res.json(data);
        }
    });
};

module.exports = (config) => {
    mongoose.connect(config.mongo.db);

    let userApi = new UserApi();
    let taskApi = new TaskApi();

    router.get('/users', userApi.index.bind(userApi));
    router.post('/users', userApi.create.bind(userApi));
    router.put('/users/:id', userApi.update.bind(userApi));
    router.delete('/users/:id', userApi.remove.bind(userApi));

    router.get('/tasks', userApi.index.bind(userApi));
    router.post('/tasks', userApi.create.bind(userApi));
    router.put('/tasks/:id', userApi.update.bind(userApi));
    router.delete('/tasks/:id', userApi.remove.bind(userApi));

    router.post('/tasks/:task_id/open', openTask);
    router.post('/tasks/:task_id/close', closeTask);
    router.post('/tasks/:task_id/assign/:user_id', assignTask);
    router.post('/tasks/search', findTask);

    return router;
};

