'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _TabContent = require('./TabContent');

var _TabContent2 = _interopRequireDefault(_TabContent);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactHammerjs = require('react-hammerjs');

var _reactHammerjs2 = _interopRequireDefault(_reactHammerjs);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var RESISTANCE_COEF = 0.6;

function computeIndex(_ref) {
  var maxIndex = _ref.maxIndex;
  var startIndex = _ref.startIndex;
  var delta = _ref.delta;
  var viewSize = _ref.viewSize;

  var index = startIndex + -delta / viewSize;
  if (index < 0) {
    index = Math.exp(index * RESISTANCE_COEF) - 1;
  } else if (index > maxIndex) {
    index = maxIndex + 1 - Math.exp((maxIndex - index) * RESISTANCE_COEF);
  }
  return index;
}

function getIndexByDelta(e) {
  var delta = (0, _utils.isVertical)(this.props.tabBarPosition) ? e.deltaY : e.deltaX;
  var currentIndex = computeIndex({
    maxIndex: this.maxIndex,
    viewSize: this.viewSize,
    startIndex: this.startIndex,
    delta: delta
  });
  var showIndex = delta < 0 ? Math.floor(currentIndex + 1) : Math.floor(currentIndex);
  if (showIndex < 0) {
    showIndex = 0;
  } else if (showIndex > this.maxIndex) {
    showIndex = this.maxIndex;
  }
  if (this.children[showIndex].props.disabled) {
    return undefined;
  }
  return currentIndex;
}

var SwipeableTabContent = _react2["default"].createClass({
  displayName: 'SwipeableTabContent',

  propTypes: {
    tabBarPosition: _react.PropTypes.string,
    onChange: _react.PropTypes.func,
    children: _react.PropTypes.any,
    hammerOptions: _react.PropTypes.any,
    animated: _react.PropTypes.bool,
    activeKey: _react.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animated: true
    };
  },
  componentDidMount: function componentDidMount() {
    this.rootNode = _reactDom2["default"].findDOMNode(this);
  },
  onPanStart: function onPanStart() {
    var _props = this.props;
    var tabBarPosition = _props.tabBarPosition;
    var children = _props.children;
    var activeKey = _props.activeKey;
    var animated = _props.animated;

    var startIndex = this.startIndex = (0, _utils.getActiveIndex)(children, activeKey);
    if (startIndex === -1) {
      return;
    }
    if (animated) {
      (0, _utils.setTransition)(this.rootNode.style, 'none');
    }
    this.startDrag = true;
    this.children = (0, _utils.toArray)(children);
    this.maxIndex = this.children.length - 1;
    this.viewSize = (0, _utils.isVertical)(tabBarPosition) ? this.rootNode.offsetHeight : this.rootNode.offsetWidth;
  },
  onPan: function onPan(e) {
    if (!this.startDrag) {
      return;
    }
    var tabBarPosition = this.props.tabBarPosition;

    var currentIndex = getIndexByDelta.call(this, e);
    if (currentIndex !== undefined) {
      (0, _utils.setTransform)(this.rootNode.style, (0, _utils.getTransformByIndex)(currentIndex, tabBarPosition));
    }
  },
  onPanEnd: function onPanEnd(e) {
    if (!this.startDrag) {
      return;
    }
    this.end(e);
  },
  onSwipe: function onSwipe(e) {
    this.end(e, true);
  },
  end: function end(e, swipe) {
    var _props2 = this.props;
    var tabBarPosition = _props2.tabBarPosition;
    var animated = _props2.animated;

    this.startDrag = false;
    if (animated) {
      (0, _utils.setTransition)(this.rootNode.style, '');
    }
    var currentIndex = getIndexByDelta.call(this, e);
    var finalIndex = this.startIndex;
    if (currentIndex !== undefined) {
      if (currentIndex < 0) {
        finalIndex = 0;
      } else if (currentIndex > this.maxIndex) {
        finalIndex = this.maxIndex;
      } else if (swipe) {
        var delta = (0, _utils.isVertical)(tabBarPosition) ? e.deltaY : e.deltaX;
        finalIndex = delta < 0 ? Math.ceil(currentIndex) : Math.floor(currentIndex);
      } else {
        var floorIndex = Math.floor(currentIndex);
        if (currentIndex - floorIndex > 0.6) {
          finalIndex = floorIndex + 1;
        } else {
          finalIndex = floorIndex;
        }
      }
    }
    if (this.children[finalIndex].props.disabled) {
      return;
    }
    if (this.startIndex === finalIndex) {
      if (animated) {
        (0, _utils.setTransform)(this.rootNode.style, (0, _utils.getTransformByIndex)(finalIndex, this.props.tabBarPosition));
      }
    } else {
      this.props.onChange((0, _utils.getActiveKey)(this.props.children, finalIndex));
    }
  },
  render: function render() {
    var _props3 = this.props;
    var tabBarPosition = _props3.tabBarPosition;
    var hammerOptions = _props3.hammerOptions;
    var animated = _props3.animated;

    var direction = {};
    if ((0, _utils.isVertical)(tabBarPosition)) {
      direction = {
        vertical: true
      };
    }
    var events = {
      onSwipe: this.onSwipe,
      onPanStart: this.onPanStart
    };
    if (animated !== false) {
      events = _extends({}, events, {
        onPan: this.onPan,
        onPanEnd: this.onPanEnd
      });
    }
    return _react2["default"].createElement(
      _reactHammerjs2["default"],
      _extends({}, events, direction, {
        options: hammerOptions
      }),
      _react2["default"].createElement(_TabContent2["default"], this.props)
    );
  }
});

exports["default"] = SwipeableTabContent;
module.exports = exports['default'];