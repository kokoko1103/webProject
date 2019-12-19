import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import Helmet from 'react-helmet';
import {Container} from 'next/app'

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST, REGION_REQUEST } from '../reducers/user';
import axios from 'axios';

const NodeBird = ({ Component, store, pageProps }) => {
  return (
    <Container>
      <Provider store={store}>
        <Helmet
          title= "일단 가보자"
          htmlAttributes= {{ lang: 'ko' }}
          meta= {[{
            charSet: 'UTF-8'
          },{
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
          },{
            'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
          },{
            name: 'description', content: '지역활성화 SNS'
          },{
            name: 'og.title', content: 'DOUNT'
          },{
            name: 'og.description', content: '지역활성화 SNS'
          },{
            property: 'og.type', content: 'website'
          }]}
          link={[{
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
          }, {
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
          }, {
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
          }]}
        />
        <AppLayout>
          <Component {...pageProps}/>
        </AppLayout>
      </Provider>
    </Container>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired
};

NodeBird.getInitialProps = async (context) => {
  const { ctx } = context;
  let pageProps = {};
  const state = ctx.store.getState();
  const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
  if(ctx.isServer && cookie){
    axios.defaults.headers.Cookie = cookie;
  }
  if(!state.user.me){ //서버쪽에서 데이터를 불러오기
    ctx.store.dispatch({  //ssr을 하기 위한 것
      type: LOAD_USER_REQUEST
    })
  }
  if(context.Component.getInitialProps){
    pageProps = await context.Component.getInitialProps(ctx) || {};
  }
  
  return { pageProps };
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  // const middleware = [sagaMiddleware, (store) => (next) => (action) =>{
  //   console.log(action);
  //   next(action);
  // }]; redux-saga에서 에러터질때 확인하기
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : compose(
      applyMiddleware(...middlewares),
      !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    );
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBird));