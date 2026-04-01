const express = require('express');

const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const bannerRouter = require('./routes/banner');
const categoryRouter = require('./routes/category');
const subCategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/rating_review');
const brandsRouter = require('./routes/brand');
const vendorRouter = require('./routes/vendor');

const cors = require('cors');


//port number the server will listen on
const PORT = 3000;  

// create an instance
const app = express();

// database connection string
const DB = "mongodb+srv://timNet:2218@cluster0.960xzxw.mongodb.net/TM_App_Store?appName=Cluster0"

//middleware to register the routes or to mount the routes
app.use(express.json()); // This will authentically handle http request sent in json formate from the client side.
app.use(cors()); // To enable cors for all routes and origins(DOMAIN).
app.use(authRouter);
app.use(bannerRouter);
app.use(brandsRouter);
app.use(categoryRouter);
app.use(subCategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);


mongoose.connect(DB).then(() => {
    console.log("DB Connected Successfully");
});


app.listen(PORT, "0.0.0.0", function(){
 console.log(`server is runnng on port ${PORT}`);
});