var AstroApp = {
    Models: {},
    Collections: {},
    Views: {}, 
    Templates: {}
};


AstroApp.Models.Item = Backbone.Model.extend({

    defaults: {
        name: 'Item Name', 
        packed: false
    },

    initialize: function() {
        
    },

    togglePacked: function() {
        this.set({ packed: !this.get('packed') });
    }

});

AstroApp.Views.ItemView = Backbone.View.extend({

    tagName: 'tr',
    className: 'item-row',
    type: 'ItemView', // for debugging

    template: _.template($('#item-template').html()),

    events: {
        "click .pack-action" : "packItem"
    },

    initialize: function() {
        this.model.on('change', this.modelChanged, this);
    },

    render: function () {
        var itemHtml = this.template(this.model.toJSON());
        this.$el.html(itemHtml);
        return this;
    },

    modelChanged: function(model) {
        // re-render the model's view when the model changes
        this.render();
    },

    packItem: function() {
        this.model.togglePacked(); // mark item as packed
        console.log(this.model.get('name')+"'s state is now: packed="+this.model.get('packed'));
        // todo: move the item out of the "to pack" collection into the "packed" collection
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
        //console.log(response[0]);
        this.set(response[0].name, 'name');
        return response[0].items;
    },

    set: function(val, prop) {
        this._meta[prop] = val;
    },

    get: function(prop) {
        return this._meta[prop];
    }

});

AstroApp.Views.ItemGroupView = Backbone.View.extend({
    
    groupListId: '',

    main: '#main',

    type: 'ItemGroupView', // for debugging

    template: _.template($('#item-group-template').html()),

    // collection: passed in during init

    initialize: function(options) {

        this.collection.bind('reset', this.loaded, this);
        this.collection.fetch({
            success: function(collection, response, options) {
                console.log('successful collection fetch');
            },
            error: function(col, xhr, opt) {
                alert('error fetching collection');
            }
        });        

        //console.log(this.collection.get('name'));

    },

    loaded: function() {
        // todo: construct the groupList property from the item group name
        // gear => gear-items-list
        // Extra Stuff => extra-stuff-items-list

        // set the groupListId once the name has been set for the collection
        this.groupListId = '#'+this.collection.get('name')+'-items-list';
        this.render();
    },

    addItem: function(item) {
        var itemView = new AstroApp.Views.ItemView({ model: item });
        $(this.groupListId).append(itemView.render().el);
    },

    render: function() {

        //console.log('hello');
        //console.log(this.collection);

        var itemGroupHtml = this.template({ name: this.collection.get('name') });
        $(this.main).html(itemGroupHtml);

        //console.log(this.collection.models);
        _.each(this.collection.models, this.addItem, this);

        return this;
    }
    
});

var toiletryItems = new AstroApp.Collections.ItemGroup();
var toiletryGroupView = new AstroApp.Views.ItemGroupView({ collection: toiletryItems });

//toiletryGroupView.render();


