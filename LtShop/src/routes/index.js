import AdminPage from "../pages/AdminPage/AdminPage"
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage"
import HomePage from "../pages/HomePage/HomePage"
import MyOrder from "../pages/MyOrder/MyOrder"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import OrderPage from "../pages/OrderPage/OrderPage"
import OrderSucess from "../pages/OrderSuccess/OrderSuccess"
import PaymentPage from "../pages/PayMentPage/PageMentPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProductsPage from "../pages/ProductsPage/ProductsPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage"

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    }, {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,

    }, {
        path: '/my-order',
        page: MyOrder,
        isShowHeader: true,

    }, {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    }, {
        path: '/orderSuccess',
        page: OrderSucess,
        isShowHeader: true,

    }, {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,

    }, {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
    }, {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,

    }, {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,

    }, {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,

    }, {
        path: '/product-details/:id',
        page: ProductDetailPage,
        isShowHeader: true,

    }, {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,

    }, {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isAdminRoute: true // Thuộc tính mới
    }, {
        path: '*',
        page: NotFoundPage
    }
]