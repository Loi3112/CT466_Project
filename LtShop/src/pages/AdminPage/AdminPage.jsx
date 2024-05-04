import React, { useEffect, useState } from 'react';
import { convertPrice, getItem } from '../../utils';
import { AppstoreOutlined, HomeOutlined, ProductOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Card, Statistic, Row, Col, DatePicker } from 'antd';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
import * as UserService from '../../services/UserService';
import * as ProductService from '../../services/ProductService';
import * as OrderService from '../../services/OrderService';
import moment from 'moment';

const { Meta } = Card;

const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'home', <HomeOutlined />),
        getItem('Người dùng', 'users', <UserOutlined />),
        getItem('Sản phẩm', 'products', <AppstoreOutlined />),
        getItem('Đơn hàng', 'order', <UnorderedListOutlined />),
    ];

    const [keySelected, setKeySelected] = useState('');
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [revenueByDay, setRevenueByDay] = useState({});
    const [revenueByMonth, setRevenueByMonth] = useState({});
    const [revenueByYear, setRevenueByYear] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRevenue, setSelectedRevenue] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedMonthRevenue, setSelectedMonthRevenue] = useState(0);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedYearRevenue, setSelectedYearRevenue] = useState(0);

    const [totalRevenue, setTotalRevenue] = useState(0); //11111




    useEffect(() => {
        const fetchUserCount = async () => {
            setIsLoading(true);
            try {
                const users = await UserService.getAllUser();
                if (users && users.data) {
                    const count = users.data.length;
                    setUserCount(count);
                } else {
                    setUserCount(0);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error counting users:', error);
                setIsLoading(false);
            }
        };
        fetchUserCount();
    }, []);

    useEffect(() => {
        const fetchProductCount = async () => {
            setIsLoading(true);
            try {
                const products = await ProductService.getAllProduct();

                if (products && products.data) {
                    const count = products.data.length;
                    setProductCount(count);
                } else {
                    setProductCount(0);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error counting products:', error);
                setIsLoading(false);
            }
        };
        fetchProductCount();
    }, []);

    useEffect(() => {
        const fetchOrderCount = async () => {
            setIsLoading(true);
            try {
                const order = await OrderService.getAllOrder();

                if (order && order.data) {
                    const count = order.data.length;
                    setOrderCount(count);
                } else {
                    setOrderCount(0);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error counting orders:', error);
                setIsLoading(false);
            }
        };
        fetchOrderCount();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const orders = await OrderService.getAllOrder();
                let total = 0; // 11111

                if (orders && orders.data) {
                    const revenueDay = {};
                    const revenueMonth = {};
                    const revenueYear = {};

                    orders.data.forEach(order => {
                        total += order.totalPrice; //1111111111

                        const date = new Date(order.deliveredAt);
                        if (!isNaN(date.getTime())) {
                            const dayKey = date.toISOString().split('T')[0];
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            const monthKey = `${month}-${year}`;
                            const yearKey = date.toLocaleDateString('en-US', { year: 'numeric' });

                            revenueDay[dayKey] = (revenueDay[dayKey] || 0) + order.totalPrice;
                            revenueMonth[monthKey] = (revenueMonth[monthKey] || 0) + order.totalPrice;
                            revenueYear[yearKey] = (revenueYear[yearKey] || 0) + order.totalPrice;
                        }
                    });
                    setTotalRevenue(total); // 111111

                    setRevenueByDay(revenueDay);
                    setRevenueByMonth(revenueMonth);
                    setRevenueByYear(revenueYear);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         setIsLoading(true);
    //         try {
    //             const orders = await OrderService.getAllOrder();
    //             // let total = 0;
    //             if (orders && orders.data) {
    //                 const revenueDay = {};
    //                 const revenueMonth = {};
    //                 const revenueYear = {};

    //                 orders.data.forEach(order => {
    //                     // total += order.totalPrice;

    //                     const date = new Date(order.deliveredAt);
    //                     if (!isNaN(date.getTime())) {
    //                         const dayKey = date.toISOString().split('T')[0];

    //                         const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //                         const year = date.getFullYear();
    //                         const monthKey = `${month}-${year}`; const yearKey = date.toLocaleDateString('en-US', { year: 'numeric' });

    //                         revenueDay[dayKey] = (revenueDay[dayKey] || 0) + order.totalPrice;
    //                         revenueMonth[monthKey] = (revenueMonth[monthKey] || 0) + order.totalPrice;
    //                         revenueYear[yearKey] = (revenueYear[yearKey] || 0) + order.totalPrice;
    //                     }
    //                 });
    //                 // setTotalRevenue(total);
    //                 setRevenueByDay(revenueDay);
    //                 setRevenueByMonth(revenueMonth);
    //                 setRevenueByYear(revenueYear);
    //             }
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching orders:', error);
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchOrders();
    // }, []);



    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
            const formattedDate = date.format('YYYY-MM-DD');
            console.log('formattedDate', revenueByDay[formattedDate])
            setSelectedRevenue(revenueByDay[formattedDate] || 0);
        } else {
            setSelectedDate(null);
            setSelectedRevenue(0);
        }
    };
    const handleMonthChange = (date) => {
        if (date) {
            setSelectedMonth(date);
            const formattedMonth = moment(date).format('MM-YYYY');
            setSelectedMonthRevenue(revenueByMonth[formattedMonth] || 0);
        } else {
            setSelectedMonth(null);
            setSelectedMonthRevenue(0);
        }
    };





    const handleYearChange = (date) => {
        if (date) {
            setSelectedYear(date);
            const formattedYear = date.format('YYYY');
            setSelectedYearRevenue(revenueByYear[formattedYear] || 0);
        } else {
            setSelectedYear(null);
            setSelectedYearRevenue(0);
        }
    };

    const renderPage = (key) => {
        switch (key) {
            case 'users':
                return <AdminUser />;
            case 'products':
                return <AdminProduct />;
            case 'order':
                return <OrderAdmin />;
            default:
                return (
                    <Row gutter={16}>
                        <Col span={8} style={{}}>
                            <Card style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', height: ' 120px', display: 'flex', justifyContent: 'center' }}>
                                <UserOutlined style={{ fontSize: '30px', display: 'flex', justifyContent: 'center' }} />
                                <Statistic title="Người Dùng" value={isLoading ? 'Loading...' : userCount} style={{ textAlign: 'center' }} />
                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', height: ' 120px', display: 'flex', justifyContent: 'center' }}>
                                <ProductOutlined style={{ fontSize: '30px', display: 'flex', justifyContent: 'center' }} />
                                <Statistic title="Sản Phẩm" value={isLoading ? 'Loading...' : productCount} style={{ textAlign: 'center' }} />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', height: ' 120px', display: 'flex', justifyContent: 'center' }}>
                                <UnorderedListOutlined style={{ fontSize: '30px', display: 'flex', justifyContent: 'center' }} />
                                <Statistic title="Đơn Hàng" value={isLoading ? 'Loading...' : orderCount} style={{ textAlign: 'center' }} />
                            </Card>
                        </Col>
                        <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                            <div style={{ width: '100%' }}>
                                <Card style={{ height: '180px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <h3 style={{ textAlign: 'center' }}>Tổng Doanh Thu</h3>
                                    <Statistic style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} value={convertPrice(totalRevenue)} />
                                </Card>
                            </div>
                        </Col>

                        <Col span={8}>
                            <Card style={{ height: '200px', marginTop: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                <h3>Doanh thu theo ngày</h3>
                                <DatePicker onChange={handleDateChange} />
                                {selectedDate && (
                                    <Statistic title="Doanh thu" value={selectedDate && (revenueByDay[selectedDate.format('YYYY-MM-DD')]) ? convertPrice(revenueByDay[selectedDate.format('YYYY-MM-DD')]) : '0 VND'} />
                                )}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card style={{ height: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                                <h3>Doanh thu theo tháng</h3>
                                <DatePicker.MonthPicker onChange={handleMonthChange} format="MMMM YYYY" />
                                {selectedMonth && (
                                    <Statistic title="Doanh thu" value={selectedMonth && (revenueByMonth[selectedMonth.format('MM-YYYY')]) ? convertPrice(revenueByMonth[selectedMonth.format('MM-YYYY')]) : '0 VND'} />
                                )}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card style={{ height: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                                <h3>Doanh thu theo năm</h3>
                                <DatePicker.YearPicker onChange={handleYearChange} />
                                {selectedYear && (
                                    <Statistic title="Doanh thu" value={selectedYear && (revenueByYear[selectedYear.format('YYYY')] ? convertPrice(revenueByYear[selectedYear.format('YYYY')]) : '0 VND')} />
                                )}
                            </Card>
                        </Col>

                    </Row>

                );
        }
    };

    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    };

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh',
                    }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ padding: '16px' }}>
                    {!keySelected && renderPage(keySelected)}
                    {keySelected && renderPage(keySelected)}
                </div>
            </div>
        </>
    );
};

export default AdminPage;
