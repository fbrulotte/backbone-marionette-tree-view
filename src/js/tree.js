
Marionette.TreeView = Marionette.CollectionView.extend({
  className: 'tree-view',

  initialize: function(options) {
    options = options || {};
    this.collectionType = options.collectionType;
    $('body').on('click.treeview' + this.cid, _.bind(this.unselectChildren, this));
  },

  onBeforeDestroy: function() {
    $('body').off('click.treeview' + this.cid);
  },

  unselectChildren: function() {
    this.$('.node').removeClass('active');
    this.trigger('unselect');
  },

  childViewOptions: function() {
    return {
      collectionType: this.collectionType
    };
  },

  onRenderCollection: function() {
    this.children.each(function(child) { this.bindChildView(child); }, this);
  },

  bindChildView: function(childView) {
    this.listenTo(childView, 'select', this.onChildSelected);
  },

  onChildSelected: function(model) {
    this.$('.node').removeClass('active');
    this.trigger('select', model);
  }
});