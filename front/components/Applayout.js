import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import Router from 'next/router';
import { LOAD_USER_REQUEST, LOG_OUT_REQUEST } from '../reducers/user';
import styled from 'styled-components';

const AppLayout = ({ children }) => {
  const { isLoggedIn, me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!me) {
      dispatch({
        type: LOAD_USER_REQUEST,
      });
    }
  }, []);

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  const onSearch = (value) => {
    Router.push({ pathname: '/hashtag', query: {tag: value}}, `/hashtag/${value}`)
  }

  return (
    <div>
      <Menu mode="horizontal" >
        <Menu.Item key="home"><Link href="/"><a>생각대로</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search style={{ verticalAlign: 'middle' }} onSearch={onSearch} />
        </Menu.Item>
        <Menu.Item key="image"><Link href="/image"><a>이미지</a></Link></Menu.Item>
        <Menu.Item key="location"><Link href="/location"><a>위치</a></Link></Menu.Item>
        {me ? 
        <Menu.Item key="logout"><Link href="/"><a onClick={onLogout}>로그아웃</a></Link></Menu.Item> : 
        <Menu.Item key="login"><Link href="/login"><a>로그인</a></Link></Menu.Item>}
        {me ? null : 
        <Menu.Item key="signup"><Link href="/signup"><a>회원가입</a></Link></Menu.Item>}
      </Menu>
      <Row gutter={8} type="flex" justify="space-around">
        <Col xs={24} md={6} style={{height: '100%'}}>
        </Col>
        <Col xs={24} md={12} style={{height: '100%',width:'600px'}}>
          {children}
        </Col>
        <Col xs={24} md={6} style={{height: '100%'}}>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;