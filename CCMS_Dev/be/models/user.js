/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('users', {
      id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      orgId: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      userNm: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      userPw: {
        type: DataTypes.BLOB,
        allowNull: false
      },
      userYn: {
        type: DataTypes.STRING(1),
      },
      userGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
    }, {
      tableName: 'users'
    });
  };
  