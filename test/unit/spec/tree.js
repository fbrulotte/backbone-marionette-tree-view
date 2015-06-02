(function() {
  var mockData = [{
    name: 'child1'
  }, {
    name: 'child2'
  }, {
    name: 'child3'
  }],
  otherData = [{
    name: 'leaf1'
  }, {
    name: 'leaf2'
  }];

  var CustomNodeModel = Backbone.Model.extend({
    fetchChildren: function(options) {
      this.set('children', new CustomNodeCollection(otherData));
    },

    destroyChildren: function(options) {
      this.unset('children', { silent: true });
      this.trigger('delete:children');
    }
  });

  var CustomNodeCollection = Backbone.Collection.extend({
    model: CustomNodeModel
  });

  var CustomNodeView = Marionette.NodeView.extend({
    template: _.template('<a data-toggle="node" class="collapsed"><i class="fa fa-pie-chart"></i> <%=name%><div class="icon-group"><i class="fa fa-exclamation-triangle icon-error pull-right hide"></i><i class="fa fa-plus icon-expand pull-right"></i><i class="fa fa-minus icon-collapse hide pull-right"></i><i class="fa fa-spinner hide icon-loading fa-pulse"></i></div></a><div class="children"></div>')
  });

  var CustomLayout = Marionette.LayoutView.extend({
    template: _.template('<div id="treeview"> </div>'),
    regions: {
      treeView: '#treeview'
    },

    onRender: function() {
      var myTreeView = new Marionette.TreeView({
        collection: new CustomNodeCollection(mockData),
        collectionType: CustomNodeCollection,
        childView: CustomNodeView
      });
      this.treeView.show(myTreeView);

      this.listenTo(myTreeView, 'collapse', this.onCollapse);
      this.listenTo(myTreeView, 'expand', this.onExpand);
      this.listenTo(myTreeView, 'select', this.onSelect);
    },

    onExpand: function(model) { model.fetchChildren(); },

    onCollapse: function(model) { model.destroyChildren(); },

    onSelect: function(model) { this.trigger('select', model); }
  });

  var controller = {
    reactOnSelect: function() {},
    reactOnCollapse: function() {}
  };

  describe("TreeView", function() {

    beforeEach(function() {
      this.customLayout = new CustomLayout();
      this.customLayout.render();
    });

    it("should be well initialized", function() {
      expect(this.customLayout).toBeDefined();
      expect(this.customLayout.treeView.currentView instanceof Marionette.TreeView).toBeTruthy();
      expect(this.customLayout.treeView.currentView.collection instanceof CustomNodeCollection).toBeTruthy();
      expect(this.customLayout.treeView.currentView.collection.first() instanceof CustomNodeModel).toBeTruthy();
      expect(this.customLayout.treeView.currentView.children.findByIndex(0) instanceof CustomNodeView).toBeTruthy();
    });

    it("should set the first node as selected/active after the view is showed", function() {
      expect(this.customLayout.treeView.currentView.children.first().$el.hasClass('active')).toBeTruthy();
      expect(this.customLayout.treeView.currentView.children.findByIndex(1).$el.hasClass('active')).toBeFalsy();
      expect(this.customLayout.treeView.currentView.children.findByIndex(2).$el.hasClass('active')).toBeFalsy();
    });

    it("should change the selected/active node after a select event is triggered", function() {
      expect(this.customLayout.treeView.currentView.children.findByIndex(0).$el.hasClass('active')).toBeTruthy();
      expect(this.customLayout.treeView.currentView.children.findByIndex(1).$el.hasClass('active')).toBeFalsy();
      expect(this.customLayout.treeView.currentView.children.findByIndex(2).$el.hasClass('active')).toBeFalsy();

      this.customLayout.treeView.currentView.children.findByIndex(1).ui.toggle.trigger($.Event('click'));

      expect(this.customLayout.treeView.currentView.children.findByIndex(0).$el.hasClass('active')).toBeFalsy();
      expect(this.customLayout.treeView.currentView.children.findByIndex(1).$el.hasClass('active')).toBeTruthy();
      expect(this.customLayout.treeView.currentView.children.findByIndex(2).$el.hasClass('active')).toBeFalsy();
    });

    it("should listen to the event bound to childviews that were added after the initial creation of the treeview", function() {
      spyOn(controller, 'reactOnCollapse');

      this.customLayout.treeView.currentView.collection.add({ name: 'newChild' });
      this.customLayout.treeView.currentView.bind('collapse', controller.reactOnCollapse, controller);
      expect(this.customLayout.treeView.currentView.children.last().model.get('name')).toEqual('newChild');

      this.customLayout.treeView.currentView.children.last().ui.iconCollapse.trigger($.Event('click'));
      expect(controller.reactOnCollapse).toHaveBeenCalled();
    });

    it("should trigger the select event, propagate it towards the treeview's controller and call it's associated callback", function() {
      spyOn(controller, 'reactOnSelect');
      this.customLayout.bind('select', controller.reactOnSelect, controller);

      expect(this.customLayout.treeView.currentView.children.first().children.length).toEqual(0);
      this.customLayout.treeView.currentView.children.first().ui.iconExpand.trigger($.Event('click'));
      expect(this.customLayout.treeView.currentView.children.first().children.length).toEqual(2);

      expect(this.customLayout.treeView.currentView.children.first().children.first().model.get('name')).toEqual('leaf1');
      this.customLayout.treeView.currentView.children.first().children.first().ui.toggle.trigger($.Event('click'));

      expect(controller.reactOnSelect).toHaveBeenCalledWith(this.customLayout.treeView.currentView.children.first().children.first().model);
    });

  });

})();
