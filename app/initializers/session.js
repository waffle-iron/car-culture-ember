import Ember from "ember";

var session = Ember.Object.extend({  
  ref: new Firebase("https://car-culture-sever.firebaseio.com"),

  addFirebaseCallback: function() {
    var session = this;

    this.get("ref").onAuth(function(authData) {
      if (authData) {
        session.set("isAuthenticated", true);
      } else {
        session.set("isAuthenticated", false);
      }
    });
  }.on("init"),

  login: function() {
    return new Promise((resolve, reject) => {
      this.get("ref").authWithOAuthPopup("google", function(error, user) {
        if (user) {
          resolve(user);
        } else {
          reject(error);
        }
      });
    });
  },

  logOut: function() {
    var context = this;
    return new Promise(function(resolve) {
      context.get("ref").unauth();
      resolve();
    });
  },

  currentUser: function() {
    return this.get("ref").getAuth();
  }.property("isAuthenticated")
});

export default {  
  name: "Session",

  initialize: function(container, app) {
    app.register("session:main", session);
    app.inject("controller", "session", "session:main");
    app.inject("route", "session", "session:main");
  }
};