// import { SearchOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({ size, textButton, styleButton, disabled, ...rests }) => {
    return (
        <Button style={{
            ...styleButton,
            background: disabled ? '#ccc' : (styleButton && styleButton.background)
        }} size={size} {...rests}><span >{textButton}</span></Button>

    )
}

export default ButtonComponent