module.exports = function(sequelize, DataTypes) {
    var Bid= sequelize.define("Bid", {
       "rate":
      {
          type:DataTypes.INTEGER,
          allowNull:false
      },
      "note":{
        type: DataTypes.STRING,
        allowNull:true,
      },
      "isAssigned":{
          type:DataTypes.BOOLEAN,
          default:false,
      }
  
  
    });
  
       Bid.associate = function(models) {
        Bid.belongsTo(models.Load, {as:"load", allowNull:false});
        // Bid.belongsTo(models.Company,{as:"bidderCompany",allowNull:false});
        Bid.belongsTo(models.User, {as:"bidder", allowNull:false});
        Bid.belongsTo(models.Driver, {as:"driver", allowNull:false});
     };
  
  
    return Bid;
  };
  