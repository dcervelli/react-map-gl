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
import PropTypes from 'prop-types';
import BaseControl from './base-control';
const propTypes = Object.assign({}, BaseControl.propTypes, {
  draggable: PropTypes.bool,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragStart: PropTypes.func
});
const defaultProps = Object.assign({}, BaseControl.defaultProps, {
  draggable: false
});
export default class DraggableControl extends BaseControl {
  constructor(props) {
    super(props);

    _defineProperty(this, "_onDragStart", event => {
      const _this$props = this.props,
            draggable = _this$props.draggable,
            captureDrag = _this$props.captureDrag;

      if (draggable || captureDrag) {
        event.stopPropagation();
      }

      if (!draggable) {
        return;
      }

      const dragPos = this._getDragEventPosition(event);

      const dragOffset = this._getDragEventOffset(event);

      this.setState({
        dragPos,
        dragOffset
      });

      this._setupDragEvents();

      if (this.props.onDragStart) {
        event.lngLat = this._getDragLngLat(dragPos, dragOffset);
        this.props.onDragStart(event);
      }
    });

    _defineProperty(this, "_onDrag", event => {
      event.stopPropagation();

      const dragPos = this._getDragEventPosition(event);

      this.setState({
        dragPos
      });

      if (this.props.onDrag) {
        event.lngLat = this._getDragLngLat(dragPos, this.state.dragOffset);
        this.props.onDrag(event);
      }
    });

    _defineProperty(this, "_onDragEnd", event => {
      const _this$state = this.state,
            dragPos = _this$state.dragPos,
            dragOffset = _this$state.dragOffset;
      event.stopPropagation();
      this.setState({
        dragPos: null,
        dragOffset: null
      });

      this._removeDragEvents();

      if (this.props.onDragEnd) {
        event.lngLat = this._getDragLngLat(dragPos, dragOffset);
        this.props.onDragEnd(event);
      }
    });

    _defineProperty(this, "_onDragCancel", event => {
      event.stopPropagation();
      this.setState({
        dragPos: null,
        dragOffset: null
      });

      this._removeDragEvents();
    });

    this.state = {
      dragPos: null,
      dragOffset: null
    };
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    this._removeDragEvents();
  }

  _setupDragEvents() {
    const eventManager = this.context.eventManager;

    if (!eventManager) {
      return;
    } // panstart is already attached by parent class BaseControl,
    // here we just add listeners for subsequent drag events


    this._dragEvents = {
      panmove: this._onDrag,
      panend: this._onDragEnd,
      pancancel: this._onDragCancel
    };
    eventManager.on(this._dragEvents);
  }

  _removeDragEvents() {
    const eventManager = this.context.eventManager;

    if (!eventManager || !this._dragEvents) {
      return;
    }

    eventManager.off(this._dragEvents);
    this._dragEvents = null;
  }

  _getDragEventPosition(event) {
    const _event$offsetCenter = event.offsetCenter,
          x = _event$offsetCenter.x,
          y = _event$offsetCenter.y;
    return [x, y];
  }
  /**
   * Returns offset of top-left of marker from drag start event
   * (used for positioning marker relative to next mouse coordinates)
   */


  _getDragEventOffset(event) {
    const _event$center = event.center,
          x = _event$center.x,
          y = _event$center.y;

    const rect = this._containerRef.getBoundingClientRect();

    return [rect.left - x, rect.top - y];
  }

  _getDraggedPosition(dragPos, dragOffset) {
    return [dragPos[0] + dragOffset[0], dragPos[1] + dragOffset[1]];
  }

  _getDragLngLat(dragPos, dragOffset) {
    return this.context.viewport.unproject(this._getDraggedPosition(dragPos, dragOffset));
  }

  render() {
    return null;
  }

}
DraggableControl.propTypes = propTypes;
DraggableControl.defaultProps = defaultProps;
//# sourceMappingURL=draggable-control.js.map