import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import StaticMap from './static-map';
import { MAPBOX_LIMITS } from '../utils/map-state';
import WebMercatorViewport from 'viewport-mercator-project';
import TransitionManager from '../utils/transition-manager';
import { getInteractiveLayerIds } from '../utils/style-utils';
import { EventManager } from 'mjolnir.js';
import MapControls from '../utils/map-controls';
import config from '../config';
import deprecateWarn from '../utils/deprecate-warn';
var propTypes = Object.assign({}, StaticMap.propTypes, {
  // Additional props on top of StaticMap

  /** Viewport constraints */
  // Max zoom level
  maxZoom: PropTypes.number,
  // Min zoom level
  minZoom: PropTypes.number,
  // Max pitch in degrees
  maxPitch: PropTypes.number,
  // Min pitch in degrees
  minPitch: PropTypes.number,
  // Callbacks fired when the user interacted with the map. The object passed to the callbacks
  // contains viewport properties such as `longitude`, `latitude`, `zoom` etc.
  onViewStateChange: PropTypes.func,
  onViewportChange: PropTypes.func,
  onInteractionStateChange: PropTypes.func,

  /** Viewport transition **/
  // transition duration for viewport change
  transitionDuration: PropTypes.number,
  // TransitionInterpolator instance, can be used to perform custom transitions.
  transitionInterpolator: PropTypes.object,
  // type of interruption of current transition on update.
  transitionInterruption: PropTypes.number,
  // easing function
  transitionEasing: PropTypes.func,
  // transition status update functions
  onTransitionStart: PropTypes.func,
  onTransitionInterrupt: PropTypes.func,
  onTransitionEnd: PropTypes.func,

  /** Enables control event handling */
  // Scroll to zoom
  scrollZoom: PropTypes.bool,
  // Drag to pan
  dragPan: PropTypes.bool,
  // Drag to rotate
  dragRotate: PropTypes.bool,
  // Double click to zoom
  doubleClickZoom: PropTypes.bool,
  // Multitouch zoom
  touchZoom: PropTypes.bool,
  // Multitouch rotate
  touchRotate: PropTypes.bool,
  // Keyboard
  keyboard: PropTypes.bool,

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
  onHover: PropTypes.func,

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
  onClick: PropTypes.func,

  /**
    * Called when the context menu is activated.
    */
  onContextMenu: PropTypes.func,

  /** Custom touch-action CSS for the event canvas. Defaults to 'none' */
  touchAction: PropTypes.string,

  /** Radius to detect features around a clicked point. Defaults to 0. */
  clickRadius: PropTypes.number,

  /** Accessor that returns a cursor style to show interactive state */
  getCursor: PropTypes.func,
  // A map control instance to replace the default map controls
  // The object must expose one property: `events` as an array of subscribed
  // event names; and two methods: `setState(state)` and `handle(event)`
  mapControls: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string),
    handleEvent: PropTypes.func
  })
});

var getDefaultCursor = function getDefaultCursor(_ref) {
  var isDragging = _ref.isDragging,
      isHovering = _ref.isHovering;
  return isDragging ? config.CURSOR.GRABBING : isHovering ? config.CURSOR.POINTER : config.CURSOR.GRAB;
};

var defaultProps = Object.assign({}, StaticMap.defaultProps, MAPBOX_LIMITS, TransitionManager.defaultProps, {
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
  viewport: PropTypes.instanceOf(WebMercatorViewport),
  isDragging: PropTypes.bool,
  eventManager: PropTypes.object
};

var InteractiveMap =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(InteractiveMap, _PureComponent);

  _createClass(InteractiveMap, null, [{
    key: "supported",
    value: function supported() {
      return StaticMap.supported();
    }
  }]);

  function InteractiveMap(props) {
    var _this;

    _classCallCheck(this, InteractiveMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InteractiveMap).call(this, props)); // Check for deprecated props

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getMap", function () {
      return _this._map ? _this._map.getMap() : null;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "queryRenderedFeatures", function (geometry, options) {
      return _this._map.queryRenderedFeatures(geometry, options);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onInteractionStateChange", function (interactionState) {
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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onViewportChange", function (viewState, interactionState, oldViewState) {
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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onMouseMove", function (event) {
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
          var viewport = new WebMercatorViewport(_this.props);
          event.lngLat = viewport.unproject(pos);
          event.features = features;

          _this.props.onHover(event);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onMouseClick", function (event) {
      if (_this.props.onClick) {
        var pos = _this._getPos(event);

        var viewport = new WebMercatorViewport(_this.props);
        event.lngLat = viewport.unproject(pos);
        event.features = _this._getFeatures({
          pos: pos,
          radius: _this.props.clickRadius
        });

        _this.props.onClick(event);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onContextMenu", function (event) {
      if (_this.props.onContextMenu) {
        _this.props.onContextMenu(event);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_eventCanvasLoaded", function (ref) {
      // This will be called with `null` after unmount, releasing event manager resource
      _this._eventManager.setElement(ref);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_staticMapLoaded", function (ref) {
      _this._map = ref;
    });

    deprecateWarn(props);
    _this.state = {
      // Whether the cursor is down
      isDragging: false,
      // Whether the cursor is over a clickable feature
      isHovering: false
    }; // If props.mapControls is not provided, fallback to default MapControls instance
    // Cannot use defaultProps here because it needs to be per map instance

    _this._mapControls = props.mapControls || new MapControls();
    _this._eventManager = new EventManager(null, {
      legacyBlockScroll: false,
      touchAction: props.touchAction
    });

    _this._updateQueryParams(props.mapStyle);

    return _this;
  }

  _createClass(InteractiveMap, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        viewport: new WebMercatorViewport(this.props),
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
      var interactiveLayerIds = getInteractiveLayerIds(mapStyle);
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
      return createElement('div', {
        key: 'map-controls',
        ref: this._eventCanvasLoaded,
        style: eventCanvasStyle
      }, createElement(StaticMap, Object.assign({}, this.props, {
        ref: this._staticMapLoaded,
        children: this.props.children
      })));
    }
  }]);

  return InteractiveMap;
}(PureComponent);

export { InteractiveMap as default };
InteractiveMap.displayName = 'InteractiveMap';
InteractiveMap.propTypes = propTypes;
InteractiveMap.defaultProps = defaultProps;
InteractiveMap.childContextTypes = childContextTypes;
//# sourceMappingURL=interactive-map.js.map