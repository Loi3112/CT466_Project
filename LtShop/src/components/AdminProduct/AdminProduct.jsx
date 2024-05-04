import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Select, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import Loading from '../LoadingComponet/Loading'
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import * as message from '../../components/Message/Message'

const AdminProduct = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [isPendingUpdate, setIsPendingUpdate] = useState(false)

  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

  const [typeSelect, setTypeSelect] = useState('')

  const user = useSelector((state) => state?.user)

  const searchInput = useRef(null);



  const inittial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    discount: ''
  })


  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    discount: ''

  })
  const [stateProductDetail, setStateProductDetail] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    discount: ''
  })
  const [form] = Form.useForm();

  const mutation = useMutationHooks(
    (data) => {
      const { name,
        price,
        description,
        rating,
        image,
        type,
        countInStock,
        discount } = data
      const res = ProductService.createProduct({
        name,
        price,
        description,
        rating,
        image,
        type,
        countInStock,
        discount
      })
      return res
    }
  )


  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = ProductService.updateProduct(
        id,
        token,
        { ...rests })
      return res
    },
  )


  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = ProductService.deleteProduct(
        id,
        token)
      return res
    },
  )



  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = ProductService.deleteManyProduct(
        ids,
        token)
      return res
    },
  )



  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }


  const fetchGetDetailProduct = async (rowSelected) => {
    const res = await ProductService.getDetailProduct(rowSelected)
    if (res?.data) {
      setStateProductDetail({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,

      })
    }
    setIsPendingUpdate(false)
  }


  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetail)
    } else {
      form.setFieldsValue(inittial())
    }
  }, [form, stateProductDetail, isModalOpen])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true)
      fetchGetDetailProduct(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])


  const handleDetailProduct = () => {
    // if (rowSelected) {
    //   fetchGetDetailProduct()
    // }
    setIsOpenDrawer(true)
  }

  const handleDeleteManyProduct = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }





  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isPending: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isPending: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const queryProduct = useQuery({
    queryKey: ['products'], queryFn: getAllProduct,
  })
  const typeProduct = useQuery({
    queryKey: ['type-product'], queryFn: fetchAllTypeProduct,
  })

  const { isPending: isPendingProducts, data: products } = queryProduct

  const renderAction = () => {
    return (
      <div>
        <EditOutlined style={{ color: 'blue', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailProduct} />
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
      </div>)
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

  });



  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')

    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (text) => <img src={text} style={{ width: 50, height: 50 }} />,
      export: false


    },
    {
      title: 'Price',
      dataIndex: 'price',
      filters: [
        {
          text: '>= 500000',
          value: '>=',
        },
        {
          text: '<= 500000',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 500000
        }
        return record.price <= 500000
      },

    },
    {
      title: 'Selled',
      dataIndex: 'selled',
      sorter: (a, b) => a.selled - b.selled,


    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '>= 3',
          value: '>=',
        },
        {
          text: '<= 3',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return Number(record.rating) >= 3
        }
        return Number(record.rating) <= 3
      },

    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'CountInStock',
      dataIndex: 'countInStock',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];

  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
  })

  useEffect(() => {
    if (isSuccess && data?.status !== 'ERROR') {
      message.success()
      handleCancel()

    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])


  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status !== 'ERROR') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany])

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status !== 'ERROR') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated, isErrorUpdated])

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status !== 'ERROR') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted, isErrorDeleted])


  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetail({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      discount: '',
    })
    form.resetFields()

  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      discount: ''
    })
    form.resetFields()

  };
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }



  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetail = (e) => {
    setStateProductDetail({
      ...stateProductDetail,
      [e.target.name]: e.target.value
    })
  }


  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetail }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
  }


  return (
    <div>
      <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}>
          <PlusOutlined style={{ fontSize: '50px' }} />
        </Button>
      </div>
      <div style={{ marginTop: '15px', width: '100%' }}>
        <TableComponent handleDeleteMany={handleDeleteManyProduct} columns={columns} isPending={isPendingProducts} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <ModalComponent forceRender title="Thêm sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}  >
        <Loading isPending={isPending}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.type === 'add_type' && (
              <Form.Item
                label='New type'
                name="newType"
                rules={[{ required: true, message: 'Please input your type!' }]}
              >
                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
              </Form.Item>
            )}

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your price!' }]}
            >
              <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
            </Form.Item>

            <Form.Item
              label="CountInStock"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your countInStock!' }]}
            >
              <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: 'Please input your rating!' },
                { pattern: /^([0-5](\.\d+)?|0)$/, message: 'Rating must be between 0 and 5' }
              ]}            >
              <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your description!' }]}
            >
              <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                { required: true, message: 'Please input your rating!' },
                { pattern: /^(10|\d)(\.\d+)?$/, message: 'Discount must be between 0 and 10' } // Sử dụng biểu thức chính quy để kiểm tra giá trị
              ]}           >
              <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
            </Form.Item>
            <Form.Item
              label="{Image URL}"
              name="image"
              rules={[{ required: true, message: 'Please input the image URL!' }]}
            >
              <InputComponent value={stateProduct.image} onChange={handleOnchange} name="image" />
            </Form.Item>

            {/* <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1} style={{}}>
                <Button >Select File</Button>
                {stateProduct?.image && (
                  <img src={stateProduct?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>


      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='40%'>
        <Loading isPending={isPendingUpdated}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 22 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onUpdateProduct}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateProductDetail['name']} onChange={handleOnchangeDetail} name="name" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <InputComponent value={stateProductDetail.type} onChange={handleOnchangeDetail} name="type" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your price!' }]}
            >
              <InputComponent value={stateProductDetail.price} onChange={handleOnchangeDetail} name="price" />
            </Form.Item>

            <Form.Item
              label="CountInStock"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your countInStock!' }]}
            >
              <InputComponent value={stateProductDetail.countInStock} onChange={handleOnchangeDetail} name="countInStock" />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: 'Please input your rating!' },
                { pattern: /^([0-5](\.\d+)?|0)$/, message: 'Rating must be between 0 and 5' }
              ]}
            >
              <InputComponent value={stateProductDetail.rating} onChange={handleOnchangeDetail} name="rating" />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                { required: true, message: 'Please input your rating!' },
                { pattern: /^(10|\d)(\.\d+)?$/, message: 'Discount must be between 0 and 10' } // Sử dụng biểu thức chính quy để kiểm tra giá trị
              ]}           >
              <InputComponent value={stateProductDetail.rating} onChange={handleOnchangeDetail} name="discount" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your description!' }]}
            >
              <InputComponent value={stateProductDetail.description} onChange={handleOnchangeDetail} name="description" />
            </Form.Item>

            <Form.Item
              label="Image URL"
              name="image"
              rules={[{ required: true, message: 'Please input the image URL!' }]}
            >
              <InputComponent value={stateProductDetail.image} onChange={handleOnchangeDetail} name="image" />
            </Form.Item>

            {/* <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatarDetail} maxCount={1}>
                <Button >Select File</Button>
                {stateProductDetail?.image && (
                  <img src={stateProductDetail?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>


      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <Loading isPending={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>

    </div >
  )
}

export default AdminProduct