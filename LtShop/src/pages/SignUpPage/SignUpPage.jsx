import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imgLogo from '../../assets/images/logo_pegunin.jpg'
import { Image } from 'antd'
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponet/Loading'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {

  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.newUser(data)
  )

  const { data, isPending, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess && data?.status !== 'ERROR') {
      message.success()
      handleNavigateLogin()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnChangePassword = (value) => {
    setPassword(value)
  }

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword })
    console.log(email, password, confirmPassword)
  }


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft >
          <h1>Xin Chào,</h1>
          <p>Đăng Ký Tài Khoản Tại Đây</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="xyz@gmail.com"
            value={email} onChange={handleOnChangeEmail} />

          <InputForm style={{ marginBottom: '10px' }} placeholder="Password"
            value={password} onChange={handleOnChangePassword} />

          <InputForm style={{ marginBottom: '10px' }} placeholder="Confirm password"
            value={confirmPassword} onChange={handleOnChangeConfirmPassword} />
          {data?.status === 'ERROR' && <span>{data?.message}</span>}
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleSignUp}
              size={40} textButton={'Đăng Ký'}

              styleButton={{
                border: 'none', borderRadius: '2px', background: 'rgb(255 ,57, 69)',
                color: '#fff', height: '48px', width: '100%', margin: '12px 0 10px'
              }}>
            </ButtonComponent>
          </Loading>

          <p style={{ fontSize: '14px', color: 'rgb(13 ,92, 182)' }}>Quên Mật Khẩu?</p>
          <p style={{ fontSize: '14px' }}>Bạn đã có tài khoản? <span style={{ color: 'rgb(13 ,92, 182)', cursor: 'pointer' }} onClick={handleNavigateLogin}> Đăng nhập ngay</span></p>

        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imgLogo} preview={false} alt='img-logo' style={{ width: '300px', height: '300px' }} />

        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage