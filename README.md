# Backbone Marionette Tree View [![Build Status](https://travis-ci.org/Interfacing/backbone-marionette-tree-view.svg?branch=master)](https://travis-ci.org/Interfacing/backbone-marionette-tree-view)

Backbone Marionette extension rendering list as tree view with lazy loading for children.

###### Backbone Marionette Architecture
![Backbone Marionette Tree View Architecture](http://s1.postimg.org/vs4e82lpr/Untitled_Diagram_1.png)

- `Blue` are the Backbone Marionette Tree View classes.
- `Green` are the classes created by you to customize the tree view.
- `Yellow` are the default Backbone classes.


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

## Example

Using **Backbone Marionette Tree View** is done in three steps:

 1. Define your model and add a method 'fetchChildren' to it which will fetch the children of the current node.
    The children data should be passed to the `success` callback.

    Add a method 'deleteChildren' to your model which will delete all children and unset them.
    
    Define your collection.

  ```
    var CustomNodeModel = Backbone.Model.extend({
      fetchChildren: function(options) {
        // Do something with options.success and options.error
      }
      deleteChildren: function(options) {
        // Recursive function to delete children
        // View basic example provided with the library for some example code
      }
    });
  
    var CustomNodeCollection = Backbone.Collection.extend({
      model: CustomNodeModel
    });
  ```

 2. Create your custom node view and define its template.

  ```
    var CustomNodeView = Marionette.NodeView.extend({
      template: _.template('<a data-toggle="node" class="collapsed"><i class="fa fa-pie-chart"></i> <%=name%><div class="icon-group"><i class="fa fa-exclamation-triangle icon-error pull-right hide"></i><i class="fa fa-plus icon-expand pull-right"></i><i class="fa fa-minus icon-collapse hide pull-right"></i><i class="fa fa-spinner hide icon-loading fa-pulse"></i></div></a><div class="children"></div>')
    });
  ```

 3. Instance your tree view and put it where you want. `rawCollection` contains your first level of your tree. You can specify an optional attribute that represents the number of children each node possess. Here the attribute is named nbSubFiles and represents the number of files that are contained in a specific folder. 

  A positive value will have the default behavior. A value of 0 will hide the expand icon associated to that node. When the    value is not defined, the expand icon will appear since we do not know if this node has children.

  ```
    var rawCollection = [{
          name: 'images folder',
          nbSubFiles: 3
        }, {
          name: 'music folder',
          nbSubFiles: 0
        }, {
          name: 'video.mp4'
        }];
        
    var myCollection = new CustomNodeCollection(rawCollection);
  
    var myTreeView = new Marionette.TreeView({
      collection: myCollection,
      collectionType: CustomNodeCollection,
      childView: CustomNodeView,
      nbChildrenAttrName: 'nbSubFiles'
    });
  
    $(yourcontainer).html(myTreeView.render().el);
  ```

  - `collection` is your `Backbone.Collection`.
  - `collectionType` is the reference to the definition of the collection used to manage your children.
  - `childView` is your definition of your node view for your first level.
  - `nbChildrenAttrName` is when you want to override the default name of the attribute 'nbChildren'



See the `example` folder for more information about the usage.

## Customize
The basic structure of a node template is (The library is using Font-Awesome for the icons but it's up to you):
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
##### Version 1.2.0
- Model events have now a more appropriate callback associated to them
- Added the 'error' model event and the associated callback that updates the view
- Added support for a new attribute in the model indicating its number of children: use default nbChildren or use your prefererd name and pass it in the options when creating a new TreeView (Ex : nbChildrenAttrName: 'nbSubFiles')
- Visibility of the node's icons is now based on the node's number of children attribute
- Fixed a bug where the expand icon would show (instead of collapse icon) on expanded nodes when initializing a tree with nodes that have children
- Completed tests with http://jasmine.github.io/ for src\js\node.js and src\js\tree.js, they can be found at  test\unit\spec\

##### Version 1.1.0
- Added expand/collapse event
- Removed unselect event
- Selected by default the first element
- Expand/collapse can be triggered when the 'children' field has changed.

##### Version 1.0.0
- Initial commit
