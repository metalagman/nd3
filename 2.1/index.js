"use strict";

const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 3000;

let db = [];

let server = http.createServer().listen(PORT);

class Api {
    static _parseQuery(request) {
        return url.parse(request.url, true).query;
    }

    static _parsePath(request) {
        return url.parse(request.url).pathname;
    }

    static register(request, response) {
        let query = this._parseQuery(request);
        let row = {
            id: null,
            name: query.name,
            amount: parseInt(query.amount),
        };
        row.id = db.push(row) - 1;
        response.end(JSON.stringify({
            id: row.id,
            name: row.name,
            amount: row.amount
        }));
    }

    static add(request, response) {
        let query = this._parseQuery(request);
        let row = db[query.id];
        if (!row) {
            response.statusCode = 404;
            response.end();
            return;
        }
        row.amount += parseInt(query.amount);
        response.end(JSON.stringify({
                id: query.id,
                name: row.name,
                amount: row.amount
            }
        ));
    }

    static remove(request, response) {
        let query = this._parseQuery(request);
        let row = db[query.id];
        if (!row) {
            response.statusCode = 404;
            response.end();
            return;
        }
        row.amount -= parseInt(query.amount);
        response.end(JSON.stringify({
                id: query.id,
                name: row.name,
                amount: row.amount
            }
        ));
    }

    static list(request, response) {
        response.end(JSON.stringify(db));
    }
}

server.on('request', (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    switch (Api._parsePath(request)) {
        case '/':
            Api.list(request, response);
            break;
        case '/register':
            Api.register(request, response);
            break;
        case '/add':
            Api.add(request, response);
            break;
        case '/remove':
            Api.remove(request, response);
            break;
        default:
            response.statusCode = 400;
            response.end();
    }
});
