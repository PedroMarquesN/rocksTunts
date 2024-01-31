const express = require("express");
const res = require("express/lib/response");
const { google } = require("googleapis");


const app = express();

async function getAuthSheets(){
    const auth = new google.auth.GoogleAuth({
        
    })
}