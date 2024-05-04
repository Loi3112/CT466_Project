const ProductService = require('../services/ProductService')


const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description, discount } = req.body


        if (!name || !image || !type || !price || !countInStock || !rating || !discount) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is required'
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

// const createProduct = async (req, res) => {
//     try {
//         const { name, image, type, price, countInStock, rating } = req.body;

//         const requiredFields = ['name', 'image', 'type', 'price', 'countInStock', 'rating'];
//         const missingFields = requiredFields.filter(field => !req.body[field]);

//         if (missingFields.length > 0) {
//             return res.status(400).json({
//                 status: 'ERROR',
//                 message: `The following fields are required: ${missingFields.join(', ')}`
//             });
//         }

//         const response = await ProductService.createProduct(req.body);
//         return res.status(200).json(response);
//     } catch (error) {
//         return res.status(404).json({
//             message: error
//         });
//     }
// }


const updateProduct = async (req, res) => {
    try {
        const productID = req.params.id
        const data = req.body

        if (!productID) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The productID is required'
            })
        }
        const response = await ProductService.updateProduct(productID, data)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}




const deleteProduct = async (req, res) => {
    try {
        const productID = req.params.id

        if (!productID) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The productID is required'
            })
        }
        const response = await ProductService.deleteProduct(productID)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}


const getAllProduct = async (req, res) => {
    try {

        const {limit , page , sort, filter} = req.query
        const response = await ProductService.getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const getDetailProduct = async (req, res) => {
    try {
        const productID = req.params.id

        if (!productID) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The productID is required'
            })
        }
        const response = await ProductService.getDetailProduct(productID)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}


const deleteManyProduct = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'The ids is required'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

const getAllType = async (req, res) => {
    try {

        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json(
            {
                message: error
            })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct, 
    deleteManyProduct,
    getAllType
}