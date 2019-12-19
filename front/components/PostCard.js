import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover,Modal, Upload } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  ADD_COMMENT_REQUEST,
  LIKE_POST_REQUEST,
  LOAD_COMMENTS_REQUEST,
  RETWEET_REQUEST,
  UNLIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,UPDATE_IMAGES_REQUEST,REMOVE_IMAGE,LOAD_POST_REQUEST
} from '../reducers/post';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import PostEditForm from './PostEditForm';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';


const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [visible, setVisible] = useState(false);
  const [editedContent, setEditContent] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment, updateImage, singlePost } = useSelector(state => state.post);
  const [image, setImage] = useState([]);
  const dispatch = useDispatch();
  const imageInput = useRef();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, []);

  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      },
    });
  }, [me && me.id, commentText]);

  useEffect(() => {
    setCommentText('');
    setEditContent(post.content);
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다!');
    }
    if (liked) { // 좋아요 누른 상태
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else { // 좋아요 안 누른 상태
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [me && me.id, post && post.id]);

  const onFollow = useCallback(userId => () => {
    dispatch({
      type: FOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onUnfollow = useCallback(userId => () => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onRemovePost = useCallback(userId => () => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: userId
    });
  });
  const onUpdate = useCallback(() => {
    dispatch({
      type: LOAD_POST_REQUEST,
      data: post.title
    });
    console.log('post/id',post.title);
    setVisible(true);
    console.log('포스트 카드',singlePost);
  },[visible,singlePost,updateImage]);

  const handleOk = useCallback(() => {
    setVisible(false);

  },[visible]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  },[visible]);

  const onChangeImages = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPDATE_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onEditedContent = useCallback((e) => {
    setEditContent(e.target.value);
    console.log(e.target.value);
    if(e.target.value === null) {
      setEditContent('');
    }
  },[editedContent])

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback(index => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index,
    });
  }, []);

  const onMouseUp = useCallback(() => {
    console.log('마우스 올리기');
    const backgroundcolor = '#fff';
    console.log('updata',updateImage);
  });

  const onMouseOut = useCallback(() => {
    console.log('마우스 내리기');
    const backgroundcolor = '#eee';
  });

  return (
    <div style={{marginBottom:'20px'}}>
      <Card
        cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" onClick={onRetweet} />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={(
              <Button.Group>
                {me && post.UserId === me.id
                  ? (
                    <>
                      <Button type="link" onClick={onUpdate}>수정</Button>
                      <Button type="danger" onClick={onRemovePost(post.id)}>삭제</Button>
                    </>
                  )
                  : <Button>신고</Button>}
              </Button.Group>
            )}
          >
            <Icon type="ellipsis" />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={!me || post.User.id === me.id
          ? null
          : me.Followings && me.Followings.find(v => v.id === post.User.id)
            ? <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
            : <Button onClick={onFollow(post.User.id)}>팔로우</Button>
        }
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <Card.Meta
                avatar={(
                  <Link
                    href={{ pathname: '/user', query: { id: post.Retweet.User.id } }}
                    as={`/user/${post.Retweet.User.id}`}
                  >
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />} // a tag x -> Link
              />
            </Card>
          )
          : (
            <Card.Meta
              avatar={(
                <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
                  <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                </Link>
              )}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />} // a tag x -> Link
            />
          )}
      </Card>
      <Link href={{ pathname: '/post', query: {title : post.title} }} as={`/post/${post.title}`}><a>게시글보기</a></Link>
      <Modal
          title="게시글 수정"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Input.TextArea placeholder="무슨 일이 있었나요?" value={editedContent === null ? null : editedContent} onChange={onEditedContent} />
          <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
          <Button onClick={onClickImageUpload} style={{marginTop:'20px'}}><Icon type="upload"/> Upload</Button>
          <div>
        </div>
          <div>
          {singlePost && singlePost.Images.map((v, i) => (
            <div key={v} style={{ display: 'inline-block',flex:1, justifyContent:'space-around', marginTop:'20px',marginLeft:'10px' }}>
              <img src={`http://localhost:3065/${v.src}`} style={{ width: '7em',height:'5em', flex:1 }} alt={v.src} />
              <div style={{flex:1}}>
                <Icon type="delete" onClick={onRemoveImage(i)}/>
              </div>
            </div>
          ))}
          {updateImage.map((v, i) => (
            <div key={v} style={{ display: 'inline-block',flex:1, justifyContent:'space-around', marginTop:'20px',marginLeft:'10px' }}>
              <img src={`http://localhost:3065/${v}`} style={{ width: '7em',height:'5em', flex:1 }} alt={v} />
              <div style={{flex:1}}>
                <Icon type="delete" onClick={onRemoveImage(i)}/>
              </div>
            </div>
          ))}
        </div> 
      </Modal>
      {commentFormOpened && (
        <>
          {me && me.id
          ?
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>댓글달기</Button>
          </Form>
          :null
           }
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    title : PropTypes.string,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};

export default PostCard;