require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const btoa = require("btoa");

const app= express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const AuthId= process.env.AuthID;
const AuthSecretId = process.env.AuthSecretID;
const basicAuth = `${AuthId}:${AuthSecretId}`;
const encodedAuth = btoa(basicAuth);

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",async (req,res)=>{
    const number = req.body.number;    
    
    const url= `https://api.tiniyo.com/v1/Account/${AuthId}/Verifications`;
    const options={
        method:"POST",
        headers:{
            "Authorization": `Basic ${encodedAuth}`,
            "content-type": "application/json"
        },
        body:JSON.stringify({
            "dst":`91${number}`
        })
    };
    const response= await fetch(url,options)
    .then(res=> res.json())
    .then(data=> {
        console.log(data);
    })
    .catch(err=>{
        console.log(err);
    });
    res.redirect("/otp");
});

app.get("/otp",(req,res)=>{
    res.sendFile(__dirname+"/public/verification.html");
});

app.post("/otp",async (req,res)=>{
    const number = req.body.number;    
    const otp= req.body.otp;

    const url= `https://api.tiniyo.com/v1/Account/${AuthId}/VerificationsCheck`;
    const options={
        method:"POST",
        headers:{
            "Authorization": `Basic ${encodedAuth}`,
            "content-type": "application/json"
        },
        body:JSON.stringify({
            "dst":`91${number}`,
            "code":`${otp}`
        })
    };
    const response= await fetch(url,options)
    .then(res=> res.json())
    .then(data=> {
        if(data.status==="success"){
            res.redirect("/success");
        }else{
            res.redirect("/fail"); 
        }
    })
    .catch(err=>{
        console.log(err);
    });
});

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/public/success.html");
});
app.get("/fail",(req,res)=>{
    res.sendFile(__dirname+"/public/fail.html");
})

app.listen("3001",()=>{
    console.log("Server started on port 3000");
});