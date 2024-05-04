import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()


  return (
    <div style={{padding:'0 120px', background:'#efefef', height:'1000px'}}>
      <h5> <span onClick={() => {navigate('/')}}>Trang Chủ</span> / Chi Tiết Sản Phẩm</h5>
              <ProductDetailComponent idProduct={id}/>

    </div>
  )
}

export default ProductDetailPage