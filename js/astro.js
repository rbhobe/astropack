
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

});


AstroApp.Collections.ItemGroups = Backbone.Collection.extend({

    model: AstroApp.Models.ItemGroup,
    url: 'js/ski-trip.json',

    initialize: function() {
        this.on('reset', this.loaded, this);
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
        
        _.each(this.models, function(model) {
            model.get('toPackItems').on('remove', this.isPackingDone, this); // every time an item is packed, check if we're done
            new AstroApp.Views.ItemGroupView({ model: model });
        }, this);

    },

    isPackingDone: function() {
        var lengths = [];
        _.each(this.models, function(model) {
            lengths.push(model.get('toPackItems').length);
        }, this);

        var done = _.every(lengths, function(len) { return len === 0 });
        if (done) {
            console.log('PACKING FINISHED');
            packingListItems.trigger('packing-finished');
        }
    }

});

var packingListItems = new AstroApp.Collections.ItemGroups();
var astroAppView = new AstroApp.Views.AppView({ collection: packingListItems });

