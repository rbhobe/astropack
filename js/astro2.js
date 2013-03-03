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
        //console.log(this.model.get('name')+"'s state is now: packed="+this.model.get('packed
        // todo: move the item out of the "to pack" collection into the "packed" collection
    }

});


AstroApp.Collections.ItemGroup = Backbone.Collection.extend({

    model: AstroApp.Models.Item,

    initialize: function(models, options) {
        // storing meta info for the collection, like name
        this._meta = {};
        _.each(options, this.set, this);
    },

    set: function(val, prop) {
        this._meta[prop] = val;
    },

    get: function(prop) {
        return this._meta[prop];
    }

});

AstroApp.Views.ItemGroupView = Backbone.View.extend({
    
    groupList: '',

    main: '#main',

    type: 'ItemGroupView', // for debugging

    template: _.template($('#item-group-template').html()),

    // collection: passed in during init

    initialize: function(options) {
        // console.log(this.model);
        // console.log(this.el);
        //this.model.on('change', this.render, this);

        // todo: construct the groupList property from the item group name
        // gear => gear-items-list
        // Extra Stuff => extra-stuff-items-list
        this.groupList = '#'+this.collection.get('name')+'-items-list';

        //console.log(this.collection.get('name'));

    },

    processItem: function(item) {
        var itemView = new AstroApp.Views.ItemView({ model: item });
        $(this.groupList).append(itemView.render().el);
    },

    render: function() {

        var itemGroupHtml = this.template({ name: this.collection.get('name') });
        $(this.main).html(itemGroupHtml);

        _.each(this.collection.models, this.processItem, this);

        return this;
    }
    
});

var myToiletryItems = [
    { 'name': 'toothbrush' },
    { 'name': 'deodorant' },
    { 'name': 'toothpaste' },
];

var toiletryItems = new AstroApp.Collections.ItemGroup(myToiletryItems, { name:'toiletries' });

var toiletryGroupView = new AstroApp.Views.ItemGroupView({ collection: toiletryItems });
toiletryGroupView.render();


