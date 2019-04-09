export default class User {
  KEY = "@morpro:user";
  async clearData() {
    window.localStorage.clear();
  }

  async getUser() {
    try {
      const userDataString = window.localStorage.getItem(this.KEY);
      if (!userDataString) {
        return false;
      }
      const user = JSON.parse(userDataString);
      return user;
    } catch (error) {
      return false;
    }
  }

  async adminRole() {
    const user = await this.getUser();
    if (user.Role) {
      return user.Role.name;
    }
    return false;
  }
  async storeUser(user) {
    try {
      console.log(user);
      console.log(this.KEY);
      const userData = JSON.stringify(user);
      window.localStorage.setItem(this.KEY, userData);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
