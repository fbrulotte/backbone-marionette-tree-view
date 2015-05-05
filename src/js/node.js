
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

  modelEvents: {
    'change:children': 'onChildrenFetched',
    'delete:children': 'onCollapse'
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

  select: function() {
    this.trigger('select', this.model);
    this.$el.addClass('active');
  },

  onExpand: function(e) {
    if (this.$el.hasClass('node-empty')) {
      return false;
    }

    this.isExpanding = true;
    this.setIconsOnExpand();

    this.fetchChildren({
      error: _.bind(this.onError, this)
    });

    e.stopPropagation();

    this.trigger('expand', this.model);
  },

  setIconsOnExpand: function() {
    this.ui.iconError.addClass('hide');
    this.ui.toggle.removeClass('collapsed').addClass('expanded');
    this.ui.iconExpand.addClass('hide');
    this.ui.iconLoading.removeClass('hide');
  },

  onChildrenFetched: function() {
    this.setIconsOnExpand();
    this.collection.reset(this.model.get('children').models);

    if (this.collection.size()) {
      this.ui.iconCollapse.removeClass('hide');
    } else {
      this.$el.addClass('node-empty');
    }

    this.ui.iconLoading.addClass('hide');
    this.isExpanding = false;
  },

    fetchChildren: function(options) {
      return this.model.fetchChildren(options);
    },

      onError: function() {
        this.ui.iconExpand.removeClass('hide');
        this.ui.iconError.removeClass('hide');
        this.ui.iconLoading.addClass('hide');
        this.ui.toggle.addClass('collapsed').removeClass('expanded');
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

    this.trigger('collapse', this.model);
  }
});