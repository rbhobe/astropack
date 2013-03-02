var AstroApp = {
    Models: {},
    Collections: {},
    Views: {}, 
    Templates: {}
};

AstroApp.Models.ItemGroup = Backbone.Model.extend({
    initialize: function() {
        console.log('making an item section model');
    }
});

var itemGroup = new AstroApp.Models.ItemGroup();
