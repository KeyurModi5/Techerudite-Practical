const express = require('express');
const cors = require('cors');
const router = require('./src/routes/auth');
const sequelize = require('./src/config/database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', router);

sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log('Server started on port 5000');
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
