'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScroll = getScroll;

var _utils = require('./utils');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getScroll(w, top) {
  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
  var method = 'scroll' + (top ? 'Top' : 'Left');
  if (typeof ret !== 'number') {
    var d = w.document;
    // ie6,7,8 standard mode
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method];
    }
  }
  return ret;
}

function offset(elem) {
  var box = void 0;
  var x = void 0;
  var y = void 0;
  var doc = elem.ownerDocument;
  var body = doc.body;
  var docElem = doc && doc.documentElement;
  box = elem.getBoundingClientRect();
  x = box.left;
  y = box.top;
  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;
  var w = doc.defaultView || doc.parentWindow;
  x += getScroll(w);
  y += getScroll(w, true);
  return {
    left: x, top: y
  };
}

function _componentDidUpdate(component, init) {
  var refs = component.refs;
  var wrapNode = refs.nav || refs.root;
  var containerOffset = offset(wrapNode);
  var inkBarNode = refs.inkBar;
  var activeTab = refs.activeTab;
  var inkBarNodeStyle = inkBarNode.style;
  var tabBarPosition = component.props.tabBarPosition;
  if (init) {
    // prevent mount animation
    inkBarNodeStyle.display = 'none';
  }
  if (activeTab) {
    var tabNode = activeTab;
    var tabOffset = offset(tabNode);
    var transformSupported = (0, _utils.isTransformSupported)(inkBarNodeStyle);
    if (tabBarPosition === 'top' || tabBarPosition === 'bottom') {
      var left = tabOffset.left - containerOffset.left;
      // use 3d gpu to optimize render
      if (transformSupported) {
        (0, _utils.setTransform)(inkBarNodeStyle, 'translate3d(' + left + 'px,0,0)');
        inkBarNodeStyle.width = tabNode.offsetWidth + 'px';
        inkBarNodeStyle.height = '';
      } else {
        inkBarNodeStyle.left = left + 'px';
        inkBarNodeStyle.top = '';
        inkBarNodeStyle.bottom = '';
        inkBarNodeStyle.right = wrapNode.offsetWidth - left - tabNode.offsetWidth + 'px';
      }
    } else {
      var top = tabOffset.top - containerOffset.top;
      if (transformSupported) {
        (0, _utils.setTransform)(inkBarNodeStyle, 'translate3d(0,' + top + 'px,0)');
        inkBarNodeStyle.height = tabNode.offsetHeight + 'px';
        inkBarNodeStyle.width = '';
      } else {
        inkBarNodeStyle.left = '';
        inkBarNodeStyle.right = '';
        inkBarNodeStyle.top = top + 'px';
        inkBarNodeStyle.bottom = wrapNode.offsetHeight - top - tabNode.offsetHeight + 'px';
      }
    }
  }
  inkBarNodeStyle.display = activeTab ? 'block' : 'none';
}

exports["default"] = {
  getDefaultProps: function getDefaultProps() {
    return {
      inkBarAnimated: true
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    _componentDidUpdate(this);
  },
  componentDidMount: function componentDidMount() {
    _componentDidUpdate(this, true);
  },
  getInkBarNode: function getInkBarNode() {
    var _classnames;

    var _props = this.props,
        prefixCls = _props.prefixCls,
        styles = _props.styles,
        inkBarAnimated = _props.inkBarAnimated;

    var className = prefixCls + '-ink-bar';
    var classes = (0, _classnames3["default"])((_classnames = {}, _defineProperty(_classnames, className, true), _defineProperty(_classnames, inkBarAnimated ? className + '-animated' : className + '-no-animated', true), _classnames));
    return _react2["default"].createElement('div', {
      style: styles.inkBar,
      className: classes,
      key: 'inkBar',
      ref: 'inkBar'
    });
  }
};