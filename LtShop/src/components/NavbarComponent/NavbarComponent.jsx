import React, { useState, useEffect } from 'react';
import { WrapperContent, WrapperLabelText } from './style';
import { Checkbox, Rate } from 'antd';
import * as ProductService from '../../services/ProductService';
import TypeProduct from '../TypeProduct/TypeProduct';

const NavbarComponent = () => {
    const [typeProduct, setTypeProduct] = useState([]);

    useEffect(() => {
        const fetchAllTypeProduct = async () => {
            try {
                const res = await ProductService.getAllTypeProduct();
                if (res?.status === 'OK') {
                    setTypeProduct(res?.data);
                }
            } catch (error) {
                console.error('Error fetching type products:', error);
            }
        };

        fetchAllTypeProduct();
    }, []);

    // Function to handle checkbox change
    const onChange = () => {
        // Your onChange logic here
    };

    // Function to render different content types
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => (
                    <div key={option}>{option}</div>
                ));
            case 'checkbox':
                return (
                    <Checkbox.Group
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                        onChange={onChange}
                    >
                        {options.map((option) => (
                            <Checkbox key={option.value} value={option.value}>
                                {option.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                );
            case 'star':
                return options.map((option) => (
                    <div key={option}>
                        <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                        <span style={{ fontSize: '12px' }}>{`Từ ${option} sao`}</span>
                    </div>
                ));
            case 'price':
                return options.map((option) => (
                    <div key={option}>{option}</div>
                ));
            default:
                return null;
        }
    };

    return (
        <div>
            <WrapperLabelText>Danh Mục</WrapperLabelText>
            <WrapperContent>
                {typeProduct.map((item) => (
                    <TypeProduct key={item} name={item} />
                ))}
            </WrapperContent>
        </div>
    );
};

export default NavbarComponent;
