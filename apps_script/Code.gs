// Dans Extensions > Apps Script
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function getPlanning() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Planning");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    return headers.reduce((obj, header, i) => {
      obj[header] = row[i];
      return obj;
    }, {});
  });
  return rows;
}

function updatePlanning(plan) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Planning");
  sheet.clearContents();
  const headers = ["ID", "Personne", "Tâche", "Date", "Statut", "Semaine", "Mois", "Année"];
  sheet.appendRow(headers);
  plan.forEach(item => {
    sheet.appendRow([item.id, item.person, item.label, item.date, item.done ? "Accomplie" : "À faire", item.w, item.m, item.y]);
  });
  return "Planning mis à jour";
}

function getStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stats");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    return headers.reduce((obj, header, i) => {
      obj[header] = row[i];
      return obj;
    }, {});
  });
  return rows;
}