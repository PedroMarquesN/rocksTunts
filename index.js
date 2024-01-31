const express = require("express");
const res = require("express/lib/response");
const { google } = require("googleapis");


const app = express();

async function getAuthSheets(){
    const auth = new google.auth.GoogleAuth({
        keyFile:"crendials.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version:"v4",
        auth: client
    });

    const spreadsheetsId = "1XcW_098yY7Kuxbr6c2OnOxIEj0Q-9gptCMaTlNChyHA";
    

    return{
        auth,
        client,
        googleSheets,
        spreadsheetsId,
    }
}