'use strict';
const {
  Model, Op
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

    static async scheduleEvent({ event_title, event_description, event_date, event_start, event_end, user_id}) {
      return this.create({
        event_title,
        event_description,
        event_date,
        event_start,
        event_end,
        user_id
      });
    }

    static async getEvents({ user_id, event_date }) {
      return this.findAll({
        where: {
          user_id,
          event_date
        }
      });
    }

    static async getEventsLater({ user_id, event_date }) {
      return this.findAll({
        where: {
          [Op.and]: {
            user_id,
            event_date: {
              [Op.gt]: event_date
            }
          }
        }
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