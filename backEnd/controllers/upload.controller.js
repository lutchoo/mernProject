const UserModel = require('../models/user.model');
// const fs = require('fs');
// const {promisify} = require('util');
// const pipeline = promisify(require('stream').pipeline);
// const path = require('path');
const { uploadErrors } = require('../utils/errors.utils');
const multer = require('multer')




module.exports.uploadProfil = async (req, res) => {
    try {
    
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, '/uploads')
            },
            filename: function (req, file, cb) {
              
              //cb(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}` )
            }
          })
          
          const upload = multer({ storage: storage })
          
    } catch (err) {
        // En cas d'erreur dans le bloc try
        const errors = uploadErrors(err);
        return res.status(400).json({ errors });
    }
};  