import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);
  const onScroll = () => {
    if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight -250){
      if(hasMorePost){
        let lastId = mainPosts[mainPosts.length -1].id;
        if(!countRef.current.includes(lastId)){
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId
          });
          countRef.current.push(lastId);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    mainPosts;
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  },[mainPosts.length]);

  return (
    <div>
      {me && <PostForm />}
      {mainPosts.map((c) => {
        return (
          <PostCard key={c.id} post={c} />
        );
      })}
    </div>
  );
};

Home.getInitialProps = async ( context) => {  //ssr을 하기위해서 사용하는 것이다. next에서 지원해준다.
  console.log(Object.keys(context));
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST
  });
}

export default Home;