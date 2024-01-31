const express = require("express");
const res = require("express/lib/response");
const { google } = require("googleapis");


const app = express();

async function getAuthSheets(){
    const auth = new google.auth.GoogleAuth({
        keyFile:"credentials.json",
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

function calculateStudentSituation(p1, p2, p3, faltas, classes) {
  const media = (p1 + p2 + p3) / 3; 

  if (faltas > 0.25 * classes) {
      return { situation: 'Reprovado por Falta', naf: 0 };
  } else {
      if (media < 50) {
          return { situation: 'Reprovado por Nota', naf: 0 };
      } else if (media >= 50 && media < 70) {
          const naf = Math.ceil((media + 70) / 2);
          return { situation: 'Exame Final', naf };
      } else {
          return { situation: 'Aprovado', naf: 0 };
      }
  }
}


app.get("/get-rows", async (req, res) => {
    const { googleSheets, auth, spreadsheetId, classes } = await getAuthSheets();
  
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "engenharia_de_software!A4:H",
    });
  
    getRows.data.values.forEach(async (row, index) => {
      const p1 = parseInt(row[3]);
      const p2 = parseInt(row[4]);
      const p3 = parseInt(row[5]);
      const faltas = parseInt(row[2]);
      
      const result = calculateStudentSituation(p1, p2, p3, faltas, classes);
  
      console.log(`Situação para ${row[1]}: ${result.situation}, NAF: ${result.naf}`);
  
      
      await updateResults(auth, spreadsheetId, index, result.situation, result.naf);
    });
  
    res.send(getRows.data);
});





app.listen(3001, ()=> console.log("Rodando na porta 3001"))