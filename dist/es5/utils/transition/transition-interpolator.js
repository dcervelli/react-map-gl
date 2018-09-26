"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _math = require("math.gl");

var _assert = _interopRequireDefault(require("../assert"));

var TransitionInterpolator =
/*#__PURE__*/
function () {
  function TransitionInterpolator() {
    (0, _classCallCheck2.default)(this, TransitionInterpolator);
  }

  (0, _createClass2.default)(TransitionInterpolator, [{
    key: "arePropsEqual",

    /**
     * Checks if two sets of props need transition in between
     * @param currentProps {object} - a list of viewport props
     * @param nextProps {object} - a list of viewport props
     * @returns {bool} - true if two props are equivalent
     */
    value: function arePropsEqual(currentProps, nextProps) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (this.propNames || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (!(0, _math.equals)(currentProps[key], nextProps[key])) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }
    /**
     * Called before transition starts to validate/pre-process start and end props
     * @param startProps {object} - a list of starting viewport props
     * @param endProps {object} - a list of target viewport props
     * @returns {Object} {start, end} - start and end props to be passed
     *   to `interpolateProps`
     */

  }, {
    key: "initializeProps",
    value: function initializeProps(startProps, endProps) {
      return {
        start: startProps,
        end: endProps
      };
    }
    /**
     * Returns viewport props in transition
     * @param startProps {object} - a list of starting viewport props
     * @param endProps {object} - a list of target viewport props
     * @param t {number} - a time factor between [0, 1]
     * @returns {object} - a list of interpolated viewport props
     */

  }, {
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      (0, _assert.default)(false, 'interpolateProps is not implemented');
    }
  }]);
  return TransitionInterpolator;
}();

exports.default = TransitionInterpolator;
//# sourceMappingURL=transition-interpolator.js.map