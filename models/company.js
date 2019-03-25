module.exports = function(sequelize, DataTypes) {
  var Company= sequelize.define("Company", {
    // Giving the Author model a name of type STRING

    "name":{
      type: DataTypes.STRING,
      allowNull:false,
      unique: true
    },
    //"Company": DataTypes.STRING,
    //Till now I didn't get any use case of contact_name
    //"contact_Name": DataTypes.STRING,
    "email": {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    "phone": {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true

    },
    //what is payment here?
    //"payment": DataTypes.STRING,
    //"Notes": DataTypes.STRING
    "description":{
      type:DataTypes.STRING,
      allowNull:false,
    }

  });

     Company.associate = function(models) {
    //  Company.belongsToMany(models.User, {through: 'CompanyUser', foreignKey: 'CompanyId' })

   };


  return Company;
};
