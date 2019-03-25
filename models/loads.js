module.exports = function(sequelize, DataTypes) {
  var Loads= sequelize.define("Loads", {
    // Giving the Author model a name of type STRING
    "name": {
      type:DataTypes.STRING,
      allowNull:false
    },
    // "company": {
    //   type:DataTypes.STRING,
    //   allowNull:false
    // },
    // "loadNumber": {
    //   type:DataTypes.STRING,
    //   allowNull:false
    // },
    "pickUpTime":{
    type : DataTypes.DATE,
    allowNull:false
    },
    "dropOffTime":{
      type:DataTypes.DATE,
      allowNull:false
    } ,
    "weight": {
      type:DataTypes.STRING,
      allowNull:false,
    },
    //"rate": DataTypes.INTEGER,
    "rate":{
      type:DataTypes.STRING,
      allowNull:false
    },
    "driverStatus": {
      type:DataTypes.STRING,
      allowNull:false
    },

    "productDetails":{
      type:DataTypes.STRING,
      allowNull:false
    },

    //pick up address details 
    "pickUpAdress" : {
      type: DataTypes.STRING,
      allowNull:false
    },
    "pickUpCity":{
      type:DataTypes.STRING,
      allowNull:false
    },
    "pickUpZipCode":{
      type:DataTypes.STRING,
      allowNull:false
    },
    "pickUpState":
    {
      type:DataTypes.STRING,
      allowNull:false
    },


    //drop off address details
    "dropOffAddress":{
      type:DataTypes.STRING,
      allowNull:false
    },
    "dropOffCity":{
      type:DataTypes.STRING,
      allowNull:false
    },
    "dropOffZipCode":{
      type:DataTypes.STRING,
      allowNull:false
    },
    "dropOffState":{
      type:DataTypes.STRING,
      allowNull:false
    },
    //what is it?
    // "pickUpNumber":DataTypes.STRING,

    "phone":{
      type:DataTypes.STRING,
      allowNull:false
    },

    "status": {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false}
  });



     Loads.associate = function(models) {
     //Loads.belongsToMany(models.User, {through:'LoadsUser'});
     //Loads.belongsTo(models.User,{as:"broker"});
     //I didn't get why this relation is needed
     //Loads.belongsTo(models.Address,{as:'loadAdress', foreignKey:'AddressId'}  );

     Loads.belongsTo(models.Company,{as:"offererCompany",allowNull:false});
     Loads.belongsTo(models.User,{as:"broker",allowNull:false});

     Loads.belongsTo(models.Company,{as:"assignedCompany",allowNull:true});
     Loads.belongsTo(models.User,{as:"assignedUser",allowNull:true});
     // Loads.belongsToMany(models.Address, {through:'LoadsUser'});
     // Loads.belongsToMany(models.Address, {through:'LoadAdress'});

   };


  return Loads;
};
