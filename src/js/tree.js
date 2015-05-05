
Marionette.TreeView = Marionette.CollectionView.extend({
  className: 'tree-view',

  initialize: function(options) {
    options = options || {};
    this.collectionType = options.collectionType;
  },

  childViewOptions: function() {
    return {
      collectionType: this.collectionType
    };
  },

  onRenderCollection: function() {
    this.children.each(function(child) { this.bindChildView(child); }, this);
  },

  onShow: function() {
    this.children.first().select();
  },

  bindChildView: function(childView) {
    this.listenTo(childView, 'select', this.onChildSelected);
    this.listenTo(childView, 'expand', this.onChildExpanded);
    this.listenTo(childView, 'collapse', this.onChildCollapsed);
  },

  onChildSelected: function(node) {
    this.$('.node').removeClass('active');
    this.trigger('select', node);
  },

  onChildExpanded: function(node) {
    this.trigger('expand', node);
  },

  onChildCollapsed: function(node) {
    this.trigger('collapse', node);
  }
});