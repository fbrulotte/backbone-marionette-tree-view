
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
    'click a.collapsed[data-toggle=node] i': 'onExpand',
    'click a.expanded[data-toggle=node] i': 'onCollapse',
    'click a[data-toggle=node]': 'onSelect'
  },

  initialize: function(options) {
    options = options || {};
    this.collectionType = options.collectionType;
    this.collection = this.model.get("children") || new this.collectionType();
  },

  childViewOptions: function() {
    return {
      collectionType: this.collectionType
    };
  },

  onRenderCollection: function() {
    this.ui.children.removeClass('hide');
    this.children.each(function(child) { this.bindChildView(child); }, this);
  },

    bindChildView: function(childView) {
      this.listenTo(childView, 'select', this.onChildSelected);
    },

      onChildSelected: function(model) {
        this.trigger('select', model);
      },

  onSelect: function(e) {
    this.trigger('select', this.model);
    this.$el.addClass('active');
    e.stopPropagation();
  },

  onExpand: function(e) {
    if (this.$el.hasClass('node-empty')) {
      return false;
    }

    this.isExpanding = true;
    this.ui.iconError.addClass('hide');
    this.ui.toggle.removeClass('collapsed').addClass('expanded');
    this.ui.iconExpand.addClass('hide');
    this.ui.iconLoading.removeClass('hide');

    this.fetchChildren(
      _.bind(this.onSuccess, this),
      _.bind(this.onError, this)
    );

    e.stopPropagation();
  },

    fetchChildren: function(success, error) {
      return this.model.fetchChildren({
        success: success,
        error: error
      });
    },

      onError: function() {
        this.ui.iconExpand.removeClass('hide');
        this.ui.iconError.removeClass('hide');
        this.ui.iconLoading.addClass('hide');
        this.ui.toggle.addClass('collapsed').removeClass('expanded');
        this.isExpanding = false;
      },

      onSuccess: function(children) {
        this.collection.reset(children);

        if (this.collection.size()) {
          this.ui.iconCollapse.removeClass('hide');
        } else {
          this.$el.addClass('node-empty');
        }

        this.ui.iconLoading.addClass('hide');
        this.isExpanding = false;
      },

  onCollapse: function(e) {
    if (this.$el.hasClass('node-empty') || this.isExpanding) {
      return false;
    }

    this.ui.toggle.addClass('collapsed').removeClass('expanded');

    this.ui.iconCollapse.addClass('hide');
    this.ui.iconExpand.removeClass('hide');
    this.ui.children.addClass('hide');

    this.children.each(function(child) { child.onCollapse(); });

    if (e) {
      e.stopPropagation();
    }
  }
});


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

