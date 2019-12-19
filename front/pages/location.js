import React from 'react';
import PropTypes from 'prop-types';
import { REGION_REQUEST } from '../reducers/user';
import { useState, useCallback, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Router from 'next/router';
import {List, Button,Input, Form, Select} from 'antd';
import styled from 'styled-components';
import Link from 'next/link';

    

const Location = () => {
    const { region } = useSelector(state => state.user);
    const [location, setLocation] = useState('');
    const [data , setData] = useState([]);
    const [currentdata, setCurrentdata] = useState('');
    const [locationId, setLocationId] = useState('');
    var vsdata = [];


    const getData = useCallback((e) => {
        if(!e){
            setData([]);
        }
        else{
            region.forEach((r) => {
                if(r.city.indexOf(e)+1 || r.town.indexOf(e)+1){
                    vsdata.push({id:r.id,city: r.city, town:r.town});
                    setData(vsdata);
                }
            });
        }
    },[data,region]) ;

    const handleSearch = useCallback((e) => {
        if(e) {
            setCurrentdata(e);
            setLocation(e);
            getData(e);
        }
        else{
            setLocation('');
        }
    },[location,currentdata, data]);

    const handleChange = useCallback((e) => {
        setLocation(e);
    },[location]);

    const selectClick = useCallback((value) => {
        const city = value.key.substring(value.key.indexOf(0+1),value.key.lastIndexOf('/'));
        const town = value.key.substring(value.key.indexOf('/')+1);
        data.forEach((e) => {
            if(e.town === town && e.city === city){
                Router.push(`/locations/${e.id}`);
            }
        })
        
    },[data]);
    const options = data.map((r) => <Select.Option key={r.id} value={`${r.city}/${r.town}`} onClick={selectClick}>{`${r.city} / ${r.town}`}</Select.Option>);
    return (
        <div style={{ marginTop:'100px' }}>
            <div style={{textAlign:'center'}}>
                <h3 style={{textAlign:'left',marginLeft:'120px'}}>지역선택</h3>
                <Select
                showSearch
                value={location}
                placeholder='지역'
                style={{width:'400px', marginLeft:'20px',marginBottom:'20px'}}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}>
                </Select>
            </div>
            <div>
                <div>
                    <List itemLayout="horizontal" dataSource={data} renderItem={item => (
                    <List.Item>
                        <List.Item.Meta title={item.city} description={item.town} />
                        <Link href={{ pathname: '/locations',query:{id: item.id}}} as={`locations/${item.id}`}><a><Button type="link" htmlType="button" value={item.id}>선택</Button></a></Link>
                    </List.Item>
                    )} >
                    </List>
                </div>
            </div>
        </div>
    );
};

Location.getInitialProps = async ( context ) => {
    context.store.dispatch({
        type: REGION_REQUEST,
        data: context.query.id
    });
    return { id: parseInt(context.query.id, 10)}
};

Location.propTypes = {
    id: PropTypes.number.isRequired
}

export default Location;