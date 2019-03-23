module.exports = function(sequelize, DataTypes) {
  var Company= sequelize.define("Company", {
    // Giving the Author model a name of type STRING

    "name":DataTypes.STRING,
    //"Company": DataTypes.STRING,
    //Till now I didn't get any use case of contact_name
    //"contact_Name": DataTypes.STRING,
    "email": DataTypes.STRING,
    "phone": DataTypes.STRING,
    //what is payment here?
    //"payment": DataTypes.STRING,
    //"Notes": DataTypes.STRING
    "description":DataTypes.STRING

  });


     Company.associate = function(models) {
     Company.belongsToMany(models.User, {through: 'CompanyUser', foreignKey: 'CompanyId' })

   };


  return Company;
};
