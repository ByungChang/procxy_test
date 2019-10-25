module.exports = function(sequelize, DataTypes) {
    return sequelize.define('boards', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      hit: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      boardPostId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
    }, {
      timestamps:true,
      tableName: 'boards'
    });
  };
  