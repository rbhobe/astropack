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
        "click .pack-action" : "toggleItemPacked"
    },

    render: function () {
        var itemHtml = this.template(this.model.toJSON());
        this.$el.html(itemHtml);
        return this;
    },

    toggleItemPacked: function() {
        this.model.togglePacked(); // toggle item as packed or unpacked
        console.log(this.model.get('name')+' is '+this.model.get('packed'));
    }

});

AstroApp.Views.ItemsView = Backbone.View.extend({

    tagName: 'tbody',
    type: 'ItemsView',

    // collection being passed in

    initialize: function() {
        this.collection.on('add', this.render, this);
        this.collection.on('remove', this.render, this);
    },

    render: function() {
        // console.log('re-rendering collection');
        this.$el.empty();
        _.each(this.collection.models, this.renderItem, this);

        return this;
    },

    renderItem: function(item) {
        var itemView = new AstroApp.Views.ItemView({ model: item });
        this.$el.prepend(itemView.render().el);
    },

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

        // Collection views
        this.toPackItemsView = new AstroApp.Views.ItemsView({ collection: this.model.get('toPackItems') });
        this.packedItemsView = new AstroApp.Views.ItemsView({ collection: this.model.get('packedItems') });

        // when an item is packed
        this.model.get('toPackItems').on('change:packed', function(model) { 
            this.model.get('packedItems').add(model);
            this.model.get('toPackItems').remove(model);
            if(!this.model.get('toPackItems').length) { // when all items in a group have been packed
                $(this.toPackGroupId).hide();
            }
            $(this.packedGroupId).show();
        }, this);

        // when an item is unpacked
        this.model.get('packedItems').on('change:packed', function(model) { 
            this.model.get('toPackItems').add(model);
            this.model.get('packedItems').remove(model);
            if(!this.model.get('packedItems').length) { // when all items in a group have been undo pack'ed
                $(this.packedGroupId).hide();
            }
            $(this.toPackGroupId).show();
        }, this);
        
        this.render();
    },

   

    render: function() {
        
        var toPackItemGroupHtml = this.template({ displayName: this.model.get('displayName'), selectorName: this.model.get('selectorName'), packedState: 'to-pack' });
        $(this.toPackId).append(toPackItemGroupHtml);
        $(this.toPackGroupId).append(this.toPackItemsView.render().el);

        var packedItemGroupHtml = this.template({ displayName: this.model.get('displayName'), selectorName: this.model.get('selectorName'), packedState: 'packed' });
        $(this.packedId).append(packedItemGroupHtml);
        $(this.packedGroupId).append(this.packedItemsView.render().el);

        return this;
    },
    
});

// TODO: app view
// TODO: app view listens for packing finished event