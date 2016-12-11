"use strict";
const router = require('express').Router();
const mongodb = require('mongodb');
const client = mongodb.MongoClient;

class RestApi {
    constructor(config) {
        this.config = config;
    }

    _collection() {
        return client.connect(this.config.mongo.db).then((db) => {
            return db.collection('contacts');
        });
    }

    index(req, res) {
        console.log('api index');
        this._collection().then(collection => {
            return collection.find().toArray();
        }).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send('Api error');
        });
    }

    search(req, res) {
        console.log('api search');
        this._collection().then(collection => {
            let conditions = [];
            console.log(req.body);
            if (req.body.phone) {
                conditions.push({phone: {$regex: `/${req.body.phone}/`}});
            }
            if (req.body.first_name) {
                conditions.push({first_name: {$regex: `/${req.body.first_name}/`}});
            }
            if (req.body.last_name) {
                conditions.push({last_name: {$regex: `/${req.body.last_name}/`}});
            }
            let search = {}
            if (conditions.length > 0) {
                search = {$or: conditions}
            }
            console.log(JSON.stringify(search));
            return collection.find(search).toArray();
        }).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send('Api error');
        });
    }

    create(req, res) {
        console.log('api put');
        this._collection().then(collection => {
            collection.insert(req.body, (err, result) => {
                if (err) {
                    throw new Error(err);
                } else {
                    res.status(201).send(result.insertedIds);
                }
            })
        }).catch(err => {
            res.status(500).send('Api error');
        });
    }

    update(req, res) {
        console.log('api update');
        this._collection().then(collection => {
            let data = req.body;
            unset(data['_id']);
            collection.updateOne({_id: mongodb.ObjectId(req.params.id)}, {$set: data}, (err, result) => {
                if (err) {
                    throw new Error(err);
                } else {
                    console.log(result);
                    res.status(200).send();
                }
            })
        }).catch(err => {
            res.status(500).send('Api error');
        });
    }

    remove(req, res) {
        console.log('api remove');
        this._collection().then(collection => {
            collection.removeOne({_id: mongodb.ObjectId(req.params.id)}, (err, result) => {
                if (err) {
                    throw new Error(err);
                } else {
                    console.log(result);
                    res.status(204).send();
                }
            })
        }).catch(err => {
            res.status(500).send('Api error');
        });
    }
}

module.exports = (config) => {
    let api = new RestApi(config);
    router.get('/contacts', api.index.bind(api));
    router.post('/contacts/search', api.search.bind(api));
    router.post('/contacts', api.create.bind(api));
    router.put("/contacts/:id", api.update.bind(api));
    router.delete("/contacts/:id", api.remove.bind(api));
    return router;
};

