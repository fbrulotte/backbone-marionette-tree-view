# Backbone Marionette Tree View

Backbone Marionette extension rendering list as tree view with lazy loading for children.

## Features

- List as tree view.
- Lazy Loading.
- Create your own templates for nodes.
- Handle multiple types of nodes.
- Basic CSS done.

## Dependencies

Backbone Marionette 2.x.x

## Installation

######CSS (you can use your own CSS)
```
  <link rel='stylesheet' href='marionette-tree-view.min.css'/>
```
######JS
```
  <script src='marionette-tree-view.min.js></script>
```

## Exemple

Using **Backbone Marionette Tree View** is done in three steps:

 1. Add a method 'fetchChildren' to your model which will fetch the children of the current node.
    The children data should be passed to the `success` callback.

  ```
    var CustomNodeModel = Backbone.Model.extend({
      fetchChildren: function(options) {
        // Do something with options.success and options.error
      }
    });
  
    var CustomNodeCollection = Backbone.Collection.extend({
      model: CustomNodeModel
    });
  ```

 2. Create your custom node views.

  ```
    var CustomNodeView = Marionette.NodeView.extend({
      template: _.template('<a data-toggle="node" class="collapsed"><i class="fa fa-pie-chart"></i> <%=name%><div class="icon-group"><i class="fa fa-exclamation-triangle icon-error pull-right hide"></i><i class="fa fa-plus icon-expand pull-right"></i><i class="fa fa-minus icon-collapse hide pull-right"></i><i class="fa fa-spinner hide icon-loading fa-pulse"></i></div></a><div class="children"></div>')
    });
  ```

 3. Instance your tree view and put it where you want. `rawCollection` contains your first level of your tree.

  ```
    var myCollection = new CustomNodeCollection(rawCollection);
  
    var myTreeView = new Marionette.TreeView({
      collection: myCollection,
      collectionType: CustomNodeCollection,
      childView: CustomNodeView
    });
  
    $(yourcontainer).html(myTreeView.render().el);
  ```

  - `collection` is your `Backbone.Collection`.
  - `collectionType` is the reference to the definition of the collection used to manage your children.
  - `childView` is your definition of your node view for your first level.



See the `example` folder for more information about the usage.

## Customize
The basic structure of a node template is (I'm using Font-Awesome for the icons but it's up to you):
```
<a data-toggle="node" class="collapsed">
  <i class="fa fa-pie-chart"></i> <%=name%>
  <div class="icon-group">
    <i class="fa fa-exclamation-triangle icon-error pull-right hide"></i>
    <i class="fa fa-plus icon-expand pull-right"></i>
    <i class="fa fa-minus icon-collapse hide pull-right"></i>
    <i class="fa fa-spinner hide icon-loading fa-pulse"></i>
  </div>
</a>
<div class="children"></div>
```
By default the `NodeView` is using its own UI element, but you can override it.
```
ui: {
    toggle: 'a[data-toggle=node]',
    iconCollapse: '.icon-collapse',
    iconExpand: '.icon-expand',
    iconLoading: '.icon-loading',
    iconError: '.icon-error',
    children: '.children'
  }
```
As you can see, your template must have an icon for `collapse`, an icon for `expand`, an icon for `loading` and an icon for `error`. The classes here are not the one defining the icon itself, just a reference to them.

The `toggle` element is your node.

The nodes children are displayed inside the tag containing the `children` class but you can modify it by overriding the `childViewContainer` when extending the node.

## Changelog

##### Version 1.0.0
- Initial commit
