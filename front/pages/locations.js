import React,{useRef, useEffect} from 'react';
import PropTypes from 'prop-types'
import {useSelector, useDispatch} from 'react-redux'
import { LOAD_LOCATION_POSTS_REQUEST } from '../reducers/post';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const locations = ({id}) => {
    const {me} = useSelector(state => state.user);
    const {mainPosts, hasMorePost} = useSelector(state => state.post);
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
        return () => {
          window.removeEventListener('scroll', onScroll);
        }
      },[mainPosts.length]);
    return (
        <div>
            <div>
                {me && id === me.RegionId 
                ? <PostForm/>
                : null
                }
            </div>
            <div>
                {mainPosts.map((v) => {
                    return(
                        <PostCard key={v.id}  post={v}/>
                    )
                })}
            </div>
        </div>
    )
}

locations.getInitialProps = async( context ) =>{
    console.log('context.query',context);
    context.store.dispatch({
        type: LOAD_LOCATION_POSTS_REQUEST,
        data: context.query.id
    });
    return {id : parseInt(context.query.id, 10)}
};

locations.PropTypes = {
    id: PropTypes.number.isRequired
}

export default locations;