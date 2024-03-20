const express = require('express');
// const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
// const db = require('../Connection');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});


const deleteImage = (image) =>{
    const imagePath = path.join('public/images', image);
    try{
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting previous image: " + err);
            } else {
                console.log("Previous image deleted successfully");
            }
        }); 
    }   
    catch(err){
        console.log("photo is not in folder");
    }
}

const deleteImages = (images) =>{
    try{
        for(let i =0; i< images.length; i++){
            const imagePath = path.join('public/images', images[i]);
        
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting previous image: ");
                } else {
                    console.log("Previous image deleted successfully");
                }
            }); 
        
        }
    }
    catch(err){
        console.log("photos are not in folder");
    }
    
}
// router.post('/upload', upload.single('image'), (req, res) => {
//     console.log("ll");
//     const image = req.file.filename;
//     const username = "name";

//     const sql = "INSERT INTO users (usename, image) VALUES (?, ?)";
    
//     db.query(sql, [username, image], (err, result) => {
//         if (err) {
//             console.error("Error inserting image: " + err);
//             return res.json({ message: "error" });
//         }
//         return res.json({ message: "success" });
//     });
// });


module.exports ={
    deleteImages: deleteImages,
    deleteImage : deleteImage,
    upload : upload
}