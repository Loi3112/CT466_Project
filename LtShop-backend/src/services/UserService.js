const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'The email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERROR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'ERROR',
                    message: 'The password or user is incorret'
                })
            }
            const access_token = genneralAccessToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'Succes',
                access_token,
                refresh_token

            })



        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne(
                {
                    _id: id
                }
            )
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'Succes',
                data: updateUser

            })



        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne(
                {
                    _id: id
                }
            )
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete User Succes',
            })



        } catch (e) {
            reject(e)
        }
    })
}


const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Succes',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const user = await User.findOne(
                {
                    _id: id
                }
            )
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Succes',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = async (ids) => {
    try {
        const result = await User.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return {
                status: 'ERROR',
                message: 'No users were deleted',
            };
        }
        return {
            status: 'OK',
            message: 'Delete Users Success',
        };
    } catch (error) {
        throw error;
    }
};



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    deleteManyUser
}