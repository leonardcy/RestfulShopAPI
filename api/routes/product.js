const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/product')


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(res, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}


const upload = multer({
    storage: storage, 
    limit: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
})


//handles incoming get requests
router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId',ProductsController.products_update_product);

router.delete('/:productId', ProductsController.products_delete_product)

module.exports = router