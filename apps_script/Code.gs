/**
 * Backend Apps Script — Poubelles Copro (Google Sheets)
 * - Crée un classeur avec une feuille 'State' si absente
 * - Stocke tout l'état en JSON (cellule A1)
 * - Expose une Web API GET/POST
 *
 * Déployez en "Application web", accessibles à "Toute personne disposant du lien".
 */

const SHEET_NAME = 'State';

function getSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange('A1').setValue('{}');
  }
  return sh;
}

function readState_() {
  const sh = getSheet_();
  const val = sh.getRange('A1').getValue();
  try {
    return JSON.parse(val || '{}');
  } catch (e) {
    return {};
  }
}

function writeState_(obj) {
  const sh = getSheet_();
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    sh.getRange('A1').setValue(JSON.stringify(obj));
  } finally {
    lock.releaseLock();
  }
}

function buildResponse_(status, bodyObj) {
  return ContentService
    .createTextOutput(JSON.stringify(bodyObj || {}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || 'state';
  if (action === 'state') {
    const state = readState_();
    return addCors_(buildResponse_(200, state));
  }
  return addCors_(buildResponse_(400, { error: 'Unknown action' }));
}

function doPost(e) {
  let payload = {};
  try {
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    return addCors_(buildResponse_(400, { error: 'Bad JSON' }));
  }
  const action = payload.action || 'state';
  if (action === 'state') {
    writeState_(payload.payload || {});
    return addCors_(buildResponse_(200, { ok: true }));
  }
  return addCors_(buildResponse_(400, { error: 'Unknown action' }));
}

/** CORS */
function doOptions(e) { return addCors_(buildResponse_(200, { ok: true })); }
function addCors_(output) {
  output.append('\n');
  const resp = output;
  resp.setMimeType(ContentService.MimeType.JSON);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  // Apps Script ContentService n'a pas d'API setHeaders, mais le déploiement en Web App gère CORS via HtmlService si besoin.
  // Pour ContentService, on contourne via la publication "toute personne ayant le lien".
  return resp;
}
