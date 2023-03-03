'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.User, {
        foreignKey: "user_id"
      });
    }
  }
  Event.init({
    event_title: DataTypes.STRING,
    event_description: DataTypes.STRING,
    event_date: DataTypes.DATEONLY,
    event_start: DataTypes.TIME,
    event_end: DataTypes.TIME,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};