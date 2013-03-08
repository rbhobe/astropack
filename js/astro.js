
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

    url: 'js/ski-trip.json',

    defaults: {
        displayName: '',
        selectorName: '',
        toPackItems: new AstroApp.Collections.Items(), // all items are added to the "to pack" list
        packedItems: new AstroApp.Collections.Items(), // nothing is packed initially
    },

    initialize: function(attributes, options) {
        // console.log(attributes);
        // console.log(options);

        // this.toPackItems = new AstroApp.Collections.Items();
        // this.packedItems = new AstroApp.Collections.Items();



        // console.log(this.toPackItems);
        this.fetch({
            success: function () {
                var itemGroupView = new AstroApp.Views.ItemGroupView({ model: itemGroup });
                //itemGroupView.listenTo(itemGroupView.model.get('toPackItems'), 'remove', itemGroupView.render());
            },
            error: function() {
                alert('error fetching model');
            }
        });
    },

    parse: function(response) {
        var displayName = response[0].displayName;
        var selectorName = StrUtils.toSafeSelectorStr(response[0].displayName);
        var toPackItems = new AstroApp.Collections.Items(response[0].items);
        var packedItems = new AstroApp.Collections.Items([]);

        // return hash of attributes to populate for model
        return { displayName: displayName, selectorName: selectorName, toPackItems: toPackItems, packedItems: packedItems };
    },

});

// var asdf = new AstroApp.Models.ItemGroup({ displayName:'Asdf', selectorName: 'asdf' }, { opt1:'hello', opt2:'world' }, {});
// console.log(asdf);


// AstroApp.Collections.ItemGroups = Backbone.Collection.extend({

//     model: AstroApp.Models.ItemGroup,

//     url: 'js/ski-trip.json',

//     initialize: function(models, options) {
//         // storing meta info for the collection, like name
//         // this._meta = {};
//     },

//     parse: function(response) {

//         // this.set(displayName, 'displayName');
//         // this.set(selectorName, 'selectorName');

//         var itemGroup = new AstroApp.Models.ItemGroup({ displayName: response[0].displayName, selectorName: StrUtils.toSafeSelectorStr(response[0].displayName) }, { items: response[0].items });
//         // console.log(itemGroup);
//         // return [{ displayName: response[0].displayName, selectorName: StrUtils.toSafeSelectorStr(response[0].displayName), items: response[0].items }]; // return the array of models
//     },

//     // set: function(val, prop) {
//     //     //this._meta[prop] = val;
//     // },

//     // get: function(prop) {
//     //     //return this._meta[prop];
//     // }

// });

var itemGroup = new AstroApp.Models.ItemGroup();

// console.log(itemGroup);

//var myPackingListView = new AstroApp.Views.ItemGroupsView({ collection: itemGroups });


