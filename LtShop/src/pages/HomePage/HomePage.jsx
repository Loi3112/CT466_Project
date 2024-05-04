import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponet/Loading'
import { useDebounce } from '../../hooks/useDebounce'


const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(6)
  const [typeProduct, setTypeProduct] = useState([])

  const fetchAllProduct = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProduct(res?.data)
    }
  }

  const { isPending, data: products, isPreviousData } = useQuery({ queryKey: ['products', limit, searchDebounce], queryFn: fetchAllProduct, config: { retry: 3, retryDelay: 1000, keepPreviousData: true } })


  useEffect(() => {
    fetchAllTypeProduct()
  })

  return (
    <Loading isPending={isPending || loading} >
      <div style={{ padding: '0px 300px' }}>
        <WrapperTypeProduct>
          {typeProduct.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div className='body' style={{ width: '100%', backgroundColor: '#efefef'}}>
        <div id='container' style={{ padding: '0 180px', height: 'auto', width: '1100px', margin: '0 auto' }}>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts style={{ paddingTop: '30px' }} >
            {products?.data?.map((product) => {
              return (<CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                discount={product.discount}
                selled={product.selled}
                id={product._id}
              />
              )

            })}
          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
            <WrapperButtonMore
              textButton={isPreviousData ? 'Load more' : "Xem thêm"}
              type="outline"
              style={{
                border: '1px solid rgb(11, 116, 229)',
                color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11, 116, 229)'}`,
                width: '240px',
                height: '38px',
                borderRadius: '4px',
                pointerEvents: products?.total === products?.data?.length || products?.totalPage === 1 ? 'none' : 'auto',

              }}
            onClick={() => setLimit((prev) => prev + 6)}
            />

          </div>
        </div>
      </div>
    </Loading>
  )
}

export default HomePage