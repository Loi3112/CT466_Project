import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    padding: 30px 120px;
    background-color: #232F3E;
    color: #F1FFFF;
    gap: 16px;
    flex-wrap: nowrap;

`
export const WrapperTextHeader = styled.span`
    font-sie: 18px;
    font-weight: bold;
    text-align: left;
    white-space: nowrap;
`
export const WrapperHeaderAccount = styled.div `
    display: flex;
    align-items: center;
    gap: 10px;

`
export const WrapperContentPopup = styled.div `
    cursor: pointer;
    &:hover{
        color: red;
    }

`

