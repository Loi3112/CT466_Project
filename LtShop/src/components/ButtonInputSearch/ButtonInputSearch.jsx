import { SearchOutlined } from '@ant-design/icons';
// import { Button, Input } from 'antd';
import React from 'react';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
  const { size, placeholder, textButton } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{ marginRight: '8px' }}
        {...props}
        />
      <ButtonComponent size={size} icon={<SearchOutlined />} textButton={textButton}><span>{textButton}</span></ButtonComponent>
    </div>
  );
};

export default ButtonInputSearch;
