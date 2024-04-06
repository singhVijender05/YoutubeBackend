// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();
import {connect} from './db/index.js';
import app from './app.js';

//dotenv config done in package.json
 //connect to DB
connect()
.then(
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    })
)
.catch((err) => {
    console.error(err);
    process.exit(1);
})
