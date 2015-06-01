(function() {
  var mockData = [{
    name: 'child1',
    nbChildren: 0
  }, {
    name: 'child2'
  }];

  var multiLvlData = [{
    name: 'some folder',
    nbSubFiles: 3,
    children: [{
      name: 'other folder',
      nbSubFiles: 3,
      children: [{
        name: 'other folder'
      }, {
        name: 'SOP.docx',
        nbSubFiles: 0
      },  {
        name: 'display.png'
      }]
    }, {
      name: 'status.docx',
      nbSubFiles: 0
    },  {
      name: 'image.png'
    }]
  }, {
    name: 'report.docx',
    nbSubFiles: 0
  },  {
    name: 'logo.png'
  }];

// Custom classes definition
  var CustomNodeView = Marionette.NodeView.extend({
        template: _.template('<a data-toggle="node" class="collapsed"><i class="fa fa-pie-chart"></i> <%=name%><div class="icon-group"><i class="fa fa-exclamation-triangle icon-error pull-right hide"></i><i class="fa fa-plus icon-expand pull-right"></i><i class="fa fa-minus icon-collapse hide pull-right"></i><i class="fa fa-spinner hide icon-loading fa-pulse"></i></div></a><div class="children"></div>')
      }),
      CustomNodeSuccessModel = Backbone.Model.extend({
        fetchChildren: function (options) {
          if (!options.err){
            if (options.multiLvl){
              this.set('children', new Backbone.Collection(multiLvlData));
            } else {
              this.set('children', new Backbone.Collection(mockData));
            }
          } else {
            this.trigger('error');
          }
        },
        deleteChildren: function () {
          this.unset('children', {silent: true});
          this.trigger('delete:children');
        }
      }),
      CustomNodeSuccessCollection = Backbone.Collection.extend({
        model: CustomNodeSuccessModel
      });

  var controller = {
    reactOnExpand: function () {},
    reactOnCollapse: function () {},
    reactOnSelect: function () {}
  };

// Tests
  describe("NodeView", function () {

    beforeEach(function () {
      // Create object
      var model = new CustomNodeSuccessModel({name: 'Root'});

      this.customNodeView = new CustomNodeView({collectionType: CustomNodeSuccessCollection, model: model});
      this.customNodeView.render();
    });

    afterEach(function () {
      this.customNodeView.destroy();
    });

    it("should be rendered well", function () {
      expect(this.customNodeView.$el.html()).toContain('Root');
      expect(this.customNodeView.ui.iconError.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconLoading.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconCollapse.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconExpand.hasClass('hide')).toBeFalsy();
    });

    it("should hide the expand button when a model has no children", function () {
      this.customNodeView.model.fetchChildren({ err: false, multiLvl: false});

      expect(this.customNodeView.children.first().ui.iconExpand.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.children.last().ui.iconExpand.hasClass('hide')).toBeFalsy();
    });

    it("should show the appropriate icons when loading models that have children", function () {
      this.customNodeView.model.fetchChildren({ err: false, multiLvl: true});

      expect(this.customNodeView.ui.iconExpand.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconCollapse.hasClass('hide')).toBeFalsy();

      expect(this.customNodeView.children.first().ui.iconExpand.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.children.first().ui.iconCollapse.hasClass('hide')).toBeFalsy();

      expect(this.customNodeView.children.first().children.first().ui.iconExpand.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.children.first().children.first().ui.iconCollapse.hasClass('hide')).toBeFalsy();

      expect(this.customNodeView.children.first().children.last().ui.iconExpand.hasClass('hide')).toBeFalsy();
      expect(this.customNodeView.children.first().children.last().ui.iconCollapse.hasClass('hide')).toBeTruthy();

      expect(this.customNodeView.children.first().children.first().children.first().ui.iconExpand.hasClass('hide')).toBeFalsy();
      expect(this.customNodeView.children.first().children.first().children.first().ui.iconCollapse.hasClass('hide')).toBeTruthy();
    });

    it("should trigger the expand event and call the associated callback", function () {
      spyOn(controller, 'reactOnExpand');

      this.customNodeView.bind('expand', controller.reactOnExpand, controller);
      this.customNodeView.ui.iconExpand.trigger($.Event('click'));

      expect(controller.reactOnExpand).toHaveBeenCalled();
    });

    it("should be expanded", function () {
      this.customNodeView.model.fetchChildren({ err: false, multiLvl: false });

      expect(this.customNodeView.$el.html()).toContain('Root');
      expect(this.customNodeView.$el.html()).toContain('child1');
      expect(this.customNodeView.ui.iconError.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconLoading.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconExpand.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconCollapse.hasClass('hide')).toBeFalsy();
      expect(this.customNodeView.isExpanding).toBeFalsy();
    });

    it("should trigger the collapse event and call the associated callback", function () {
      spyOn(controller, 'reactOnCollapse');

      this.customNodeView.bind('collapse', controller.reactOnCollapse, controller);
      this.customNodeView.ui.iconExpand.trigger($.Event('click'));
      this.customNodeView.ui.iconCollapse.trigger($.Event('click'));
      expect(controller.reactOnCollapse).toHaveBeenCalled();
    });

    it("should be collapsed", function () {
      this.customNodeView.model.deleteChildren();

      expect(this.customNodeView.$el.html()).toContain('Root');
      expect(this.customNodeView.$el.html()).not.toContain('child1');
      expect(this.customNodeView.ui.iconError.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconLoading.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconCollapse.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconExpand.hasClass('hide')).toBeFalsy();
    });

    it("should be active after a click event on the node", function () {
      this.customNodeView.ui.toggle.trigger($.Event('click'));

      expect(this.customNodeView.$el.hasClass('active')).toBeTruthy();
    });

    it("should trigger the select event and call the associated callback", function () {
      spyOn(controller, 'reactOnSelect');

      this.customNodeView.bind('select', controller.reactOnSelect, controller);
      this.customNodeView.ui.toggle.trigger($.Event('click'));

      expect(controller.reactOnSelect).toHaveBeenCalled();
    });

    it("should listen to childviews's events", function () {
      spyOn(controller, 'reactOnExpand');
      this.customNodeView.model.fetchChildren({ err: false, multiLvl: false });

      this.customNodeView.bind('expand', controller.reactOnExpand, controller);
      this.customNodeView.children.first().ui.iconExpand.trigger($.Event('click'));

      expect(controller.reactOnExpand).toHaveBeenCalled();
    });

    it("should modify the view when an error occurs", function () {
      this.customNodeView.model.fetchChildren({ err: true, multiLvl: false });

      expect(this.customNodeView.$el.html()).toContain('Root');
      expect(this.customNodeView.$el.html()).not.toContain('child1');
      expect(this.customNodeView.ui.toggle.hasClass('collapsed')).toBeTruthy();
      expect(this.customNodeView.ui.iconLoading.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconCollapse.hasClass('hide')).toBeTruthy();
      expect(this.customNodeView.ui.iconError.hasClass('hide')).toBeFalsy();
      expect(this.customNodeView.ui.iconExpand.hasClass('hide')).toBeFalsy();
      expect(this.customNodeView.isExpanding).toBeFalsy();
    });
  });

})();