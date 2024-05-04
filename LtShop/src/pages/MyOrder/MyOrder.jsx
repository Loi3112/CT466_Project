import React, { useEffect, useState } from 'react';
import Loading from '../../components/LoadingComponet/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const MyOrder = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    console.log('res', res);
    return res.data;
  };
  const user = useSelector((state) => state.user);

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: state?.id && state?.token
  });
  const { isPending, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    });
  };

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems, userId } = data;
      const res = OrderService.cancelOrder(id, token, orderItems, userId);
      return res;
    }
  );

  const handleCanceOrder = (order) => {
    mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch();
      },
    });
  };
  const { isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === 'ERROR') {
      message.error(dataCancel?.message);
    } else if (isErrorCancle) {
      message.error();
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem key={order?._id}>
        <img src={order?.image}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px'
          }}
        />
        <div style={{
          width: 260,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: '10px'
        }}>{order?.name}</div>
        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
      </WrapperHeaderItem>;
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đang giao';
      default:
        return 'Đã giao hàng';

    }
  };

  const renderOrdersByStatus = (status) => {
    if (!data) {
      return null; // Return null if data is undefined
    }
    const orders = data.filter(order => order.status === status);
    return (
      <WrapperListOrder>
        {orders.map(order => (
          <WrapperItemOrder key={order._id}>
            <WrapperStatus>
              <div>
                <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </WrapperStatus>
            {renderProduct(order?.orderItems)}
            <WrapperFooterItem>
              <div>
                <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                <span
                  style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}
                >{convertPrice(order?.totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {order.status === 0 && (
                  <ButtonComponent
                    onClick={() => handleCanceOrder(order)}
                    size={40}
                    styleButton={{
                      height: '36px',
                      border: '1px solid #9255FD',
                      borderRadius: '4px'
                    }}
                    textButton={'Hủy đơn hàng'}
                    styletextButton={{ color: '#9255FD', fontSize: '14px' }}
                  />
                )}

                <ButtonComponent
                  onClick={() => handleDetailsOrder(order?._id)}
                  size={40}
                  styleButton={{
                    height: '36px',
                    border: '1px solid #9255FD',
                    borderRadius: '4px'
                  }}
                  textButton={'Xem chi tiết'}
                  styletextButton={{ color: '#9255FD', fontSize: '14px' }}
                >
                </ButtonComponent>
              </div>
            </WrapperFooterItem>
          </WrapperItemOrder>
        ))}
      </WrapperListOrder>
    );
  };

  return (
    <Loading isPending={isPending || isPendingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h4>Đơn hàng của tôi</h4>
          <Tabs defaultActiveKey="0" centered>
            <TabPane tab="Chờ xác nhận" key="0">
              {renderOrdersByStatus(0)}
            </TabPane>
            <TabPane tab="Đang giao" key="1">
              {renderOrdersByStatus(1)}
            </TabPane>
            <TabPane tab="Đã giao hàng" key="2">
              {renderOrdersByStatus(2)}
            </TabPane>
          </Tabs>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrder;
