/*
 * jQuery treetable Plugin 3.1.0
 * http://ludo.cubicphuse.nl/jquery-treetable
 *
 * Copyright 2013, Ludo van den Boom
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
 /*global $*/
(function($) {
  'use strict';
  var Node, Tree, methods;

  Node = (function() {
    function Node(row, tree) {
      var parentId;

      this.row = row;
      this.tree = tree;

      this.id = this.row.data('rowId');

      parentId = this.row.data('parentId');
      if (parentId) {
        this.parentId = parentId;
      }
      this.children = [];
      
      if(this.row.find('span')) {
        this.indenterSpan = $(this.row.find('span')[0]);
        this.indenterSpan.addClass('indenter');
      } else {
        this.indenterSpan = $('<span></span>').addClass('indenter');
        $(this.row.children('td')[0]).prepend(this.indenterSpan);
      }
    }

    Node.prototype.parentNode = function() {
      if (this.parentId) {
        return this.tree[this.parentId];
      } else {
        return null;
      }
    };

    Node.prototype.show = function() {
      var ancestors = [],
        node = this.parentNode();

      while (node) {
        ancestors.push(node);
        node = node.parentNode();
      }

      this.indenterSpan[0].style.paddingLeft = '' + (ancestors.length * 19) + 'px';
      this.row.show();
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].show();
      }

      return this;
    };

    return Node;
  })();

  Tree = (function() {
    function Tree() {
      this.tree = {};
      this.nodes = [];
      this.roots = [];
    }

    Tree.prototype.loadRows = function(rows) {
      if (rows) {
        for (var i = 0; i < rows.length; i++) {
          if ($(rows[i]).data('rowId')) {
            var node = new Node($(rows[i]), this.tree);
            this.nodes.push(node);
            this.tree[node.id] = node;

            if (node.parentId && this.tree[node.parentId]) {
              this.tree[node.parentId].children.push(node);
            } else {
              this.roots.push(node);
            }
          }
        }
      }
      return this;
    };

    return Tree;
  })();

  methods = {
    init: function() {
      return this.each(function() {
        var el = $(this),
          tree = new Tree();

        tree.loadRows(this.rows);
        for (var i = 0 ; i < tree.roots.length; i++) {
        	tree.roots[i].show();
        }
        el.addClass('treetable').data('treetable', tree);
        
        return el;
      });
    }
  };

  $.fn.treetable = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
  };
})($);
