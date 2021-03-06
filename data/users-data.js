const BaseData = require('./base/base-data');
const User = require('../models/user');
const CryptoJS = require('crypto-js');

class Users extends BaseData {
    constructor(db) {
        super(db, User);
    }

    findByUserName(username) {
        return this.collection.findOne({
            'user_name': username,
        });
    }

    findUserByCredentials(username, password) {
        // eslint-disable-next-line new-cap
        const passwordHash = CryptoJS.SHA256(password).toString();
        return this.findByUserName(username)
            .then((user) => {
                if (!!user && user.user_password !== passwordHash) {
                    return null;
                }
                return user;
            });
    }

    create(model) {
        if (!this._isModelValid(model, 'create')) {
            return Promise.reject('Invalid input data');
        }

        const dbModel = this.ModelClass.getDataBaseModel(model, 'create');

        return this.findByUserName(model.user_name)
            .then((user) => {
                if (user) {
                    return Promise.reject('User already exist');
                }
                return this.collection.insert(dbModel);
            })
            .catch(() => {
                return Promise.reject('Invalid input data');
            });
    }

    update(model) {
        if (!this._isModelValid(model, 'update')) {
            return Promise.reject('Invalid input data');
        }

        const dbModel = this.ModelClass.getDataBaseModel(model, 'update');

        return this.findByUserName(model.user_name)
            .then((user) => {
                if (!user) {
                    return Promise.reject('User do not exist');
                }

                return this.collection.update({
                    _id: user._id,
                }, {
                        $set: dbModel,
                    });
            })
            .catch(() => {
                return Promise.reject('Invalid input data');
            });
    }

    updatePassword(model) {
        if (!this._isPasswordValid(model)) {
            return Promise.reject('Invalid input data');
        }

        const dbModel = this.ModelClass
            .getDataBaseModel(model, 'updatePassword');

        return this.findByUserName(model.user_name)
            .then((user) => {
                if (!user) {
                    return Promise.reject('User do not exist');
                }

                // eslint-disable-next-line new-cap, max-len
                const passwordHash = CryptoJS.SHA256(model.old_password).toString();

                if (passwordHash !== user.user_password) {
                    return Promise.reject('Incorrect old password');
                }

                return this.collection.update({
                    _id: user._id,
                }, {
                        $set: dbModel,
                    });
            });
    }

    _isModelValid(model, type) {
        return User.validate(model, type);
    }

    _isPasswordValid(model) {
        return User.validatePassword(model);
    }
}

module.exports = Users;
