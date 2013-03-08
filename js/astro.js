
AstroApp.Models.Item = Backbone.Model.extend({

    defaults: {
        name: 'Item Name', 
        packed: false
    },

    initialize: function() {},

    togglePacked: function() {
        this.set({ packed: !this.get('packed') });
    }

});


AstroApp.Collections.ItemGroup = Backbone.Collection.extend({

    model: AstroApp.Models.Item,

    url: 'js/ski-trip.json',

    initialize: function(models, options) {
        // storing meta info for the collection, like name
        this._meta = {};
    },

    parse: function(response) {
        var displayName = response[0].displayName;
        var selectorName = StrUtils.toSafeSelectorStr(response[0].displayName);

        this.set(displayName, 'displayName');
        this.set(selectorName, 'selectorName');

        return response[0].items; // return the array of models
    },

    set: function(val, prop) {
        this._meta[prop] = val;
    },

    get: function(prop) {
        return this._meta[prop];
    }

});

var itemList = new AstroApp.Collections.ItemGroup();
var itemListView = new AstroApp.Views.ItemGroupView({ collection: itemList });


