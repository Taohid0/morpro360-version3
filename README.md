### clone the repo
$ git clone https://github.com/Taohid0/morpro360-version3

### Database
Create a mysql database and add the credentials to config/config.json

### install app's dependencies
$ npm install

### migrate the tables
$ npx sequelize db:migrate (run "npm install --save sequelize-cli" if sequelize-cli not installed previously)

### run dev server 
$ node server.js (or using nodemon "nodemon server.js")


