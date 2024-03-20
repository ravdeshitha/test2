const express = require('express');
const multer = require('multer');
const sendEmail = require('../../Routes/Email');
const router = express.Router();
const db = require('../../Connection');
const moment = require('moment-timezone');

const upload = multer({dest: 'upload/'});

router.post('/sendEmail/:id', upload.array('attachments', 5), async(req, res) =>{
    const msgId = req.params.id;

    const email = req.body.email;
    const subject = req.body.subject;
    const firstName = req.body.firstName;
    const replyMsg = req.body.replyMsg;
    const replyAdmin = req.body.replyAdmin;
    const replyTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    const msgState = 'replied';

    let attachments =[];

    try{
        if(req.files && req.files.length >0){
            for(const file of req.files){
                attachments.push({
                    filename: file.originalname,
                    content: file.buffer
                });
            }
        }

        await sendEmail(email, subject, firstName, replyMsg, attachments);
        res.send("Email send successfully!");

        // Database query for updating guest_contact
        try {
            await new Promise((resolve, reject) => {
                db.query(
                    "UPDATE guest_contact SET replyAdmin=? WHERE msgId =?",
                    [replyAdmin, msgId],
                    (err, result)=>{
                        
                    }
                )
            });
        } catch (error) {
            console.error('Database update error:', error);
            res.status(500).send('Error updating database');
        }
    }
    catch(error){
        console.error('Email send eorror', error);
        res.status(500).send('error sending mail');
    }

    
    

});


router.get('/contact', (req, res) =>{

    db.query(
        "SELECT * FROM guest_contact",
        (err, result) =>{
            if(err){
                res.send({message:'query error', error: err});
            }
            else{
                res.send({message:'success', result: result});
            }
        }
    );
});

router.get('/contact/:id', (req, res) =>{
    const msgId = req.params.id;

    db.query(
        "SELECT * FROM guest_contact WHERE msgId=?",
        [msgId],
        (err, result) =>{
            if(err){
                res.send({message:'query error', error: err});
            }
            else{
                res.send({message:'success', result: result[0]});
            }
        }
    );
});

router.delete('/contact/:id', (req, res) =>{
    const msgId = req.params.id;

    db.query(
        "DELETE FROM guest_contact WHERE msgId=?",
        [msgId],
        (err, result) =>{
            if(err){
                res.send({message:'query error', error: err});
            }
            else{
                res.send({message:' success', result: result});
            }
        }
    );
});

router.put('/contact/:id', (req, res) =>{
    const msgId = req.params.id;
    const msgState = req.body.msgState;

    db.query(
        "UPDATE guest_contact SET msgState=? WHERE msgId =?",
        [msgState, msgId],
        (err, result)=>{
            if(err){
                res.send({message:'query error', error: err});
            }
            else{
                res.send({message:'success', result: result});
            }
        }
    );
});

module.exports = router;