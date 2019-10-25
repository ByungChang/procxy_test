/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('board_comments', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
    }, {
      timestamps:true,
      tableName: 'board_comments'
    });
  };
  