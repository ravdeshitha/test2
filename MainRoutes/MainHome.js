const express = require('express');
const router = express.Router();


//admin route path
const Contact = require('./MainHomeRoutes/Contact');
const Events = require('./MainHomeRoutes/Events');
const Owners = require('./MainHomeRoutes/Owners');

//asign routers
router.use('/contact',Contact);//MainHome Api Route file path
router.use(Events);
router.use(Owners);


module.exports = router;