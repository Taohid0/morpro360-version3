module.exports = function(sequelize, DataTypes) {
    var Role= sequelize.define("Role", {
       "name":
      {
          type:DataTypes.STRING,
          allowNull:false
      },
      "isDeleted":{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
      },
    });

    return Role;
  };
  