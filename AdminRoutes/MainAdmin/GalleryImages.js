const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const db = require('../../Connection');
const jwt = require('jsonwebtoken');
const { upload,deleteImage, deleteImages } = require('../../imageUpload/Upload');


////////////////////////////////////////////////////////
//ALBUM DETAILS HANDLING ROUTERS////////////////////////
////////////////////////////////////////////////////////
router.post('/album', (req, res) =>{
    const albumName = req.body.albumName;
    const category = req.body.category;
    const albumType = req.body.albumType;
    const adminId = req.body.adminId;
    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    const values = [albumName, category, albumType, adminId, dateTime];

    const token = req.cookies.accessToken;
    if(!token) return res.send("not Logged in");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err) return res.send("Token is not valide!");
        db.query(
            "INSERT INTO album(albumName, category, albumType, adminId, dateTime) VALUES (?)",
            [values],
            (err, result) =>{
                if(err){
                    res.send({error: err});
                }
                else{
                    res.send({message: 'success'});
                }
            }
        );
    });

});

router.get('/album' , (req, res) =>{
    db.query(
        "SELECT * FROM album",
        (err,result) =>{
            if(err){
                res.send({message:'unsuccess', error: err});
            }
            else{
                res.send({message: 'success', result});
            }
        }
    )
});

router.delete('/album/:id', (req, res) => {
    const albumId = req.params.id;
    
    const token = req.cookies.accessToken;
    if(!token) return res.send("not Logged in");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err) return res.send("Token is not valide!");

        db.query(
            "SELECT imgURL FROM galleryimages WHERE albumId = ?",
            albumId,
            (err, imgresult) =>{
                if(err){
                    res.send({message:" err" , error: err});
                }
                else{

                    db.query(
                        "DELETE FROM album WHERE albumId = ?",
                        albumId,
                        (err, result) =>{
                            if(err){
                                res.send({error: err});
                            }
                            else{
                                if (imgresult && imgresult.length > 0) {
                                    const imgs = imgresult.map(row => row.imgURL);
                                    deleteImages(imgs);
                                    db.query(
                                        "DELETE FROM galleryimages WHERE albumId = ?",
                                        albumId,
                                        (err, result) =>{
                                            if(err){
                                                res.send({error: err});
                                            }
                                            else{
                                                res.send({message: 'success', result});
                                            }
                                        }
                                    )
                                } 
                            }
                        }
                    );
                }
            }
        )
        
    });
});

////////////////////////////////////////////////////////
//POSTER DETAILS HANDLING ROUTERS////////////////////////
////////////////////////////////////////////////////////
router.post('/poster',upload.single('posterIMG'), (req, res) =>{
    const posterImage = req.file.filename;

    const posterDataString = req.body.posterData;
    const posterData = JSON.parse(posterDataString);

    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    const token = req.cookies.accessToken;
    if(!token) return res.send("not Logged in");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err) return res.send("Token is not valide!");

        const values = [posterImage, posterData.albumId, posterData.adminId, dateTime];
        
        db.query(
            "INSERT INTO galleryimages(imgURL, albumId,adminId,dateTime) VALUES (?)",
            [values],
            (err, result) =>{
                if(err){
                    res.send({error: err});
                }
                else{
                    res.send({message: 'success'});
                }
            }
        );
    });
});

router.get('/posterAlbum', (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.send("not Logged in");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err) return res.send("Token is not valide!");

        db.query(
            "SELECT i.imgId, i.imgURL, i.albumId, a.albumName, a.category, a.albumType FROM galleryimages AS i JOIN album AS a ON i.albumId = a.albumId WHERE a.albumType = ?",
            ['Event'],
            (err, result) =>{
                if(err){
                    res.send({error: err});
                }
                else{
                    res.send({message: 'success', result});
                }
            }
        );
    });
});

router.delete('/poster/:id/:url', (req, res) => {
    const imgId = req.params.id;
    const imgURL = req.params.url;
    
    const token = req.cookies.accessToken;
    if(!token) return res.send("not Logged in");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err) return res.send("Token is not valide!");

        db.query(
            "DELETE FROM galleryimages WHERE imgId = ?",
            imgId,
            (err, result) =>{
                if(err){
                    res.send({error: err});
                }
                else{
                    deleteImage(imgURL);
                    res.send({message: 'success', result});
                }
            }
        );
    });
});



module.exports = router;