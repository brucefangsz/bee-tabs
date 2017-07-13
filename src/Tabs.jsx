import React, { PropTypes } from 'react';
import KeyCode from './KeyCode';
import TabPane from './TabPane';
import classnames from 'classnames';

function noop() {
}

function getDefaultActiveKey(props) {
  let activeKey;
  React.Children.forEach(props.children, (child) => {
    if (child && !activeKey && !child.props.disabled) {
      activeKey = child.key;
    }
  });
  return activeKey;
}

const Tabs = React.createClass({
  propTypes: {
    destroyInactiveTabPane: PropTypes.bool,
    renderTabBar: PropTypes.func.isRequired,
    renderTabContent: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    children: PropTypes.any,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    tabBarPosition: PropTypes.string,
    style: PropTypes.object,
    tabBarStyle: PropTypes.oneOf(['simple','fill','slide','turn','fade','fadeup']),
  },

  getDefaultProps() {
    return {
      prefixCls: 'u-tabs',
      destroyInactiveTabPane: false,
      onChange: noop,
      tabBarPosition: 'top',
      style: {},
      tabBarStyle: 'simple'
    };
  },

  getInitialState() {
    const props = this.props;
    let activeKey;
    if ('activeKey' in props) {
      activeKey = props.activeKey;
    } else if ('defaultActiveKey' in props) {
      activeKey = props.defaultActiveKey;
    } else {
      activeKey = getDefaultActiveKey(props);
    }
    return {
      activeKey,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('activeKey' in nextProps) {
      this.setState({
        activeKey: nextProps.activeKey,
      });
    }
  },

  onTabClick(activeKey) {
    if (this.tabBar.props.onTabClick) {
      this.tabBar.props.onTabClick(activeKey);
    }
    this.setActiveKey(activeKey);
  },

  onNavKeyDown(e) {
    const eventKeyCode = e.keyCode;
    if (eventKeyCode === KeyCode.RIGHT || eventKeyCode === KeyCode.DOWN) {
      e.preventDefault();
      const nextKey = this.getNextActiveKey(true);
      this.onTabClick(nextKey);
    } else if (eventKeyCode === KeyCode.LEFT || eventKeyCode === KeyCode.UP) {
      e.preventDefault();
      const previousKey = this.getNextActiveKey(false);
      this.onTabClick(previousKey);
    }
  },

  setActiveKey(activeKey) {
    if (this.state.activeKey !== activeKey) {
      if (!('activeKey' in this.props)) {
        this.setState({
          activeKey,
        });
      }
      this.props.onChange(activeKey);
    }
  },

  getNextActiveKey(next) {
    const activeKey = this.state.activeKey;
    const children = [];
    React.Children.forEach(this.props.children, (c) => {
      if (c && !c.props.disabled) {
        if (next) {
          children.push(c);
        } else {
          children.unshift(c);
        }
      }
    });
    const length = children.length;
    let ret = length && children[0].key;
    children.forEach((child, i) => {
      if (child.key === activeKey) {
        if (i === length - 1) {
          ret = children[0].key;
        } else {
          ret = children[i + 1].key;
        }
      }
    });
    return ret;
  },

  render() {
    const props = this.props;
    const {
      prefixCls,
      tabBarPosition, className,
      renderTabContent,
      renderTabBar,
      tabBarStyle,
    } = props;
    const cls = classnames({
      [prefixCls]: 1,
      [`${prefixCls}-${tabBarPosition}`]: 1,
      [className]: !!className,
      [`${prefixCls}-${tabBarStyle}`]: 1,
    });

    this.tabBar = renderTabBar();
    const contents = [
      React.cloneElement(this.tabBar, {
        prefixCls,
        key: 'tabBar',
        onKeyDown: this.onNavKeyDown,
        tabBarPosition,
        onTabClick: this.onTabClick,
        panels: props.children,
        activeKey: this.state.activeKey,
      }),
      React.cloneElement(renderTabContent(), {
        prefixCls,
        tabBarPosition,
        activeKey: this.state.activeKey,
        destroyInactiveTabPane: props.destroyInactiveTabPane,
        children: props.children,
        onChange: this.setActiveKey,
        key: 'tabContent',
      }),
    ];
    if (tabBarPosition === 'bottom') {
      contents.reverse();
    }
    return (
      <div
        className={cls}
        style={props.style}
      >
        {contents}
      </div>
    );
  },
});

Tabs.TabPane = TabPane;

export default Tabs;