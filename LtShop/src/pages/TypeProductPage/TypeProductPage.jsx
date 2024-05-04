import React, { useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Row, Pagination, Col } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponet/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import { useSelector } from 'react-redux'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)

    const { state } = useLocation()

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })

    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status == 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPanigate({ ...panigate, total: res?.totalPage })
        } else {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit)
        }

    }, [state, panigate.page, panigate.limit])

    const onChange = (current, pageSize) => {
        console.log({ current, pageSize })
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }
    return (
        <Loading isPending={loading}>
            <div style={{ padding: ' 0 120px', background: '#efefef' }}>
                <Row style={{ padding: '0 120px', background: '#efefef', flexWrap: 'nowrap', paddingTop: '12px' }}>
                    <WrapperNavbar span={4} style={{ background: '#fff', marginRight: '10px', padding: '10px', borderRadius: '8px' }}>
                        <NavbarComponent />
                    </WrapperNavbar >
                    <Col span={20}>
                        <WrapperProducts>
                            {products?.filter((pro) => {
                                if (searchDebounce === '') {
                                    return pro
                                } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                    return pro
                                }
                            })?.map((product) => {
                                return (
                                    <CardComponent
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
                                        id={product._id} />
                                )
                            })}

                        </WrapperProducts>
                        <Pagination defaultCurrent={panigate?.page + 1} total={panigate?.total} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                    </Col>
                </Row>
            </div>
        </Loading>
    )
}

export default TypeProductPage