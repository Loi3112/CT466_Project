import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imgLogo from '../../assets/images/logo_pegunin.jpg'
import { Image } from 'antd'
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponet/Loading'
import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide';

const SignInPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const mutation = useMutationHooks(
    data => UserService.userLogin(data)
  )

  const { data, isPending, isSuccess, isError } = mutation
  useEffect(() => {
    if (isSuccess && data?.status !== 'ERROR') {
      if (location?.state) {
        navigate(location?.state)
      } else {
        navigate('/')
      }
      message.success()
      navigate('/')
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      const temp = jwtDecode(data?.access_token)
      localStorage.setItem('userId', JSON.stringify(temp?.id))
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);

        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token)
        }

      }

    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleGetDetailUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
  }

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnChangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft >
          <h1>Xin Chào,</h1>
          <p>Đăng Nhập Vào Tài Khoản</p>

          <InputForm style={{ marginBottom: '10px' }} placeholder="xyz@gmail.com" value={email} onChange={handleOnChangeEmail} />

          <InputForm style={{ marginBottom: '10px' }} type="password" placeholder="Password" value={password} onChange={handleOnChangePassword} />

          {data?.status === 'ERROR' && <span style={{ color: 'red' }}>{data?.message}</span>}

          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}

              size={40} textButton={'Đăng Nhập'}

              styleButton={{
                border: 'none', borderRadius: '2px', background: 'rgb(255 ,57, 69)',
                color: '#fff', height: '48px', width: '100%', margin: '12px 0 10px'
              }}
            >
            </ButtonComponent>
          </Loading>
          <p style={{ fontSize: '14px', color: 'rgb(13 ,92, 182)' }}>Quên Mật Khẩu?</p>
          <p style={{ fontSize: '14px' }}>Chưa có tài khoản? <span style={{ color: 'rgb(13 ,92, 182)', cursor: 'pointer' }} onClick={handleNavigateSignUp}> Tạo tài khoản</span></p>

        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imgLogo} preview={false} alt='img-logo' style={{ width: '300px', height: '300px' }} />

        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage