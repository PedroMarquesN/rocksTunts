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

    const spreadsheetId = "1XcW_098yY7Kuxbr6c2OnOxIEj0Q-9gptCMaTlNChyHA";
    const classesRange = "engenharia_de_software!A2";

    const classesData = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: classesRange,
      });


    const classes = parseInt(classesData.data.values[0][0]);

    
    return{
        auth,
        client,
        googleSheets,
        spreadsheetId,
    }
}


async function updateResults(auth, spreadsheetId, row, situation, naf) {
    const sheets = google.sheets({ version: "v4", auth });
  
    const range = `engenharia_de_software!G${row + 4}:H${row + 4}`;
    const values = [[situation, naf]];
  
    const resource = {
      values,
    };
  
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource,
      });
  
    } catch (err) {
      console.error(`Error updating results for row ${row + 4}:`, err);
    }
  }





app.listen(3001, ()=> console.log("Rodando na porta 3001"))