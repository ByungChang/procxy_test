/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('board_posts', {
      id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    }, {
      tableName: 'board_posts'
    });
  };
  