"use strict";

const client = require('mongodb').MongoClient;
const config = require("./config.json");

client.connect(config.mongo.db, (err, db) => {
    if (err) {
        console.log(err);
    } else {
        let collection = db.collection('contacts');

        let data = [
            {
                full_name: "Ivan Ivanov",
                phone: "+79991234567",
                skype: "ivan1"
            },
            {
                full_name: "Petr Petrov",
                phone: "+79991234567",
            },
            {
                full_name: "Sidor Sidorov",
                skype: "sidor2"
            }
        ];

        collection.insertMany(data, (err) => {
            if (err) {
                console.log(err);
            } else {
                collection.find().toArray((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`В базе ${result.length} записей`);
                    }
                });

                collection.find({skype: null}).toArray((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Записей без поля skype ${result.length}`);
                        console.log(result);
                    }
                });

                console.log('Удаляем всех петров');
                collection.deleteMany({full_name: "Petr Petrov"}).then(result => {
                    console.log(`Удалено: ${result.deletedCount}`);
                });

                console.log('Меняем скайп всем сидорам');
                collection.updateMany({full_name: "Sidor Sidorov"}, {$set: {skype: 'testskype'}}).then(result => {
                    console.log(`Изменено: ${result.modifiedCount}`);
                });
            }
        })
    }
});

