import { Button, Table } from 'antd';
import React, { useMemo, useRef, useState } from 'react'
import Loading from '../LoadingComponet/Loading';
import { Excel } from 'antd-table-saveas-excel';
import { DownloadOutlined } from '@ant-design/icons';

const TableComponent = (props) => {

    const { isPending = false, data: dataSource = [], columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])

    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns])
    
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
      };
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }


    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnExport.filter(col => col.export !== false))
            .addDataSource(dataSource, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    };

    return (
        <Loading isPending={isPending}>
            {rowSelectedKeys.length > 0 && (<div style={{
                background: 'red',
                color: '#fff',
                padding: '10px',
                cursor: 'pointer'
            }} onClick={handleDeleteAll}>
                Xóa tất cả
            </div>)}
            <Button style={{marginBottom: '30px' }} type="primary" onClick={exportExcel} shape="round" icon={<DownloadOutlined />}>
            Export File Excel
          </Button>
            <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} {...props} style={{ width: '1270px' }} />
        </Loading>
    )
}

export default TableComponent