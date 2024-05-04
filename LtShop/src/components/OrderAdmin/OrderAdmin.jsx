import { Button, Drawer, Form, Space } from 'antd'
import React, { useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponet/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { convertPrice, getBase64 } from '../../utils'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'

import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'
import PieChartComponent from './PieChart'

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }


  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isPending: isPendingOrders, data: orders, refetch } = queryOrder

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
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
      }
    },
  });




  const handleUpdateStatus = (record) => {
    const orderId = record._id;
    OrderService.updateDeliveryStatus(orderId, user.access_token)
      .then(() => {
        message.success('Cập nhật thành công');
        setRefreshOrders(true);
      })
      .catch((error) => {
        console.error('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng:', error);
      });
  };

  useEffect(() => {
    if (refreshOrders) {
      refetch();
      setRefreshOrders(false);
    }
  }, [refreshOrders, refetch]);
  const data = [
    { key: '1', status: 0 },
    { key: '2', status: 1 },
    { key: '3', status: 2 },
  ];

  const statusMap = {
    0: 'Chờ xác nhận',
    1: 'Đang giao',
    2: 'Đã giao',
  };

  const handleShowOrderDetail = (order) => { //111111111
    setSelectedOrder(order);
    setVisible(true);
  };

  const columns = [
    {
      title: 'User name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      // ...getColumnSearchProps('name')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      // sorter: (a, b) => a.phone.length - b.phone.length,
      // ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      // sorter: (a, b) => a.address.length - b.address.length,
      // ...getColumnSearchProps('address')
    },
    // {
    //   title: 'Paided',
    //   dataIndex: 'isPaid',
    //   sorter: (a, b) => a.isPaid.length - b.isPaid.length,
    //   ...getColumnSearchProps('isPaid')
    // },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      // ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      // ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status - b.status,
      render: (status) => {
        return <span>{statusMap[status]}</span>;
      },
      export: false

    },
    {
      title: 'Action',
      dataIndex: 'status',
      render: (status, record) => {
        if (status === 0) {
          return (
            <Space>
              <Button type="primary" danger onClick={() => handleUpdateStatus(record)}>Xác Nhận</Button>
            </Space>
          );
        } else if (status === 1) {
          return (
            <Space>
              <Button type="primary" onClick={() => handleUpdateStatus(record)}>Xác Nhận</Button>
            </Space>
          );
        }
        return null;
      },
      export: false
    },

  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice) }
  })

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ height: 200, width: 200 }}>
        <PieChartComponent data={orders?.data} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isPending={isPendingOrders} data={dataTable} onRow={(record) => ({
          onClick: () => handleShowOrderDetail(record),
        })} />
        <Drawer
          title="Chi tiết đơn hàng"
          placement="right"
          closable={true}
          onClose={() => setVisible(false)}
          visible={visible}
          width={400}
        >
          {/* Hiển thị thông tin chi tiết của đơn hàng */}
          {/* Ví dụ: */}
          {selectedOrder && (
            <div>
              <p ><b>Tên người đặt hàng:</b> {selectedOrder.userName}</p>
              <p><b>Địa chỉ:</b> {selectedOrder.address}</p>
              <div>
                {selectedOrder?.orderItems?.map((item, index) => (
                  <div key={index}>
                    <p><b>Tên sản phẩm</b> {index + 1}: {item.name}</p>
                    <p><b>Số lượng:</b> {item.amount}</p>
                    <img src={item.image} alt={item.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  </div>
                ))}
              </div>
              <p><b>Ngày đặt:</b> {selectedOrder.createdAt}</p>
              {selectedOrder.deliveredAt && (
                <p><b>Ngày giao: </b>{selectedOrder.deliveredAt}</p>
              )}
              <p><b>Phương thức thanh toán:</b>  <br /> {selectedOrder.paymentMethod}</p>

              <p><b>Tổng Tiền:</b> {selectedOrder.totalPrice}</p>

            </div>
          )}
        </Drawer>
      </div>
    </div>
  )
}

export default OrderAdmin