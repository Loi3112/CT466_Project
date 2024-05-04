import React, { useState } from 'react'
import { Col, Row, Image, Rate } from 'antd'
import imageProductSmall from '../../assets/images/imagesmall.webp'
import {
  WrapperAddressProduct, WrapperBtnQuantityProduct, WrapperInputNumber, WrapperPriceProduct,
  WrapperPriceTextProduct, WrapperQuantityProduct,
  WrapperStyleCollImage, WrapperStyleImageSmall,
  WrapperStyleNameProduct, WrapperStyleTextSell,

} from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponet/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils';


const ProductDetailComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const onChange = (value) => {
    setNumProduct(Number(value))
  }

  const fetchGetDetailProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailProduct(id)
      return res.data
    }
  }



  const { isLoading, data: productDetail } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailProduct,
    enabled: !!idProduct,
  });

  const handleChangeCount = (type) => {
    if (type === 'increase') {

      setNumProduct(numProduct + 1)

    } else {
      setNumProduct(numProduct - 1)


    }
  }

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location?.pathname });
    } else {
      dispatch(addOrderProduct({
        userId: user?.id,
        orderItem: {
          name: productDetail?.name,
          amount: numProduct,
          image: productDetail?.image,
          price: productDetail?.price,
          product: productDetail?._id,
          discount: productDetail?.discount,

        }
      }))
    }
  };



  return (
    <Loading isPending={isLoading}>

      <Row style={{ padding: '16px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Col span={10} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image src={productDetail?.image} alt="image_product" preview={false} style={{ width: '60%', height: '60%', margin: 'auto', display: 'block' }} />
          <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
            {/* <WrapperStyleCollImage span={4}>
        <WrapperStyleImageSmall src={productDetail?.image} alt="image_product_small" preview={false} />
    </WrapperStyleCollImage> */}
          </Row>
        </Col>


        <Col span={14} style={{ padding: '30px' }}>
          <WrapperStyleNameProduct>{productDetail?.name}</WrapperStyleNameProduct>
          <div>
            <Rate allowHalf value={productDetail?.rating} />


            <WrapperStyleTextSell>&nbsp;|&nbsp;Đã bán 100 </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetail?.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>

          <WrapperAddressProduct>
            <span>Giao Đến </span>
            <span className='address'> {user?.address} </span> -
            <span className='change-address'> Thay đổi</span>

          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
            <div style={{ marginBottom: '15px' }}>Số lượng:</div>
            <WrapperQuantityProduct>
              <WrapperBtnQuantityProduct onClick={() => { handleChangeCount('decrease') }} style={{ cursor: 'pointer' }}>
                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </WrapperBtnQuantityProduct>

              <WrapperInputNumber defaultValue={1} onChange={onChange} size="small" value={numProduct} />

              <WrapperBtnQuantityProduct onClick={() => { handleChangeCount('increase') }} style={{ cursor: 'pointer' }}>
                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </WrapperBtnQuantityProduct>
            </WrapperQuantityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ButtonComponent
              size={40}
              onClick={handleAddOrderProduct}

              textButton={'Chọn Mua'}
              style={{ border: 'none', borderRadius: '2px', backgroundColor: 'rgb(255 ,57, 69)', color: '#fff', height: '48px', width: '220px' }}>

            </ButtonComponent>
            {/* <ButtonComponent size={40} textButton={'Chọn Mua'} style={{ border: '1px solid rgb(13,92,182)', borderRadius: '2px', backgroundColor: '#fff', color: 'rgb(13,92,182)', height: '48px', width: '220px' }}></ButtonComponent> */}

          </div>
        </Col>
      </Row>
    </Loading>
  )
}

export default ProductDetailComponent