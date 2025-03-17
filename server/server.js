const express = require("express");
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');


const app = express();
const PORT = process.env.PORT || 8087;


// increase json payload limit
app.use(bodyParser.json({ limit: "50mb" }));  // allow up to 50MB
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(fileUpload()); // Enables file upload handling

// custom middleware logger
app.use(logger);

// handle options credentals check before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// cors
app.use(cors(corsOptions));

// middleware for json objects
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// routes
app.use('/visionAPI', require('./routes/api/visionAPI'));

// custom error handling 
app.use(errorHandler);

// start listening
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})