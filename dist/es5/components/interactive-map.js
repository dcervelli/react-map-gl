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

var _staticMap = _interopRequireDefault(require("./static-map"));

var _mapState = require("../utils/map-state");

var _viewportMercatorProject = _interopRequireDefault(require("viewport-mercator-project"));

var _transitionManager = _interopRequireDefault(require("../utils/transition-manager"));

var _styleUtils = require("../utils/style-utils");

var _mjolnir = require("mjolnir.js");

var _mapControls = _interopRequireDefault(require("../utils/map-controls"));

var _config = _interopRequireDefault(require("../config"));

var _deprecateWarn = _interopRequireDefault(require("../utils/deprecate-warn"));

var propTypes = Object.assign({}, _staticMap.default.propTypes, {
  // Additional props on top of StaticMap

  /** Viewport constraints */
  // Max zoom level
  maxZoom: _propTypes.default.number,
  // Min zoom level
  minZoom: _propTypes.default.number,
  // Max pitch in degrees
  maxPitch: _propTypes.default.number,
  // Min pitch in degrees
  minPitch: _propTypes.default.number,
  // Callbacks fired when the user interacted with the map. The object passed to the callbacks
  // contains viewport properties such as `longitude`, `latitude`, `zoom` etc.
  onViewStateChange: _propTypes.default.func,
  onViewportChange: _propTypes.default.func,
  onInteractionStateChange: _propTypes.default.func,

  /** Viewport transition **/
  // transition duration for viewport change
  transitionDuration: _propTypes.default.number,
  // TransitionInterpolator instance, can be used to perform custom transitions.
  transitionInterpolator: _propTypes.default.object,
  // type of interruption of current transition on update.
  transitionInterruption: _propTypes.default.number,
  // easing function
  transitionEasing: _propTypes.default.func,
  // transition status update functions
  onTransitionStart: _propTypes.default.func,
  onTransitionInterrupt: _propTypes.default.func,
  onTransitionEnd: _propTypes.default.func,

  /** Enables control event handling */
  // Scroll to zoom
  scrollZoom: _propTypes.default.bool,
  // Drag to pan
  dragPan: _propTypes.default.bool,
  // Drag to rotate
  dragRotate: _propTypes.default.bool,
  // Double click to zoom
  doubleClickZoom: _propTypes.default.bool,
  // Multitouch zoom
  touchZoom: _propTypes.default.bool,
  // Multitouch rotate
  touchRotate: _propTypes.default.bool,
  // Keyboard
  keyboard: _propTypes.default.bool,

  /**
     * Called when the map is hovered over.
     * @callback
     * @param {Object} event - The mouse event.
     * @param {[Number, Number]} event.lngLat - The coordinates of the pointer
     * @param {Array} event.features - The features under the pointer, using Mapbox's
     * queryRenderedFeatures API:
     * https://www.mapbox.com/mapbox-gl-js/api/#Map#queryRenderedFeatures
     * To make a layer interactive, set the `interactive` property in the
     * layer style to `true`. See Mapbox's style spec
     * https://www.mapbox.com/mapbox-gl-style-spec/#layer-interactive
     */
  onHover: _propTypes.default.func,

  /**
    * Called when the map is clicked.
    * @callback
    * @param {Object} event - The mouse event.
    * @param {[Number, Number]} event.lngLat - The coordinates of the pointer
    * @param {Array} event.features - The features under the pointer, using Mapbox's
    * queryRenderedFeatures API:
    * https://www.mapbox.com/mapbox-gl-js/api/#Map#queryRenderedFeatures
    * To make a layer interactive, set the `interactive` property in the
    * layer style to `true`. See Mapbox's style spec
    * https://www.mapbox.com/mapbox-gl-style-spec/#layer-interactive
    */
  onClick: _propTypes.default.func,

  /**
    * Called when the context menu is activated.
    */
  onContextMenu: _propTypes.default.func,

  /** Custom touch-action CSS for the event canvas. Defaults to 'none' */
  touchAction: _propTypes.default.string,

  /** Radius to detect features around a clicked point. Defaults to 0. */
  clickRadius: _propTypes.default.number,

  /** Accessor that returns a cursor style to show interactive state */
  getCursor: _propTypes.default.func,
  // A map control instance to replace the default map controls
  // The object must expose one property: `events` as an array of subscribed
  // event names; and two methods: `setState(state)` and `handle(event)`
  mapControls: _propTypes.default.shape({
    events: _propTypes.default.arrayOf(_propTypes.default.string),
    handleEvent: _propTypes.default.func
  })
});

var getDefaultCursor = function getDefaultCursor(_ref) {
  var isDragging = _ref.isDragging,
      isHovering = _ref.isHovering;
  return isDragging ? _config.default.CURSOR.GRABBING : isHovering ? _config.default.CURSOR.POINTER : _config.default.CURSOR.GRAB;
};

var defaultProps = Object.assign({}, _staticMap.default.defaultProps, _mapState.MAPBOX_LIMITS, _transitionManager.default.defaultProps, {
  onViewStateChange: null,
  onViewportChange: null,
  onClick: null,
  onHover: null,
  onContextMenu: function onContextMenu(event) {
    return event.preventDefault();
  },
  scrollZoom: true,
  dragPan: true,
  dragRotate: true,
  doubleClickZoom: true,
  touchAction: 'none',
  clickRadius: 0,
  getCursor: getDefaultCursor
});
var childContextTypes = {
  viewport: _propTypes.default.instanceOf(_viewportMercatorProject.default),
  isDragging: _propTypes.default.bool,
  eventManager: _propTypes.default.object
};

var InteractiveMap =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2.default)(InteractiveMap, _PureComponent);
  (0, _createClass2.default)(InteractiveMap, null, [{
    key: "supported",
    value: function supported() {
      return _staticMap.default.supported();
    }
  }]);

  function InteractiveMap(props) {
    var _this;

    (0, _classCallCheck2.default)(this, InteractiveMap);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(InteractiveMap).call(this, props)); // Check for deprecated props

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "getMap", function () {
      return _this._map ? _this._map.getMap() : null;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "queryRenderedFeatures", function (geometry, options) {
      return _this._map.queryRenderedFeatures(geometry, options);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_onInteractionStateChange", function (interactionState) {
      var _interactionState$isD = interactionState.isDragging,
          isDragging = _interactionState$isD === void 0 ? false : _interactionState$isD;

      if (isDragging !== _this.state.isDragging) {
        _this.setState({
          isDragging: isDragging
        });
      }

      var onInteractionStateChange = _this.props.onInteractionStateChange;

      if (onInteractionStateChange) {
        onInteractionStateChange(interactionState);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_onViewportChange", function (viewState, interactionState, oldViewState) {
      var onViewStateChange = _this.props.onViewStateChange;
      var onViewportChange = _this.props.onViewportChange || _this.props.onChangeViewport;

      if (onViewStateChange) {
        onViewStateChange({
          viewState: viewState,
          interactionState: interactionState,
          oldViewState: oldViewState
        });
      }

      if (onViewportChange) {
        onViewportChange(viewState, interactionState, oldViewState);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_onMouseMove", function (event) {
      if (!_this.state.isDragging) {
        var pos = _this._getPos(event);

        var features = _this._getFeatures({
          pos: pos,
          radius: _this.props.clickRadius
        });

        var isHovering = features && features.length > 0;

        if (isHovering !== _this.state.isHovering) {
          _this.setState({
            isHovering: isHovering
          });
        }

        if (_this.props.onHover) {
          var viewport = new _viewportMercatorProject.default(_this.props);
          event.lngLat = viewport.unproject(pos);
          event.features = features;

          _this.props.onHover(event);
        }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_onMouseClick", function (event) {
      if (_this.props.onClick) {
        var pos = _this._getPos(event);

        var viewport = new _viewportMercatorProject.default(_this.props);
        event.lngLat = viewport.unproject(pos);
        event.features = _this._getFeatures({
          pos: pos,
          radius: _this.props.clickRadius
        });

        _this.props.onClick(event);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_onContextMenu", function (event) {
      if (_this.props.onContextMenu) {
        _this.props.onContextMenu(event);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_eventCanvasLoaded", function (ref) {
      // This will be called with `null` after unmount, releasing event manager resource
      _this._eventManager.setElement(ref);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_staticMapLoaded", function (ref) {
      _this._map = ref;
    });
    (0, _deprecateWarn.default)(props);
    _this.state = {
      // Whether the cursor is down
      isDragging: false,
      // Whether the cursor is over a clickable feature
      isHovering: false
    }; // If props.mapControls is not provided, fallback to default MapControls instance
    // Cannot use defaultProps here because it needs to be per map instance

    _this._mapControls = props.mapControls || new _mapControls.default();
    _this._eventManager = new _mjolnir.EventManager(null, {
      legacyBlockScroll: false,
      touchAction: props.touchAction
    });

    _this._updateQueryParams(props.mapStyle);

    return _this;
  }

  (0, _createClass2.default)(InteractiveMap, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        viewport: new _viewportMercatorProject.default(this.props),
        isDragging: this.state.isDragging,
        eventManager: this._eventManager
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var eventManager = this._eventManager; // Register additional event handlers for click and hover

      eventManager.on({
        mousemove: this._onMouseMove,
        click: this._onMouseClick,
        contextmenu: this._onContextMenu
      });

      this._setControllerProps(this.props);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps) {
      if (this.props.mapStyle !== nextProps.mapStyle) {
        this._updateQueryParams(nextProps.mapStyle);
      }

      this._setControllerProps(nextProps);
    }
  }, {
    key: "_setControllerProps",
    value: function _setControllerProps(props) {
      props = Object.assign({}, props, props.viewState, {
        isInteractive: Boolean(props.onViewStateChange || props.onViewportChange || props.onChangeViewport),
        onViewportChange: this._onViewportChange,
        onStateChange: this._onInteractionStateChange,
        eventManager: this._eventManager
      });

      this._mapControls.setOptions(props);
    }
  }, {
    key: "_getFeatures",
    value: function _getFeatures(_ref2) {
      var pos = _ref2.pos,
          radius = _ref2.radius;
      var features;

      if (radius) {
        // Radius enables point features, like marker symbols, to be clicked.
        var size = radius;
        var bbox = [[pos[0] - size, pos[1] + size], [pos[0] + size, pos[1] - size]];
        features = this._map.queryRenderedFeatures(bbox, this._queryParams);
      } else {
        features = this._map.queryRenderedFeatures(pos, this._queryParams);
      }

      return features;
    } // Hover and click only query layers whose interactive property is true

  }, {
    key: "_updateQueryParams",
    value: function _updateQueryParams(mapStyle) {
      var interactiveLayerIds = (0, _styleUtils.getInteractiveLayerIds)(mapStyle);
      this._queryParams = {
        layers: interactiveLayerIds
      };
    }
  }, {
    key: "_getPos",
    // HOVER AND CLICK
    value: function _getPos(event) {
      var _event$offsetCenter = event.offsetCenter,
          x = _event$offsetCenter.x,
          y = _event$offsetCenter.y;
      return [x, y];
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height,
          getCursor = _this$props.getCursor;
      var eventCanvasStyle = {
        width: width,
        height: height,
        position: 'relative',
        cursor: getCursor(this.state)
      };
      return (0, _react.createElement)('div', {
        key: 'map-controls',
        ref: this._eventCanvasLoaded,
        style: eventCanvasStyle
      }, (0, _react.createElement)(_staticMap.default, Object.assign({}, this.props, {
        ref: this._staticMapLoaded,
        children: this.props.children
      })));
    }
  }]);
  return InteractiveMap;
}(_react.PureComponent);

exports.default = InteractiveMap;
InteractiveMap.displayName = 'InteractiveMap';
InteractiveMap.propTypes = propTypes;
InteractiveMap.defaultProps = defaultProps;
InteractiveMap.childContextTypes = childContextTypes;
//# sourceMappingURL=interactive-map.js.map