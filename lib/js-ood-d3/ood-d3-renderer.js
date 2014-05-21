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
};

Renderer.prototype.clear = function (wipe_model) {
    if (wipe_model) {
        this.model(null);
    }
};

Renderer.prototype.update = function (model) {
    if (typeof model === 'undefined') {
        this.update(this.model());
    } else {
        // Iterate for properties
        // check for class or interface
        // otherwise package so go one level down
    }
};

module.exports = Renderer();
