// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require("bcrypt-nodejs");
// Creating our Admin model
module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define("Admin", {
    "firstName":{
      type: DataTypes.STRING,
      allowNull:false,
    },
    "lastName":{
      type: DataTypes.STRING,
      allowNull:true,
    },
    "phone": {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    //MC#:
    //DOT#
    // The email cannot be null, and must be a proper email before creation
    "email": {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    "password": {
      type: DataTypes.STRING,
      allowNull: false
    },
    "isDeleted":{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
    },
    
  });

    Admin.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
        Admin.belongsTo(models.Role, {through:'role'});
        // Admin.belongsToMany(models.Loads, {through:'LoadsAdmin'});
        // Admin.hasMany(models.Ratings, {as:'AdminRatings'});
        // Admin.hasMany(models.Expenses, {as:'AdminExpenses'});
        // Admin.belongsToMany(models.Company, {through: 'CompanyAdmin', foreignKey: 'AdminId' });
    };
  // Creating a custom method for our Admin model. This will check if an unhashed password entered by the Admin can be compared to the hashed password stored in our database
    Admin.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };
  // Hooks are automatic methods that run during various phases of the Admin Model lifecycle
  // In this case, before a Admin is created, we will automatically hash their password
  Admin.addHook("beforeCreate", function(Admin) {
    Admin.password = bcrypt.hashSync(Admin.password, bcrypt.genSaltSync(10), null);
    console.log("Hooked before create");
  });

  Admin.addHook("beforeUpdate", function(Admin) {
    console.log("Hooked after update");
    if(!!Admin.password) {
      Admin.password = bcrypt.hashSync(Admin.password, bcrypt.genSaltSync(10), null);
      console.log(Admin);
    }
  });
  return Admin;
};