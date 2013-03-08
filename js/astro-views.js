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
        //console.log(this.model.get('name')+"'s state is now: packed="+this.model.get('packed'));
        // console.log(this.model);

        if (this.model.get('packed')) { // item was just packed, move it to the "packed" collection
            //itemGroup.get('toPackItems').remove(this.model);

            //console.log('here comes treble');
            //console.log(itemGroup);
        } else { // item was unpacked, move it to the "to pack collection"

        }

    }

});

// view for model of type ItemGroup
AstroApp.Views.ItemGroupView = Backbone.View.extend({
    
    groupId: '',

    toPackId: '#to-pack',
    packedId: '#packed',

    type: 'ItemGroupView', // for debugging

    template: _.template($('#item-group-template').html()),
    
    initialize: function(options) {

        // DOM id for this item group
        this.groupId = '#'+this.model.get('selectorName')+'-items-list';

        // when an item is packed
        this.model.get('toPackItems').on('change:packed', function(model) { 
            this.model.get('toPackItems').remove(model);
            this.model.get('packedItems').add(model);
        }, this);

        // when an item is unpacked
        this.model.get('packedItems').on('change:packed', function(model) { 
            this.model.get('packedItems').remove(model);
            this.model.get('toPackItems').add(model);
        }, this);

        // re-render the collections when they change
        this.listenTo(this.model.get('packedItems'), 'change', this.render);
        this.listenTo(this.model.get('toPackItems'), 'change', this.render);
        
        this.render();
    },

    addItem: function(item) {
        // console.log(item);
        var itemView = new AstroApp.Views.ItemView({ model: item });
        $(this.groupId).append(itemView.render().el);
    },

    render: function() {
        // console.log('rendering itemgroup view');

        var itemGroupHtml = this.template({ name: this.model.get('displayName') });
        $(this.toPackId).html(itemGroupHtml);

        // access the models within the collection attribute
        _.each(this.model.get('toPackItems').models, this.addItem, this);

        return this;
    }
    
});


// AstroApp.Views.ItemGroupsView = Backbone.View.extend({
    
//     groupListId: '',

//     main: '#main',

//     type: 'ItemGroupView', // for debugging

//     template: _.template($('#item-group-template').html()),
    
//     initialize: function(options) {

//         this.collection.bind('reset', this.loaded, this);
//         this.collection.fetch({
//             success: function(collection, response, options) {
//                 console.log('successful collection fetch');
//             },
//             error: function(col, xhr, opt) {
//                 alert('error fetching collection');
//             }
//         });        

//     },

//     loaded: function() {
//         // set the groupListId once the selector name has been set for the collection
//         this.groupListId = '#'+this.collection.get('selectorName')+'-items-list';
//         this.render();
//     },

//     addItem: function(item) {
//         var itemView = new AstroApp.Views.ItemView({ model: item });
//         $(this.groupListId).append(itemView.render().el);
//     },

//     render: function() {
//         var itemGroupHtml = this.template({ name: this.collection.get('displayName') });
//         $(this.main).html(itemGroupHtml);

//         _.each(this.collection.models, this.addItem, this);

//         return this;
//     }
    
// });