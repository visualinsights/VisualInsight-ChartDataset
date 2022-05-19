import React from 'react';
import {FundOutlined} from '@ant-design/icons';

const Header = () => {
    return <div className={"Header"}>
        <FundOutlined width={80} height={80}/>
        <div style={{marginLeft: 10}}>Visual Insight Dataset Generator</div>
    </div>
};

export default Header;
