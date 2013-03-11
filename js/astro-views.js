var AstroApp = {
    Models: {},
    Collections: {},
    Views: {}, 
    Templates: {}
};

AstroApp.Views.ItemView = Backbone.View.extend({

    tagName: 'tr',
    className: 'item-row',
    type: 'ItemView', // for debugging

    template: _.template($('#item-template').html()),

    events: {
        "click .pack-action" : "packItem"
    },

    render: function () {
        var itemHtml = this.template(this.model.toJSON());
        this.$el.html(itemHtml);
        return this;
    },

    packItem: function() {
        this.model.togglePacked(); // toggle item as packed or unpacked
    }

});

// view for model of type ItemGroup
AstroApp.Views.ItemGroupView = Backbone.View.extend({
    
    toPackGroupId: '',
    packedGroupId: '',

    toPackId: '#to-pack-container',
    packedId: '#packed-container',

    type: 'ItemGroupView', // for debugging

    template: _.template($('#item-group-template').html()),
    
    initialize: function(options) {

        // DOM id for this item group
        this.toPackGroupId = '#'+this.model.get('selectorName')+'-items-list-to-pack';
        this.packedGroupId = '#'+this.model.get('selectorName')+'-items-list-packed';

        // when an item is packed
        this.model.get('toPackItems').on('change:packed', function(model) { 
            this.model.get('toPackItems').remove(model);
            this.model.get('packedItems').add(model);
            if(!this.model.get('toPackItems').length) { // when all items in a group have been packed
                $(this.toPackId).hide();
            }
            $(this.packedId).show();
        }, this);

        // when an item is unpacked
        this.model.get('packedItems').on('change:packed', function(model) { 
            this.model.get('packedItems').remove(model);
            this.model.get('toPackItems').add(model);
            if(!this.model.get('packedItems').length) { // when all items in a group have been undo pack'ed
                $(this.packedId).hide();
            }
            $(this.toPackId).show();
        }, this);

        // re-render the collections when they change
        this.listenTo(this.model.get('packedItems'), 'change', this.render);
        this.listenTo(this.model.get('toPackItems'), 'change', this.render);
        
        this.render();
    },

    addItemToToPack: function(item) {
        // console.log(item);
        var itemView = new AstroApp.Views.ItemView({ model: item });
        console.log(this.toPackGroupId);
        $(this.toPackGroupId).append(itemView.render().el);
    },

    addItemToPacked: function(item) {
        // console.log(item);
        var itemView = new AstroApp.Views.ItemView({ model: item });
        $(this.packedGroupId).append(itemView.render().el);
    },

    render: function() {
        // console.log('rendering itemgroup view');

        var toPackItemGroupHtml = this.template({ displayName: this.model.get('displayName'), selectorName: this.model.get('selectorName'), packedState: 'to-pack' });
        $(this.toPackId).html(toPackItemGroupHtml);

        var packedItemGroupHtml = this.template({ displayName: this.model.get('displayName'), selectorName: this.model.get('selectorName'), packedState: 'packed' });
        $(this.packedId).html(packedItemGroupHtml);

        // access the models within the collection attribute
        _.each(this.model.get('toPackItems').models, this.addItemToToPack, this);
        _.each(this.model.get('packedItems').models, this.addItemToPacked, this);

        return this;
    }
    
});
