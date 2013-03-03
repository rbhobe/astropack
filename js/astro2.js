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
        //this.model.on('destroy', this.modelChanged, this);
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
        //console.log(this.model.get('name')+"'s state is now: packed="+this.model.get('packed'));
        // todo: move the item out of the "to pack" collection into the "packed" collection
    }

});


AstroApp.Collections.ItemGroup = Backbone.Collection.extend({

    name: '',

    model: AstroApp.Models.Item,

    initialize: function() {
        
    }

});

AstroApp.Views.ItemGroupView = Backbone.View.extend({
    
    groupList: '#toiletries-items-list',

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

    },

    processItem: function(item) {
        var itemView = new AstroApp.Views.ItemView({ model: item });
        $(this.groupList).append(itemView.render().el);
    },

    render: function() {

        var itemGroupHtml = this.template({ name:'toiletries' });
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

var toiletryItems = new AstroApp.Collections.ItemGroup(myToiletryItems);

var toiletryGroupView = new AstroApp.Views.ItemGroupView({ collection: toiletryItems });
toiletryGroupView.render();

/* 
var itemView1 = new AstroApp.Views.ItemView({ model: toiletryItems.at(0) });
$('#items-container').append(itemView1.render().el);
var itemView2 = new AstroApp.Views.ItemView({ model: toiletryItems.at(1) });
$('#items-container').append(itemView2.render().el);
var itemView3 = new AstroApp.Views.ItemView({ model: toiletryItems.at(2) });
$('#items-container').append(itemView3.render().el);

toiletryItems.at(0).set({ name: 'tongue cleaner' });
*/


