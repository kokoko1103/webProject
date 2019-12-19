import React, { useCallback } from 'react';
import { Button, List, Card, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import NicknameEditForm from '../components/NicknameEditForm';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';
import UserProfile from '../components/UserProfile';

const Profile = () => {
  const dispatch = useDispatch();
  const { followingList, followerList, hasmoreFollowing, hasmoreFollower, me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);


  const onUnfollow = useCallback(userId => () => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onRemoveFollower = useCallback(userId => () => {
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: userId,
    });
  }, []);

  const onMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset:followingList.length,
    });
  },[followingList.length]);
  
  const onMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  },[followerList.length]);

  return (
    <>
    {
      me && me.id 
      ?
      <div>
        <NicknameEditForm />
        <UserProfile />
        <List
          style={{ marginBottom: '20px' }}
          grid={{ gutter: 4, xs: 2, md: 3 }}
          size="small"
          header={<div>팔로잉 목록</div>}
          loadMore={hasmoreFollowing && <Button style={{ width: '100%' }} onClick={onMoreFollowings}>더 보기</Button>}
          bordered
          dataSource={followingList}
          renderItem={item => (
            <List.Item style={{ marginTop: '20px' }}>
              <Card actions={[<Icon key="stop" type="stop" onClick={onUnfollow(item.id)} />]}>
                <Card.Meta description={item.nickname} />
              </Card>
            </List.Item>
          )}
        />
        <List
          style={{ marginBottom: '20px' }}
          grid={{ gutter: 4, xs: 2, md: 3 }}
          size="small"
          header={<div>팔로워 목록</div>}
          loadMore={hasmoreFollower && <Button style={{ width: '100%' }} onClick ={onMoreFollowers}>더 보기</Button>}
          bordered
          dataSource={followerList}
          renderItem={item => (
            <List.Item style={{ marginTop: '20px' }}>
              <Card actions={[<Icon key="stop" type="stop" onClick={onRemoveFollower(item.id)} />]}>
                <Card.Meta description={item.nickname} />
              </Card>
            </List.Item>
          )}
        />
        <div>
          {mainPosts.map(c => (
            <PostCard key={c.id} post={c} />
          ))}
        </div>
      </div>
      :
      <div>
        <h1>로그인이 필요한 페이지 입니다.</h1>
      </div>
    }
    
    </>
  );
};

Profile.getInitialProps = async (context) => {
  const state = context.store.getState();
  //여기서 LOAD_USER_REQUEST 시작
  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  //여기서 LOAD_USER_SUCCESS해서 me가 여기서 생성된다.
}

export default Profile;