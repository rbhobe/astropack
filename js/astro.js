
AstroApp.Models.Item = Backbone.Model.extend({

    defaults: {
        name: 'Item Name', 
        packed: false
    },

    togglePacked: function() {
        this.set({ packed: !this.get('packed') });
    }

});


AstroApp.Collections.Items = Backbone.Collection.extend({

    model: AstroApp.Models.Item,

});


AstroApp.Models.ItemGroup = Backbone.Model.extend({

    defaults: {
        displayName: '',
        selectorName: '',
        toPackItems: new AstroApp.Collections.Items(), // all items are added to the "to pack" list
        packedItems: new AstroApp.Collections.Items(), // nothing is packed initially
    },

    initialize: function() {
        new AstroApp.Views.ItemGroupView({ model: this });
    },

});


AstroApp.Collections.ItemGroups = Backbone.Collection.extend({

    model: AstroApp.Models.ItemGroup,
    url: 'js/ski-trip.json',

    initialize: function() {
        this.on('reset', this.loaded, this);

        this.fetch();
    },

    parse: function(response) {

        var itemGroups = [];

        _.each(response, function(itemGroup) {

            var displayName =  itemGroup.displayName;
            var selectorName = StrUtils.toSafeSelectorStr(itemGroup.displayName);
            var toPackItems = new AstroApp.Collections.Items(itemGroup.items);
            var packedItems = new AstroApp.Collections.Items([]);

            itemGroups.push({ displayName: displayName, selectorName: selectorName, toPackItems: toPackItems, packedItems: packedItems });
        });

        return itemGroups;

    },

    loaded: function() {
        console.log('collection successfully loaded');
        
        // loop through and make a itemgroup view for each item group

    }

});

var packingList = new AstroApp.Collections.ItemGroups();

