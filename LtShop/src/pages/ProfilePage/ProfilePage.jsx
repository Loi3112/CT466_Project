import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponet/Loading'
import * as message from '../../components/Message/Message'
    import { updateUser } from '../../redux/slides/userSlide'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)

    const [email, setEmail] = useState(user?.email)
    const [name, setName] = useState(user?.name)
    const [phone, setPhone] = useState(user?.phone)
    const [address, setAddress] = useState(user?.address)
    const [avatar, setAvatar] = useState(user?.avatar)
    const [city, setCity] = useState(user?.city)

    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()

    const { data, isPending, isSuccess, isError } = mutation
    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
        setCity(user?.city)


    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnChangeName = (value) => {
        setName(value)

    }

    const handleOnChangePhone = (value) => {
        setPhone(value)

    }

    const handleOnChangeAddress = (value) => {
        setAddress(value)

    }
    const handleOnChangeCity = (city) => {
        setCity(city)

    }

    const handleOnChangeAvatar   = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setAvatar(file.preview)
    }
    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, city, access_token: user?.access_token })


    }


    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thông Tin Người Dùng</WrapperHeader>

            <Loading isPending={isPending}>
                <WrapperContentProfile>
                    <WrapperInput   >
                        <WrapperLabel htmlFor='name'>Name: </WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnChangeName} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40} textButton={'Cập Nhật'}
                            styleButton={{
                                border: 'none', background: 'rgb(255 ,57, 69)',
                                color: '#fff', height: '31px', borderRadius: '4px', padding: '4px 6px', width: 'fit-content'
                            }}
                        ></ButtonComponent>
                    </WrapperInput>

                    <WrapperInput   >
                        <WrapperLabel htmlFor='email'>Email: </WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnChangeEmail} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40} textButton={'Cập Nhật'}
                            styleButton={{
                                border: 'none', background: 'rgb(255 ,57, 69)',
                                color: '#fff', height: '31px', borderRadius: '4px', padding: '4px 6px', width: 'fit-content'
                            }}
                        ></ButtonComponent>
                    </WrapperInput>

                    <WrapperInput   >
                        <WrapperLabel htmlFor='address'>Address: </WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="address" value={address} onChange={handleOnChangeAddress} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40} textButton={'Cập Nhật'}
                            styleButton={{
                                border: 'none', background: 'rgb(255 ,57, 69)',
                                color: '#fff', height: '31px', borderRadius: '4px', padding: '4px 6px', width: 'fit-content'
                            }}
                        ></ButtonComponent>
                    </WrapperInput>

                    <WrapperInput   >
                        <WrapperLabel htmlFor='city'>City: </WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="city" value={city} onChange={handleOnChangeCity} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40} textButton={'Cập Nhật'}
                            styleButton={{
                                border: 'none', background: 'rgb(255 ,57, 69)',
                                color: '#fff', height: '31px', borderRadius: '4px', padding: '4px 6px', width: 'fit-content'
                            }}
                        ></ButtonComponent>
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor='phone'>Phone: </WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="phone" value={phone} onChange={handleOnChangePhone} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40} textButton={'Cập Nhật'}
                            styleButton={{
                                border: 'none', background: 'rgb(255 ,57, 69)',
                                color: '#fff', height: '31px', borderRadius: '4px', padding: '4px 6px', width: 'fit-content'
                            }}
                        ></ButtonComponent>
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor='avatar'>Avatar: </WrapperLabel>
                        <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1} >
                            <Button icon={<UploadOutlined />}>Upload Directory</Button>
                        </WrapperUploadFile>
                            {
                                avatar && (
                                    <img src={avatar} style={{
                                        height:'60px',
                                        width:'60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }} alt='avatar_user' ></img>
                                )
                            }

                        {/* <InputForm style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnChangeAvatar} /> */}
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40} textButton={'Cập Nhật'}
                            styleButton={{
                                border: 'none', background: 'rgb(255 ,57, 69)',
                                color: '#fff', height: '31px', borderRadius: '4px', padding: '4px 6px', width: 'fit-content'
                            }}
                        ></ButtonComponent>
                    </WrapperInput>

                </WrapperContentProfile>
            </Loading>


        </div>
    )
}

export default ProfilePage