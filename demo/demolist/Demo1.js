/**
 *
 * @title 基础tab1
 * @description
 *
 */

import React, { Component } from 'react';
import Tabs, { TabPane } from '../../src';

var callback = function(key){
    console.log(key)
}


class Demo1 extends Component {
    constructor(props) {
        super(props)
    }
    render() {

        return (
            <Tabs
                defaultActiveKey="2"
                onChange={callback}
                tabBarStyle="simple"
                >
                <TabPane tab='tab 1' key="1">1</TabPane>
                <TabPane tab='tab 2' key="2">2</TabPane>
                <TabPane tab='tab 3' key="3">3</TabPane>
                <TabPane tab='tab 4' key="4">4</TabPane>
            </Tabs>
        )
    }
}


export default Demo1;