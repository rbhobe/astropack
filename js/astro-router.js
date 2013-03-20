AstroApp.Router = Backbone.Router.extend({

  routes: {
    "home.html":  "home",
    "home":  "home",
    ":trip":      "packForTrip"
  },

  home: function() {
    location.href = 'home.html';
    console.log('home');
  },

  packForTrip: function(tripName) {
    var packingListItems = new AstroApp.Collections.ItemGroups([], { 'tripName': tripName });
    var astroAppView = new AstroApp.Views.AppView({ collection: packingListItems });
    console.log(tripName);
  }

});

var appRouter = new AstroApp.Router();
Backbone.history.start();