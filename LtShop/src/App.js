
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { routes } from './routes'
import { isJsonString } from './utils'
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService';
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import Loading from './components/LoadingComponet/Loading';

function App() {

  const dispatch = useDispatch();
  const [isPending, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)


  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);


  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)

    }
    return { decoded, storageData }
  }
  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()

    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  const handleGetDetailUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  }


  return (
    <div>
      <Loading isPending={isPending} style={{ background: '#ccc' }}>
        <Router>
          <Routes>
            {
              routes.map((route) => {
                const Page = route.page
                const isAccessible = !route.isPrivate || user.isAdmin;
                const isAdminRoute = route.isAdminRoute && user.isAdmin;
                if (route.isAdminRoute && !user.isAdmin) {
                  return <Route key={route.path} path={route.path} element={<Navigate to="/404" />} />;
                }
                const Layout = route.isShowHeader ? DefaultComponent : Fragment


                return (
                  <Route key={route.path} path={isAccessible  && route.path} element={
                    <Layout>
                      <Page />
                    </Layout>
                  } />
                )
              })
            }
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}
export default App