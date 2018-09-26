import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { createElement } from 'react';
import PropTypes from 'prop-types';
import BaseControl from './base-control';
import MapState from '../utils/map-state';
import TransitionManager from '../utils/transition-manager';
import deprecateWarn from '../utils/deprecate-warn';
var LINEAR_TRANSITION_PROPS = Object.assign({}, TransitionManager.defaultProps, {
  transitionDuration: 300
});
var propTypes = Object.assign({}, BaseControl.propTypes, {
  // Custom className
  className: PropTypes.string,
  // Callbacks fired when the user interacted with the map. The object passed to the callbacks
  // contains viewport properties such as `longitude`, `latitude`, `zoom` etc.
  onViewStateChange: PropTypes.func,
  onViewportChange: PropTypes.func,
  // Show/hide compass button
  showCompass: PropTypes.bool,
  // Show/hide zoom buttons
  showZoom: PropTypes.bool
});
var defaultProps = Object.assign({}, BaseControl.defaultProps, {
  className: '',
  onViewStateChange: function onViewStateChange() {},
  onViewportChange: function onViewportChange() {},
  showCompass: true,
  showZoom: true
});
/*
 * PureComponent doesn't update when context changes, so
 * implementing our own shouldComponentUpdate here.
 */

var NavigationControl =
/*#__PURE__*/
function (_BaseControl) {
  _inherits(NavigationControl, _BaseControl);

  function NavigationControl(props) {
    var _this;

    _classCallCheck(this, NavigationControl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NavigationControl).call(this, props)); // Check for deprecated props

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onZoomIn", function () {
      _this._updateViewport({
        zoom: _this.context.viewport.zoom + 1
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onZoomOut", function () {
      _this._updateViewport({
        zoom: _this.context.viewport.zoom - 1
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onResetNorth", function () {
      _this._updateViewport({
        bearing: 0,
        pitch: 0
      });
    });

    deprecateWarn(props);
    return _this;
  }

  _createClass(NavigationControl, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      return this.context.viewport.bearing !== nextContext.viewport.bearing;
    }
  }, {
    key: "_updateViewport",
    value: function _updateViewport(opts) {
      var viewport = this.context.viewport;
      var mapState = new MapState(Object.assign({}, viewport, opts));
      var viewState = Object.assign({}, mapState.getViewportProps(), LINEAR_TRANSITION_PROPS); // Call new style callback

      this.props.onViewStateChange({
        viewState: viewState
      }); // Call old style callback
      // TODO(deprecate): remove this check when `onChangeViewport` gets deprecated

      var onViewportChange = this.props.onChangeViewport || this.props.onViewportChange;
      onViewportChange(viewState);
    }
  }, {
    key: "_renderCompass",
    value: function _renderCompass() {
      var bearing = this.context.viewport.bearing;
      return createElement('span', {
        className: 'mapboxgl-ctrl-compass-arrow',
        style: {
          transform: "rotate(".concat(bearing, "deg)")
        }
      });
    }
  }, {
    key: "_renderButton",
    value: function _renderButton(type, label, callback, children) {
      return createElement('button', {
        key: type,
        className: "mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(type),
        type: 'button',
        title: label,
        onClick: callback,
        children: children
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          showCompass = _this$props.showCompass,
          showZoom = _this$props.showZoom;
      return createElement('div', {
        className: "mapboxgl-ctrl mapboxgl-ctrl-group ".concat(className),
        ref: this._onContainerLoad
      }, [showZoom && this._renderButton('zoom-in', 'Zoom In', this._onZoomIn), showZoom && this._renderButton('zoom-out', 'Zoom Out', this._onZoomOut), showCompass && this._renderButton('compass', 'Reset North', this._onResetNorth, this._renderCompass())]);
    }
  }]);

  return NavigationControl;
}(BaseControl);

export { NavigationControl as default };
NavigationControl.displayName = 'NavigationControl';
NavigationControl.propTypes = propTypes;
NavigationControl.defaultProps = defaultProps;
//# sourceMappingURL=navigation-control.js.map