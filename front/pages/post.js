import React,{useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import {Card, Avatar, Button, Icon} from 'antd'
import { LOAD_POST_REQUEST } from '../reducers/post';
import Slick from 'react-slick';
import Link from 'next/link';


const Post = ({title}) => {
    const {singlePost} = useSelector(state => state.post);

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        singlePost;
    },[singlePost]);
    return (
        <>
        {singlePost && 
        
        ( <>
        <Helmet 
            title={`${singlePost.User.nickname}님의 글입니다.`}
            description={singlePost.content}
            meta={[{
                name: 'description', content: singlePost.content
            },{
                property: 'op.title', content: `${singlePost.User.nickname}님의 게시글입니다.` 
            },{
                property: 'op.description', content: singlePost.content
            },{
                property: 'op.img', content: singlePost.Images[0] && `http://localhost:3065/${singlePost.Images[0].src}`
            },{
                property: 'op.url', content: `http://localhost:1103/post/${title}`
            }]}
        />
        <div>
            <Slick
                initialSlide={0}
                afterChange={slide => setCurrentSlide(slide)}
                infinite={false}
                arrows
                alidesToShow={1}
                slidesToScroll={1}
            >
                {singlePost.Images.map((v) => {
                    return(
                        <div key={v} style={{ padding: 32, textAlign: 'center',width:'450px',marginTop:'30px' }}>
                            <img src={`http://localhost:3065/${v.src}`} style={{ margin: '0 auto', width:'450px', marginTop:'20px' }} alt={v} /> 
                        </div>
                    )
                })}
            </Slick>
        </div>
        <div>
            <Card
                title={(
                    <>
                    <Link
                        href={{ pathname: '/user', query:{id: singlePost.User.id} }}
                        as={`/user/${singlePost.User.id}`}><a><Avatar>{singlePost.User.nickname[0]}</Avatar></a></Link>
                    
                    <div>{singlePost.User.nickname}</div>
                    </>
                )}
                extra={<Icon type="ellipsis"></Icon>}
            >
                <div style={{ flex:1, flexDirection:'row'}}>
                    <Avatar style={{ flex:1}}>{singlePost.User.nickname[0]}</Avatar>
                    <div style={{ flex: 3 }}><span>{singlePost.User.nickname}</span>{singlePost.content}</div>
                </div>
            </Card>
        </div>
        </>
        )}
        </>
    )
}

Post.getInitialProps = async ( context ) => {
    console.log('title',context.query.title);
    console.log('data', context.query);
    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.query.title
    });
    return { title: context.query.title}
};

Post.propTypes = {
    title: PropTypes.string.isRequired
}

export default Post;
