"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }

    static async scheduleEvent({
      event_title,
      event_description,
      event_date,
      event_start,
      event_end,
      user_id,
    }) {
      return this.create({
        event_title,
        event_description,
        event_date,
        event_start,
        event_end,
        user_id,
      });
    }

    static async getEvents({ user_id, event_date }) {
      return this.findAll({
        where: {
          user_id,
          event_date,
        },
      });
    }

    static async getEventsLater({ user_id, event_date }) {
      return this.findAll({
        where: {
          [Op.and]: {
            user_id,
            event_date: {
              [Op.gt]: event_date,
            },
          },
        },
      });
    }

    static async deleteEvent({ user_id, id }) {
      return await this.destroy({
        where: {
          user_id,
          id,
        },
      });
    }

    static async updateTitle({ event_title, user_id, id }) {
      return this.update({ event_title }, {
        where: {
          user_id,
          id
        }
      });
    }

    static async updateDescription({ event_description, user_id, id }) {
      return this.update({ event_description }, {
        where: {
          user_id,
          id
        }
      });
    }

    static async findOverlap({event_start, event_end, user_id}) {
      return await this.findAll({
        where: {
          user_id,
          [Op.or]: {
            [Op.and]: {
              event_start: {
                [Op.gt]: event_start
              },
              event_end: {
                [Op.lt]: {
                  event_end
                }
              }
            },
            [Op.and]: {
              event_start: {
                [Op.lt]: event_start
              },
              event_start: {
                [Op.lt]: this.event_end
              }
            },
            [Op.and]: {
              event_start: {
                [Op.gt]: event_start
              },
              event_end: {
                [Op.lt]: event_end
              }
            }
          }
        }
      });
    }
  }
  Event.init(
    {
      event_title: DataTypes.STRING,
      event_description: DataTypes.STRING,
      event_date: DataTypes.DATEONLY,
      event_start: DataTypes.TIME,
      event_end: DataTypes.TIME,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
