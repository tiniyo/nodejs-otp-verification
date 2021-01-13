require('dotenv').config();
const btoa = require("btoa");

const AuthId= process.env.AuthID;
const AuthSecretId = process.env.AuthSecretID;
const basicAuth=btoa(`${AuthId}:${AuthSecretId}`);

const config = {
    AuthID:AuthId,
    encodedAuth:basicAuth
};
module.exports= config;