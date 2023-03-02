"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Events", "contact_name", {
      type: Sequelize.DataTypes.STRING,
    });
    await queryInterface.addColumn("Events", "contact_phone", {
      type: Sequelize.DataTypes.INTEGER,
    });
    await queryInterface.addColumn("Events", "contact_email", {
      type: Sequelize.DataTypes.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Events", "contact_name");
    await queryInterface.removeColumn("Events", "contact_phone");
    await queryInterface.removeColumn("Events", "contact_email");
  },
};
