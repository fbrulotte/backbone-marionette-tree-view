// Mock Data
var mockData = [{
    name: 'name1'
  }, {
    name: 'name2'
  }, {
    name: 'name3'
  }];

// Custom classes definition
var CustomNodeView = Marionette.NodeView.extend({
    template: _.template('<a data-toggle="node" class="collapsed"><i class="fa fa-pie-chart"></i> <%=name%><div class="icon-group"><i class="fa fa-exclamation-triangle icon-error pull-right hide"></i><i class="fa fa-plus icon-expand pull-right"></i><i class="fa fa-minus icon-collapse hide pull-right"></i><i class="fa fa-spinner hide icon-loading fa-pulse"></i></div></a><div class="children"></div>')
  }),
  CustomNodeSuccessModel = Backbone.Model.extend({
    fetchChildren: function(options) {
      options.success(mockData);
    }
  }),
  CustomNodeSuccessCollection = Backbone.Collection.extend({
    model: CustomNodeSuccessModel
  });

// Create object
var model = new CustomNodeSuccessModel({ name: 'Jean' }),
    customNodeView;

describe("Node View", function() {

  beforeAll(function() {
    customNodeView = new CustomNodeView({ collectionType: CustomNodeSuccessCollection, model: model });
    customNodeView.render();
  });

  it("View is rendered well", function() {
    expect(customNodeView.$el.html()).toContain('Jean');
    expect(customNodeView.ui.iconError.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconLoading.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconCollapse.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconExpand.hasClass('hide')).toBeFalsy();
  });

  it("Node is expanding", function() {
    var clickEvent = $.Event('click');

    spyOn(customNodeView, 'onExpand');

    customNodeView.delegateEvents();
    customNodeView.$('a.collapsed[data-toggle=node] i').trigger(clickEvent);

    expect(customNodeView.onExpand).toHaveBeenCalled();
  });

  it("Node is expanded", function() {
    var clickEvent = $.Event('click');

    customNodeView.delegateEvents();
    customNodeView.$('a.collapsed[data-toggle=node] i').trigger(clickEvent);

    expect(customNodeView.ui.iconError.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconLoading.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconCollapse.hasClass('hide')).toBeFalsy();
    expect(customNodeView.ui.iconExpand.hasClass('hide')).toBeTruthy();
  });

  it("Node is collapsing", function() {
    var clickEvent = $.Event('click');

    spyOn(customNodeView, 'onCollapse');

    customNodeView.delegateEvents();
    customNodeView.$('a.expanded[data-toggle=node] i').trigger(clickEvent);

    expect(customNodeView.onCollapse).toHaveBeenCalled();
  });

  it("Node is collapsed", function() {
    var clickEvent = $.Event('click'),
        clickEvent2 = $.Event('click');

    customNodeView.delegateEvents();
    customNodeView.$('a.collapsed[data-toggle=node] i').trigger(clickEvent);
    customNodeView.$('a.expanded[data-toggle=node] i').trigger(clickEvent2);

    expect(customNodeView.ui.iconError.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconLoading.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconCollapse.hasClass('hide')).toBeTruthy();
    expect(customNodeView.ui.iconExpand.hasClass('hide')).toBeFalsy();
  });

  it("Node is selected", function() {
    var clickEvent = $.Event('click');

    spyOn(customNodeView, 'onSelect');

    customNodeView.delegateEvents();
    customNodeView.$('a[data-toggle=node]').trigger(clickEvent);

    expect(customNodeView.onSelect).toHaveBeenCalled();
  });

  it("Node trigger select event", function() {
    var clickEvent = $.Event('click'),
        foo = { bar: function() {} };

    spyOn(foo, 'bar');

    customNodeView.delegateEvents();
    customNodeView.bind('select', foo.bar, customNodeView);
    customNodeView.$('a[data-toggle=node]').trigger(clickEvent);

    expect(foo.bar).toHaveBeenCalled();
  });
});