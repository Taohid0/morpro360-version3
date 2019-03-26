module.exports = function(sequelize, DataTypes) {
    var Driver= sequelize.define("Driver", {
  
      "name":{
        type: DataTypes.STRING,
        allowNull:false,
      },
  
      "phone": {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
  
      },

      "state":{
        type:DataTypes.STRING,
        allowNull:false,
      },

      "city":{
        type:DataTypes.STRING,
        allowNull:false,
      },

      "address":{
        type:DataTypes.STRING,
        allowNull:false,
      },

      "license": {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
  
    });
  
       Driver.associate = function(models) {
        Driver.belongsTo(models.Company,{as:"company",allowNull:true});
        Driver.belongsTo(models.User, {as:"accountCreator", allowNull:false});
     };
  
  
    return Driver;
  };
  