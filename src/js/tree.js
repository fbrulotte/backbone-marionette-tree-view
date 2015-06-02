
Marionette.TreeView = Marionette.CollectionView.extend({
  className: 'tree-view',

  initialize: function(options) {
    options = options || {};
    this.collectionType = options.collectionType;
    this.nbChildrenAttrName = options.nbChildrenAttrName;
  },

  childViewOptions: function() {
    return {
      collectionType: this.collectionType,
      nbChildrenAttrName: this.nbChildrenAttrName
    };
  },

  onShow: function() {
    this.children.first().select();
  },

  _addChildView: function(view, index) {
    Marionette.CollectionView.prototype._addChildView.apply(this, arguments);
    this.bindChildView(view);
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
