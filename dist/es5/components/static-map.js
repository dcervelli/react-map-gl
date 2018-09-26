"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styleUtils = require("../utils/style-utils");

var _viewportMercatorProject = _interopRequireDefault(require("viewport-mercator-project"));

var _mapbox = _interopRequireDefault(require("../mapbox/mapbox"));

var _isBrowser = _interopRequireDefault(require("../utils/is-browser"));

var _mapConstraints = require("../utils/map-constraints");

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
var mapboxgl = _isBrowser.default ? require('mapbox-gl') : null;
/* eslint-disable max-len */

var TOKEN_DOC_URL = 'https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens';
var NO_TOKEN_WARNING = 'A valid API access token is required to use Mapbox data';
/* eslint-disable max-len */

function noop() {}

var UNAUTHORIZED_ERROR_CODE = 401;
var propTypes = Object.assign({}, _mapbox.default.propTypes, {
  /** The Mapbox style. A string url or a MapboxGL style Immutable.Map object. */
  mapStyle: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]),

  /** There are known issues with style diffing. As stopgap, add option to prevent style diffing. */
  preventStyleDiffing: _propTypes.default.bool,

  /** Hide invalid token warning even if request fails */
  disableTokenWarning: _propTypes.default.bool,

  /** Whether the map is visible */
  visible: _propTypes.default.bool,

  /** Advanced features */
  // Contraints for displaying the map. If not met, then the map is hidden.
  // Experimental! May be changed in minor version updates.
  visibilityConstraints: _propTypes.default.object
});
var defaultProps = Object.assign({}, _mapbox.default.defaultProps, {
  mapStyle: 'mapbox://styles/mapbox/light-v8',
  preventStyleDiffing: false,
  visible: true
});
var childContextTypes = {
  viewport: _propTypes.default.instanceOf(_viewportMercatorProject.default)
};

var StaticMap =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2.default)(StaticMap, _PureComponent);
  (0, _createClass2.default)(StaticMap, null, [{
    key: "supported",
    value: function supported() {
      return mapboxgl && mapboxgl.supported();
    }
  }]);

  function StaticMap(props) {
    var _this;

    (0, _classCallCheck2.default)(this, StaticMap);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(StaticMap).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "getMap", function () {
      return _this._map;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "queryRenderedFeatures", function (geometry) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _this._map.queryRenderedFeatures(geometry, options);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_mapboxMapLoaded", function (ref) {
      _this._mapboxMap = ref;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_mapboxMapError", function (evt) {
      var statusCode = evt.error && evt.error.status || evt.status;

      if (statusCode === UNAUTHORIZED_ERROR_CODE && !_this.state.accessTokenInvalid) {
        // Mapbox throws unauthorized error - invalid token
        console.error(NO_TOKEN_WARNING); // eslint-disable-line

        _this.setState({
          accessTokenInvalid: true
        });
      }
    });
    _this._queryParams = {};

    if (!StaticMap.supported()) {
      _this.componentDidMount = noop;
      _this.componentWillReceiveProps = noop;
      _this.componentDidUpdate = noop;
      _this.componentWillUnmount = noop;
    }

    _this.state = {
      accessTokenInvalid: false
    };
    return _this;
  }

  (0, _createClass2.default)(StaticMap, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        viewport: new _viewportMercatorProject.default(this.props)
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var mapStyle = this.props.mapStyle;
      this._mapbox = new _mapbox.default(Object.assign({}, this.props, {
        mapboxgl: mapboxgl,
        // Handle to mapbox-gl library
        container: this._mapboxMap,
        onError: this._mapboxMapError,
        mapStyle: (0, _styleUtils.normalizeStyle)(mapStyle)
      }));
      this._map = this._mapbox.getMap();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      this._mapbox.setProps(newProps);

      this._updateMapStyle(this.props, newProps); // this._updateMapViewport(this.props, newProps);
      // Save width/height so that we can check them in componentDidUpdate


      this.setState({
        width: this.props.width,
        height: this.props.height
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // Since Mapbox's map.resize() reads size from DOM
      // we must wait to read size until after render (i.e. here in "didUpdate")
      this._updateMapSize(this.state, this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._mapbox.finalize();

      this._mapbox = null;
      this._map = null;
    } // External apps can access map this way

  }, {
    key: "_updateMapSize",
    // Note: needs to be called after render (e.g. in componentDidUpdate)
    value: function _updateMapSize(oldProps, newProps) {
      var sizeChanged = oldProps.width !== newProps.width || oldProps.height !== newProps.height;

      if (sizeChanged) {
        this._map.resize(); // this._callOnChangeViewport(this._map.transform);

      }
    }
  }, {
    key: "_updateMapStyle",
    value: function _updateMapStyle(oldProps, newProps) {
      var mapStyle = newProps.mapStyle;
      var oldMapStyle = oldProps.mapStyle;

      if (mapStyle !== oldMapStyle) {
        this._map.setStyle((0, _styleUtils.normalizeStyle)(mapStyle), {
          diff: !this.props.preventStyleDiffing
        });
      }
    }
  }, {
    key: "_renderNoTokenWarning",
    value: function _renderNoTokenWarning() {
      if (this.state.accessTokenInvalid && !this.props.disableTokenWarning) {
        var style = {
          position: 'absolute',
          left: 0,
          top: 0
        };
        return (0, _react.createElement)('div', {
          key: 'warning',
          id: 'no-token-warning',
          style: style
        }, [(0, _react.createElement)('h3', {
          key: 'header'
        }, NO_TOKEN_WARNING), (0, _react.createElement)('div', {
          key: 'text'
        }, 'For information on setting up your basemap, read'), (0, _react.createElement)('a', {
          key: 'link',
          href: TOKEN_DOC_URL
        }, 'Note on Map Tokens')]);
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          width = _this$props.width,
          height = _this$props.height,
          style = _this$props.style,
          visibilityConstraints = _this$props.visibilityConstraints;
      var mapContainerStyle = Object.assign({}, style, {
        width: width,
        height: height,
        position: 'relative'
      });
      var visible = this.props.visible && (0, _mapConstraints.checkVisibilityConstraints)(this.props.viewState || this.props, visibilityConstraints);
      var mapStyle = Object.assign({}, style, {
        width: width,
        height: height,
        visibility: visible ? 'visible' : 'hidden'
      });
      var overlayContainerStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: height,
        overflow: 'hidden'
      }; // Note: a static map still handles clicks and hover events

      return (0, _react.createElement)('div', {
        key: 'map-container',
        style: mapContainerStyle,
        children: [(0, _react.createElement)('div', {
          key: 'map-mapbox',
          ref: this._mapboxMapLoaded,
          style: mapStyle,
          className: className
        }), (0, _react.createElement)('div', {
          key: 'map-overlays',
          // Same as interactive map's overlay container
          className: 'overlays',
          style: overlayContainerStyle,
          children: this.props.children
        }), this._renderNoTokenWarning()]
      });
    }
  }]);
  return StaticMap;
}(_react.PureComponent);

exports.default = StaticMap;
StaticMap.displayName = 'StaticMap';
StaticMap.propTypes = propTypes;
StaticMap.defaultProps = defaultProps;
StaticMap.childContextTypes = childContextTypes;
//# sourceMappingURL=static-map.js.map