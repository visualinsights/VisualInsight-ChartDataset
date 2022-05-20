import React from 'react';
import {CodeSandboxOutlined} from '@ant-design/icons';

const Header = () => {
    return <div className={"Header"}>
        <CodeSandboxOutlined style={{fontSize: 25}}/>
        <div style={{marginLeft: 10}}>Visual Insight Dataset Generator</div>
    </div>
};

export default Header;
