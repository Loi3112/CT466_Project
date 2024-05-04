import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponet/Loading'
import InputComponent from '../InputComponent/InputComponent'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useSelector } from 'react-redux'

const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [isPendingUpdate, setIsPendingUpdate] = useState(false)

  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

  const user = useSelector((state) => state?.user)

  const searchInput = useRef(null);


  const inittial = () => ({
    name: '',
    email: '',
    phone: '',
    isAdmin: 'false'
  })


  const [stateUser, setStateUser] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: 'false'
  })
  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: 'false'
  })
  const [form] = Form.useForm();

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = UserService.deleteUser(
        id,
        token)
      return res
    },
  )


  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = UserService.deleteManyUser(
        ids,
        token)
      return res
    },
  )

  const getAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };


  const fetchGetDetailUser = async (rowSelected) => {
    const res = await UserService.getDetailUser(rowSelected)
    if (res?.data) {
      setStateUserDetail({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address

      })
    }
    setIsPendingUpdate(false)
  }


  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateUserDetail)
    } else {
      form.setFieldsValue(inittial())
    }
  }, [form, stateUserDetail, isModalOpen])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true)
      fetchGetDetailUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])



  const handleDeleteManyUser = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const { data: dataDeleted, isPending: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isPending: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const queryUser = useQuery({
    queryKey: ['users'], queryFn: getAllUser,
  })
  const { isPending: isPendingUser, data: users } = queryUser




  const renderAction = () => {
    return (
      <div>
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
      // sorter: (a, b) => a.name.length - b.name.length,
      // ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      // sorter: (a, b) => a.address.length - b.address.length,
      // ...getColumnSearchProps('address')
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
     
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];

  const dataTable = users?.data?.length && users?.data?.map((user) => {
    return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' }
  })






  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status !== 'ERROR') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany])

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status !== 'ERROR') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted, isErrorDeleted])




  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lí người dùng</WrapperHeader>

      <div style={{ marginTop: '15px', width: '100%' }}>
        <TableComponent handleDeleteMany={handleDeleteManyUser} columns={columns} isPending={isPendingUser} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
        <Loading isPending={isLoadingDeleted}>
          <div>Bạn có chắc xóa tài khoản này không?</div>
        </Loading>
      </ModalComponent>

    </div>
  )
}

export default AdminUser