'use strict';

var ood = require('js-ood');
var dagred3 = require('dagre-d3');

function Renderer() {
}

Renderer.prototype.model = function (value) {
    if (value instanceof ood.Model || value === null) {
        this._model = value;
    }

    return this._model;
};

Renderer.prototype.init = function (canvas) {
    // Check if svg canvas
    this.diagram = new dagred3.Digraph();
    this.dagre = new dagred3.Renderer();
    this.canvas = canvas;
    this.layout = dagred3.layout().rankDir('BT');
};

Renderer.prototype.clear = function (wipe_model) {
    if (wipe_model) {
        this.model(null);
    }
};

Renderer.prototype.connect = function (child, parent, type) {
    this.diagram.addEdge(null, child, parent, {class: 'ood-edge ood-' + type});
};

Renderer.prototype.update = function (model) {
    if (typeof model === 'undefined' && this.model()) {
        this.update(this.model());
    } else {
        this.clear(); 

        var entries = {};

        // Create the nodes for packages, clases, and interfaces
        var make_nodes = function (mn, path) {
            for (var key in mn) {

                var entry = mn[key];
                path = path || '';
                var prefix = path.length > 0 ? path + '.' : '';

                // Create the node
                this.diagram.addNode(prefix + key, {label: key, class: 'ood-' + this.model().type_of(entry)});

                if (prefix.length > 0) {
                    this.connect(prefix + key, path, 'contains');
                }

                if (this.model().type_of(entry) === 'package') {
                    make_nodes(entry, prefix + key);
                } else {
                    entries[prefix + key] = entry;
                }
            }
        }.bind(this);
        make_nodes(model.root);

        // Create the edges for package children, extends, and implements
        // This is done here so that we can make certain all nodes exist
        for (var e in entries) {
            var en = entries[e];
            if (en.extends) {
                en.extends.forEach(function (p) {
                    this.connect(e, p, 'extends'); 
                }.bind(this));
            }

            if (en.implements) {
                en.implements.forEach(function (i) {
                    this.connect(e, i, 'implements');
                }.bind(this));
            }
        }
        

        // Setup renderer overrides
        var oldDrawNodes = this.dagre.drawNodes();
        this.dagre.drawNodes(function (graph, root) {
            var nodes = oldDrawNodes(graph, root);
            nodes.each(function(u) {
                if (graph.node(u).class) {
                    d3.select(this).classed(graph.node(u).class + ' ood-node', true);
                }
            });
            return nodes;
        });

        var oldDrawEdges = this.dagre.drawEdgePaths();
        this.dagre.drawEdgePaths(function(graph, root) { 
            var edges = oldDrawEdges(graph, root);
            edges.each(function(e) {
                if (graph.edge(e).class) {
                    d3.select(this).classed(graph.edge(e).class, true);
                    if (graph.edge(e).class.contains('ood-contains')) {
                        d3.select(this).select('path').attr('marker-end', '');
                    }
                }
            });
            return edges;
        });


        this.dagre.layout(this.layout).run(this.diagram, this.canvas);
    }
};

module.exports = Renderer;
