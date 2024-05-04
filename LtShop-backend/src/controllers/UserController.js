const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')


const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is email'
            })
        }
        else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The password is equal confirmPassword'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if (!email || !password) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is mail'

            })
        }


        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const updateUser = async (req, res) => {
    try {
        const userID = req.params.id
        const data = req.body

        if (!userID) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.updateUser(userID, data)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userID = req.params.id
        // const token = req.headers

        if (!userID) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.deleteUser(userID)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const getAllUser = async (req, res) => {
    try {

        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userID = req.params.id

        if (!userID) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.getDetailUser(userID)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token

        if (!token) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyUser = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    logoutUser,
    deleteManyUser
}