"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _draggableControl = _interopRequireDefault(require("./draggable-control"));

// Copyright (c) 2015 Uber Technologies, Inc.
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var propTypes = Object.assign({}, _draggableControl.default.propTypes, {
  // Custom className
  className: _propTypes.default.string,
  // Longitude of the anchor point
  longitude: _propTypes.default.number.isRequired,
  // Latitude of the anchor point
  latitude: _propTypes.default.number.isRequired,
  // Offset from the left
  offsetLeft: _propTypes.default.number,
  // Offset from the top
  offsetTop: _propTypes.default.number,
  // Drag and Drop props
  draggable: _propTypes.default.bool,
  onDrag: _propTypes.default.func,
  onDragEnd: _propTypes.default.func,
  onDragStart: _propTypes.default.func
});
var defaultProps = Object.assign({}, _draggableControl.default.defaultProps, {
  className: '',
  offsetLeft: 0,
  offsetTop: 0
});
/*
 * PureComponent doesn't update when context changes.
 * The only way is to implement our own shouldComponentUpdate here. Considering
 * the parent component (StaticMap or InteractiveMap) is pure, and map re-render
 * is almost always triggered by a viewport change, we almost definitely need to
 * recalculate the marker's position when the parent re-renders.
 */

var Marker =
/*#__PURE__*/
function (_DraggableControl) {
  (0, _inherits2.default)(Marker, _DraggableControl);

  function Marker() {
    (0, _classCallCheck2.default)(this, Marker);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Marker).apply(this, arguments));
  }

  (0, _createClass2.default)(Marker, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          longitude = _this$props.longitude,
          latitude = _this$props.latitude,
          offsetLeft = _this$props.offsetLeft,
          offsetTop = _this$props.offsetTop;
      var _this$state = this.state,
          dragPos = _this$state.dragPos,
          dragOffset = _this$state.dragOffset;

      var _ref = dragPos ? this._getDraggedPosition(dragPos, dragOffset) : this.context.viewport.project([longitude, latitude]),
          _ref2 = (0, _slicedToArray2.default)(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      var containerStyle = {
        position: 'absolute',
        left: x + offsetLeft,
        top: y + offsetTop
      };
      return (0, _react.createElement)('div', {
        className: "mapboxgl-marker ".concat(className),
        ref: this._onContainerLoad,
        style: containerStyle,
        children: this.props.children
      });
    }
  }]);
  return Marker;
}(_draggableControl.default);

exports.default = Marker;
Marker.displayName = 'Marker';
Marker.propTypes = propTypes;
Marker.defaultProps = defaultProps;
//# sourceMappingURL=marker.js.map