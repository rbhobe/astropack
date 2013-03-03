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
        
    }

});

AstroApp.Views.ItemView = Backbone.View.extend({

    tagName: 'tr',
    className: 'item-row',
    type: 'ItemView', // for debugging

    template: _.template($('#item-template').html()),

    initialize: function() {
        //this.model.on('change', this.render, this);
    },

    render: function () {
        var itemHtml = this.template(this.model.toJSON());
        this.$el.html(itemHtml);
        return this;
    }

});


AstroApp.Collections.ItemGroup = Backbone.Collection.extend({

    model: AstroApp.Models.Item,

    initialize: function() {
        
    }

});

AstroApp.Views.ItemGroupView = Backbone.View.extend({
    /*
    el: '#items-container',

    template: _.template($('#item-group-template').html()),

    initialize: function(options) {
        // console.log(this.model);
        // console.log(this.el);
        this.model.on('change', this.render, this);

        
    },

    render: function() {

        //console.log(this.template.html().children('ul'));

        this.model.get('items').each(console.log);

        console.log(this.model.get('items'));

        var itemGroupHtml = this.template(this.model.toJSON());
        this.$el.html(itemGroupHtml);
        return this;
    }
    */
});

var myToiletryItems = [
    { 'name': 'toothbrush' },
    { 'name': 'deodorant' },
    { 'name': 'toothpaste' },
];

var toiletryItems = new AstroApp.Collections.ItemGroup(myToiletryItems);

var itemView1 = new AstroApp.Views.ItemView({ model: toiletryItems.at(0) });
$('#items-container').append(itemView1.render().el);
var itemView2 = new AstroApp.Views.ItemView({ model: toiletryItems.at(1) });
$('#items-container').append(itemView2.render().el);
var itemView3 = new AstroApp.Views.ItemView({ model: toiletryItems.at(2) });
$('#items-container').append(itemView3.render().el);

