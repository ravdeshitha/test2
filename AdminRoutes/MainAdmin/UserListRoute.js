const express = require('express');
const router = express.Router();
const db = require('../../Connection');

router.get('/userList', (req, res) =>{
    db.query(
        "SELECT * FROM users",
        (err, result) =>{
            if(err){
                res.send(err);
                console.log(err);
            }
            else{
                res.send(result);
            }
        }
    )
});

router.delete('/userList/:id', (req, res) =>{
    const userId = req.params.id;

    db.query(
        "DELETE FROM users WHERE userId =?",
        userId,
        (err, result)=>{
            if(err){
                res.send({message:'delete unsuccess', error: err});
            }
            else{
                res.send({message: "delete success"});
            }
        }
    )
})

module.exports = router;