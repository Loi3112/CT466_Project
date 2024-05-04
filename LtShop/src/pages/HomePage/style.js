import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    height: 49px;
`
export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color : '#fff';
        background: rgb(13,92,182);
        span {
            color: #fff;
        }
    }
    width: 100%;

`
export const WrapperProducts = styled.div`
    display: flex;
    align-item: center;
    gap: 16px;
    margin-top: 20px;
    flex-wrap: wrap;
`

