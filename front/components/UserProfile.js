import { Avatar, Card, Button, Modal, List } from 'antd';
import React, { useCallback, useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [followingVisible, setFollowingVisible] = useState(false);
  const [followerVisible, setFollowerVisible] = useState(false);

  const onPost = useCallback(() => {
    setVisible(true);
  },[]);

  const postCancel = useCallback(() => {
    setVisible(false);
  },[]); 

  const onFollowing = useCallback(() =>{
    setFollowingVisible(true);
  },[]);

  const onFollower = useCallback(() => {
    setFollowerVisible(true);
  },[]);

  const followingCancel = useCallback(() =>{
    setFollowingVisible(false);
  },[]);

  const followerCancel = useCallback(() =>{
    setFollowerVisible(false);
  },[]);

  return (
    <div>
      <Card
      actions={[
        <div key="post" onClick={onPost}>포스트<br/>{me.Posts.length}</div>,
        <div key="following" onClick={onFollowing}>팔로우 <br/> {me.Followings.length}</div>, // 내가 팔로우 한 사람들
        <div key="follower" onClick={onFollower}>팔로워 <br/> {me.Followers.length}</div> //나에게 팔로우한사람들
      ]}
      style={{marginBottom:'20px'}}
      >
        <Card.Meta
          avatar={<Avatar>{me.nickname[0]}</Avatar>}
          title={me.nickname}
        />
      </Card>
      <Modal
        title="내가 올린 게시글"
        visible={visible}
        onCancel={postCancel}
        footer={null}
      >
        <p>가나다라마알바달아라</p>
      </Modal>
      <Modal
        title="팔로우"
        visible={followingVisible}
        onCancel={followingCancel}
        footer={null}
      >
        <List dataSource={me.Followings} renderItem={item => (
          <List.Item key={item.id}>
            <List.Item.Meta 
              avatar = {<Avatar>{item.nickname[0]}</Avatar>}
              title = {item.nickname}
            />
            <Button type="link">팔로우하기</Button>
          </List.Item>
        )} >

        </List>
      </Modal>
      <Modal
        title="팔로워"
        visible={followerVisible}
        onCancel={followerCancel}
        footer={null}
      >
        <List dataSource={me.Followers} renderItem={item => (
          <List.Item key={item.id}>
            <List.Item.Meta 
              avatar= { <Avatar>{item.nickname[0]}</Avatar> }
              title = {item.nickname}
            />
            <Button type="link" >언팔로워</Button>
          </List.Item>
        )} ></List>
      </Modal>
    </div>
  );
};

export default UserProfile;