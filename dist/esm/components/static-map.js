import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
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
import { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { normalizeStyle } from '../utils/style-utils';
import WebMercatorViewport from 'viewport-mercator-project';
import Mapbox from '../mapbox/mapbox';
import isBrowser from '../utils/is-browser';
import { checkVisibilityConstraints } from '../utils/map-constraints';
var mapboxgl = isBrowser ? require('mapbox-gl') : null;
/* eslint-disable max-len */

var TOKEN_DOC_URL = 'https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens';
var NO_TOKEN_WARNING = 'A valid API access token is required to use Mapbox data';
/* eslint-disable max-len */

function noop() {}

var UNAUTHORIZED_ERROR_CODE = 401;
var propTypes = Object.assign({}, Mapbox.propTypes, {
  /** The Mapbox style. A string url or a MapboxGL style Immutable.Map object. */
  mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  /** There are known issues with style diffing. As stopgap, add option to prevent style diffing. */
  preventStyleDiffing: PropTypes.bool,

  /** Hide invalid token warning even if request fails */
  disableTokenWarning: PropTypes.bool,

  /** Whether the map is visible */
  visible: PropTypes.bool,

  /** Advanced features */
  // Contraints for displaying the map. If not met, then the map is hidden.
  // Experimental! May be changed in minor version updates.
  visibilityConstraints: PropTypes.object
});
var defaultProps = Object.assign({}, Mapbox.defaultProps, {
  mapStyle: 'mapbox://styles/mapbox/light-v8',
  preventStyleDiffing: false,
  visible: true
});
var childContextTypes = {
  viewport: PropTypes.instanceOf(WebMercatorViewport)
};

var StaticMap =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(StaticMap, _PureComponent);

  _createClass(StaticMap, null, [{
    key: "supported",
    value: function supported() {
      return mapboxgl && mapboxgl.supported();
    }
  }]);

  function StaticMap(props) {
    var _this;

    _classCallCheck(this, StaticMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StaticMap).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getMap", function () {
      return _this._map;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "queryRenderedFeatures", function (geometry) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _this._map.queryRenderedFeatures(geometry, options);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_mapboxMapLoaded", function (ref) {
      _this._mapboxMap = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_mapboxMapError", function (evt) {
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

  _createClass(StaticMap, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        viewport: new WebMercatorViewport(this.props)
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var mapStyle = this.props.mapStyle;
      this._mapbox = new Mapbox(Object.assign({}, this.props, {
        mapboxgl: mapboxgl,
        // Handle to mapbox-gl library
        container: this._mapboxMap,
        onError: this._mapboxMapError,
        mapStyle: normalizeStyle(mapStyle)
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
        this._map.setStyle(normalizeStyle(mapStyle), {
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
        return createElement('div', {
          key: 'warning',
          id: 'no-token-warning',
          style: style
        }, [createElement('h3', {
          key: 'header'
        }, NO_TOKEN_WARNING), createElement('div', {
          key: 'text'
        }, 'For information on setting up your basemap, read'), createElement('a', {
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
      var visible = this.props.visible && checkVisibilityConstraints(this.props.viewState || this.props, visibilityConstraints);
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

      return createElement('div', {
        key: 'map-container',
        style: mapContainerStyle,
        children: [createElement('div', {
          key: 'map-mapbox',
          ref: this._mapboxMapLoaded,
          style: mapStyle,
          className: className
        }), createElement('div', {
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
}(PureComponent);

export { StaticMap as default };
StaticMap.displayName = 'StaticMap';
StaticMap.propTypes = propTypes;
StaticMap.defaultProps = defaultProps;
StaticMap.childContextTypes = childContextTypes;
//# sourceMappingURL=static-map.js.map