
Marionette.NodeView = Marionette.CompositeView.extend({
  childViewContainer: '.children',
  className: 'node',

  ui: {
    toggle: 'a[data-toggle=node]',
    iconCollapse: '.icon-collapse',
    iconExpand: '.icon-expand',
    iconLoading: '.icon-loading',
    iconError: '.icon-error',
    children: '.children'
  },

  events: {
    'click @ui.iconExpand': 'onExpand',
    'click @ui.iconCollapse': 'onCollapse',
    'click @ui.toggle': 'onSelect'
  },

  modelEvents: {
    'change:children': 'onChangeChildren',
    'delete:children': 'onDeleteChildren',
    'error': 'onError'
  },

  initialize: function(options) {
    var models = [];

    options = options || {};
    this.nbChildrenAttrName = ((options.nbChildrenAttrName) ? options.nbChildrenAttrName : 'nbChildren');
    this.collectionType = options.collectionType;

    if (this.model.get('children')) {
      if (!_.isArray(this.model.get('children'))) {
        models = this.model.get('children').models;
      } else {
        models = this.model.get('children');
      }
    }
    this.collection = new this.collectionType(models);
  },

  childViewOptions: function() {
    return {
      collectionType: this.collectionType,
      nbChildrenAttrName: this.nbChildrenAttrName
    };
  },

  onRender: function() {
    if (this.model.get(this.nbChildrenAttrName) === 0){
      this.ui.iconExpand.addClass('hide');
    }
  },

  onRenderCollection: function() {
    this.ui.iconExpand.addClass('hide');

    if (this.model.get(this.nbChildrenAttrName) !== 0){
      this.ui.iconCollapse.removeClass('hide');
    }

    this.ui.children.removeClass('hide');
    this.children.each(function(child) { this.bindChildView(child); }, this);
  },

  bindChildView: function(childView) {
    this.listenTo(childView, 'select', this.onChildSelected);
    this.listenTo(childView, 'expand', this.onChildExpand);
    this.listenTo(childView, 'collapse', this.onChildCollapse);
  },

  onChildSelected: function(node) {
    this.trigger('select', node);
  },

  onChildExpand: function(node) {
    this.trigger('expand', node);
  },

  onChildCollapse: function(node) {
    this.trigger('collapse', node);
  },

  onSelect: function(e) {
    this.select();
    e.stopPropagation();
  },

  onExpand: function(e) {
    this.expand();
    e.stopPropagation();
    this.trigger('expand', this.model);
  },

  onCollapse: function(e) {
    this.collapse();
    e.stopPropagation();
    this.trigger('collapse', this.model);
  },

  onDeleteChildren: function() {
    this.collapse();
  },

  onError: function() {
    this.setIconsOnError();
    this.isExpanding = false;
  },

  onChangeChildren: function() {
    this.collection.reset(this.model.get('children').models);
    this.ui.iconExpand.addClass('hide');

    if (this.collection.size()) {
      this.ui.iconCollapse.removeClass('hide');
    } else {
      this.$el.addClass('node-empty');
    }
    this.ui.iconLoading.addClass('hide');
    this.isExpanding = false;
  },

  select: function() {
    this.trigger('select', this.model);
    this.$el.addClass('active');
  },

  expand: function() {
    if (this.$el.hasClass('node-empty')) {
      return false;
    }
    this.isExpanding = true;
    this.setIconsOnExpand();
  },

  collapse: function() {
    if (this.$el.hasClass('node-empty') || this.isExpanding) {
      return false;
    }
    this.setIconsOnCollapse();
    this.collection.reset();
  },

  setIconsOnCollapse: function() {
    this.ui.toggle.addClass('collapsed').removeClass('expanded');
    this.ui.iconCollapse.addClass('hide');
    this.ui.iconExpand.removeClass('hide');
    this.ui.children.addClass('hide');
  },

  setIconsOnExpand: function() {
    this.ui.iconError.addClass('hide');
    this.ui.toggle.removeClass('collapsed').addClass('expanded');
    this.ui.iconExpand.addClass('hide');
    this.ui.iconLoading.removeClass('hide');
  },

  setIconsOnError: function() {
    this.ui.iconExpand.removeClass('hide');
    this.ui.iconError.removeClass('hide');
    this.ui.iconLoading.addClass('hide');
    this.ui.toggle.addClass('collapsed').removeClass('expanded');
  }
});


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

