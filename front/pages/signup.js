import React, { useCallback, useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, List, Select } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { SIGN_UP_REQUEST, REGION_REQUEST } from '../reducers/user';
import Region from '../components/Region';


const TextInput = ({ value }) => (
  <div>{value}</div>
);

TextInput.propTypes = {
  value: PropTypes.string,
};

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [signupNext, setSignupNext] = useState(false);
  const dispatch = useDispatch();
  const { isSigningUp, me, region } = useSelector(state => state.user);
  const [location, setLocation] = useState('');
  const [data, setData] = useState([]);
  const [currentdata, setCurrentdata] = useState('');
  var vsdata = [];

  useEffect(() => {
    if (me) {
      alert('로그인했으니 메인페이지로 이동합니다.');
      Router.push('/');
    }
  }, [me && me.id]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        userId:id,
        password,
        nickname:nick,
        location:location,
      },
    });
    Router.push('/login');
  }, [id, nick, password, passwordCheck, term, location]);

  const signupNextCheck = useCallback((e) => {
    e.preventDefault();
    if(!signupNext){
      return setSignupNext(true);
    }
  }, [signupNext]);
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [password]);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);
  const onLocation = useCallback((e) =>{
    e.preventDefault();
    setLocation(e.target.value);
    console.log(e.target.value);
  },[location]);
  if(me){
    return null;
  }
  const getData = useCallback((e) => {
    if(!e){
      setData([]);
    }
    else{
      region.forEach((r) => {
        if(r.city.indexOf(e)+1 || r.town.indexOf(e)+1){
          vsdata.push({id:r.id, city: r.city, town: r.town});
          setData(vsdata);
        }
      });
    }
  },[data, region]);

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

  console.log(signupNext);
  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        {signupNext 
        ?
        <>
        <div style={{ marginTop:'100px' }}>
            <div style={{textAlign:'center'}}>
                <h3 style={{textAlign:'left',marginLeft:'120px'}}>지역선택</h3>
                <Select
                showSearch
                value={currentdata}
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
                        <Button type="link" htmlType="button" value={item.id} onClick={onLocation}>선택</Button>
                    </List.Item>
                    )} >
                    </List>
                </div>
            </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>가입하기</Button>
        </div> 
        </>
        :
        <>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>위 약관에 동의하시겠습니까?</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10}}>
          <Button type="primary" htmlType="button" value={signupNext} onClick={signupNextCheck}>다음</Button>
        </div>
        </>
        }
      </Form>
    </>
  );
};

Signup.getInitialProps = async ( context ) => {
  context.store.dispatch({
      type: REGION_REQUEST,
  });
};


export default Signup;