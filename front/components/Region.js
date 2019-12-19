import React from 'react';
import {List, Button} from 'antd';
const Region = ({region}) => {
    console.log('region', region);
    
    return(
        <>
        <List itemLayout="horizontal">
            <List.Item>
                <List.Item.Meta title={region.city} description={region.town} />
                <Button type="link" htmlType="button" value={region.id}>선택</Button>
            </List.Item>
        </List>
        </>
    );
};

export default Region;