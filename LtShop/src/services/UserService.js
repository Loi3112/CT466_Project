import axios from 'axios';


export const axiosJWT = axios.create()

export const userLogin = async (data) => {

    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/sign-in`, data)
    return res.data
}

export const newUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/sign-up`, data)

    return res.data
}

export const getDetailUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })

    return res.data
}

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/refresh-token`, {
        withCrendentials: true

    })

    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/logout`)

    return res.data
}


export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })

    return res.data
}

export const getAllUser = async (access_token) => {

    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    }
    )
    return res.data
}



export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


export const deleteManyUser = async (ids, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/user/delete-many`, ids, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

