import React from 'react'
import { StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscountText, WrapperCardStyle, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'

const CardComponent = (props) => {

    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }

    return (
        <WrapperCardStyle
            hoverable

            style={{ width: '170px' }}

            cover={<img alt="example" src={image} style={{ width: '100%' }} />}

            onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
            disabled={countInStock === 0}

        >
            <img alt="#" style={{ width: '68px', height: '14px', position: 'absolute', top: 0, left: 0, borderTopLeftRadius: '3px' }} src={logo} />
            <StyleNameProduct style={{ height: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating}&nbsp;</span><StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <WrapperStyleTextSell>&nbsp;|&nbsp;Đã bán {selled || 100} </WrapperStyleTextSell>

            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '1px' }}>{convertPrice(price)}</span>
                <WrapperDiscountText>
                    {discount || 0}%
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}
export default CardComponent