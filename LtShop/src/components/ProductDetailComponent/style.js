import styled from "styled-components";
import { Image, Col, InputNumber } from 'antd'

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`
export const WrapperStyleCollImage = styled(Col)`
    flex-basics: unset;
    display: flex;
`
export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`
export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);

`

export const WrapperPriceProduct = styled.span`
    background-color: rgb(250,250,20);
    border-radius: 4px;
`
export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
    margin-right: 8px;
    padding: 10px;
    margin-top: 10px;
`
export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    };
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 570;

    }
`
export const WrapperQuantityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    border-radius: 1px;
    width: 110px;
`
export const WrapperBtnQuantityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    border-radius: 2px;

`

export const WrapperInputNumber = styled(InputNumber)`
    .ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
 
    }

`