'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Event, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }

    static addUser({ firstName, lastName, email, passwordHash }) {
      return this.create({
        firstName,
        lastName,
        email,
        passwordHash,
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email is already registered",
      },
    },
    passwordHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};