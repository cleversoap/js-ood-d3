'use strict';

var ood = require('js-ood');
var dagred3 = require('dagre-d3');

// TODO: Dagre-d3 renderer

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

Renderer.prototype.update = function (model) {
    if (typeof model === 'undefined' && this.model()) {
        this.update(this.model());
    } else {
        this.clear(); 
        // Iterate for properties
        // check for class or interface
        // otherwise package so go one level down

        this.diagram.addNode('hello', {label: 'soap', class: 'ood-class'});

        // Setup renderer overrides
        var oldDrawNodes = this.dagre.drawNodes();
        this.dagre.drawNodes(function (graph, root) {
            var nodes = oldDrawNodes(graph, root);
            nodes.each(function(u) {
                if (graph.node(u).class) {
                    d3.select(this).classed(graph.node(u).class, true);
                }
            });
            return nodes;
        });

        /*
        var drawEdgePaths = this.dagre.drawEdgePaths();
        this.dagre.drawEdgePaths(function (graph, root) {
            return drawEdgePaths(graph, root).map(function (e) {
                if (graph.edge(e).class) {
                    d3.select(this).classed(graph.edge(e).class, true);
                    if (graph.edge(e).class === 'ood-package') {
                        d3.select(this).select('path').attr('marker-end', '');
                    }
                }
            });
        });*/

        this.dagre.layout(this.layout).run(this.diagram, this.canvas);
    }
};

module.exports = Renderer;
