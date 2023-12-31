// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();
import {connect} from './db/index.js';

//dotenv config done in package.json

connect(); //connect to DB