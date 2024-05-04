import React, { useEffect, useState } from 'react'
import { Col, Badge } from 'antd'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader } from './style'
import { CaretDownFilled, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { Popover } from "antd";
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';
import Loading from '../LoadingComponet/Loading'
import { searchProduct } from '../../redux/slides/productSlide'
import { isPending } from '@reduxjs/toolkit'


const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {

  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUsername] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const order = useSelector((state) => state.order)
  const [loading, setLoading] = useState(false)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    localStorage.clear();
    dispatch(resetUser())
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setUsername(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const handleMyOrderClick = () => {
    // Truyền id thông qua state
    navigate('/my-order', { state: { id: user?.id } });
  };
  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>

      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lí</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleMyOrderClick}>Đơn hàng của tôi</WrapperContentPopup>

      <WrapperContentPopup onClick={handleLogout} >Đăng xuât</WrapperContentPopup>

    </div>

  );

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value))
  }
  return (
    <div>
      <WrapperHeader gutter={'16'} style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={6}>
          <WrapperTextHeader onClick={() => { navigate('/') }} style={{ cursor: 'pointer', fontSize:'30px', color:'#fff' }}>LtShopping</WrapperTextHeader>

        </Col>

        {!isHiddenSearch && (
          <Col span={12}>
            <ButtonInputSearch
              size='large'
              textButton='Tìm Kiếm'
              placeholder="Nhập vào từ khoản tìm kiếm"
              onChange={onSearch}
            />
          </Col>
        )}




        <Col span={6} style={{ display: 'flex', gap: '40px' }}>
          <Loading isPending={loading}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img src={userAvatar} style={{
                  height: '40px',
                  width: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} alt='avatar_user' />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: 'pointer' }}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <div>
                    <span style={{ fontSize: '13px' }}  >Tài Khoản</span>
                    <CaretDownFilled />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>

          {!isHiddenCart && (
            <div onClick={() => { navigate('/order') }} style={{ cursor: 'pointer' }}>
              <Badge count={order?.orderItems?.length}>
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#F1FFFF' }} />
              </Badge>
            </div>
          )}
        </Col>


      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent