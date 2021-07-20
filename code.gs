function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty("spreadsheetid",doc.getId());
  var folders = getWorkingFolders("temp","pdfs","MFN 01 certificate");
  PropertiesService.getScriptProperties().setProperty("tempFolder",folders.temp.getId());
  PropertiesService.getScriptProperties().setProperty("pdfsFolder",folders.pdfs.getId());
  PropertiesService.getScriptProperties().setProperty("template",folders.template.getId());
  PropertiesService.getScriptProperties().setProperty("certNumber",1111);
}

function doGet(request) {
  var email = request.parameter.email;
  var oper = request.parameter.oper;
  try {
    if (email != null) {
      if (oper == "find") {
        Logger.log("Finding PDF for "+email);
        var pdfURL = getPDF(email);
        Logger.log("PDF URL:"+pdfURL);
        return ContentService.createTextOutput(JSON.stringify({"data":{"pdfURL":pdfURL,"email":email},"error":false})).setMimeType(ContentService.MimeType.JSON);
      } else if (oper == "generate") {
        Logger.log("Generating PDF for "+email);
        var data = findMatchingRow(email);
        if (data) {
          var pdfFile = generateFiles(data);
          return ContentService.createTextOutput(JSON.stringify({"data":{"filename":pdfFile.getName(),"email":email},"error":false})).setMimeType(ContentService.MimeType.JSON);
        }
        return ContentService.createTextOutput(JSON.stringify({"data":"","error":"Could not find data for "+email})).setMimeType(ContentService.MimeType.JSON);
      }
    } else if (oper == null) {
      return HtmlService.createHtmlOutputFromFile('Index');
    }
    return ContentService.createTextOutput(JSON.stringify({"data":"","error":"Email Not Specified"})).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({"data":"","error":e.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost (request) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    if (request.parameter['Full Name'] == null || request.parameter['Email Address'] == null) {
      return ContentService
          .createTextOutput(JSON.stringify({ 'result': 'error', 'error': "Full Name or Email Address not specified" }))
          .setMimeType(ContentService.MimeType.JSON);
    }
    var newRow = addNewRow(request.parameter);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService
          .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
          .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function generateCertificateNumber(info) {
  // get last number and increment
  var certNum = PropertiesService.getScriptProperties().getProperty("certNumber");
  certNum++;
  PropertiesService.getScriptProperties().setProperty("certNumber",certNum);
  // get current date
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var currDate = new Date();
  var dateString = currDate.getDate()+"-"+months[currDate.getMonth()]+"-"+currDate.getFullYear();
  info['certificate-id']=currDate.getFullYear()+"."+certNum;
  info['date']=dateString;
  return info;
}

function findMatchingRow(email) {
  var sheetName = "Form Responses";
  var doc = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("spreadsheetid"));
  var sheet = doc.getSheetByName(sheetName);
   
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var rows = [];
  var range = sheet.getRange(2,1,lastRow,lastCol);
  var header = sheet.getRange(1,1,1,lastCol).getValues()[0];
  var values = range.getValues();
  for (var row in values) {
    rows.push([]);
    for (var col in values[row]) {
      rows[row].push(values[row][col]);
    }
  }
  if (email != null) {
    // assumes that email is in second column!
    var matchedRows = rows.filter(a => a[1] == email);
    var data = [];
    for (var col=0;col<header.length;col++) {
      data[header[col]]=matchedRows[matchedRows.length-1][col];
      Logger.log(data[header[col]]);
    }
    return data;
  }
  return rows;
}

function getLastRow() {
  var sheetName = "Form Responses";
  var doc = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("spreadsheetid"));
  var sheet = doc.getSheetByName(sheetName);

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var range = sheet.getRange(lastRow,1,lastRow,lastCol);
  var header = sheet.getRange(1,1,1,lastCol).getValues()[0];
  var values = range.getValues()[0];

  Logger.log(header);
  Logger.log(values);

  var data = [];
  for (var row=0;row<header.length;row++) {
    data[header[row]]=values[row];
    Logger.log(data[header[row]]);
  }
  return data;
}

function addNewRow(params) {
  var sheetName = "Form Responses";
  var doc = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("spreadsheetid"));
  var sheet = doc.getSheetByName(sheetName);

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var nextRow = sheet.getLastRow() + 1;

  var newRow = headers.map(function(header) {
    return header === 'Timestamp' ? new Date().toLocaleString() : params[header];
  });

  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

  return newRow;
}

function getParentFolder(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var file = DriveApp.getFileById(ss.getId());
  var folders = file.getParents();
  var parentFolder = folders.next();
  Logger.log('folder name = '+parentFolder.getName());
  return parentFolder;
}

function getWorkingFolders(tempFolderName,pdfsFolderName,templateFileName) {
  var parentFolder=getParentFolder();
  var folders = parentFolder.getFoldersByName(tempFolderName);
  var tempFolder = folders.next();
  Logger.log('temp folder = '+tempFolder.getName());
  folders = parentFolder.getFoldersByName(pdfsFolderName);
  var pdfsFolder = folders.next();
  Logger.log('PDFs folder = '+pdfsFolder.getName());
  var files = parentFolder.getFilesByName(templateFileName);
  var templateDoc=files.next();
  Logger.log('Template Doc = '+templateDoc.getId());
  return {
    "temp":tempFolder,
    "pdfs":pdfsFolder,
    "template":templateDoc,
  };
}

function generatePDF(e) {
  const info = e.namedValues;
  var data=[];
  for (var k in info) {
    data[k]=info[k][0];
  }
  Logger.log(data);
  return generateFiles(data);
}

function generateFiles(info) {
  const templateFile = DriveApp.getFileById(PropertiesService.getScriptProperties().getProperty("template"));
  const pdfsFolder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty("pdfsFolder"));
  const tempFolder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty("tempFolder"));

  const newTempFile = templateFile.makeCopy(tempFolder);
  const tempFile = SlidesApp.openById(newTempFile.getId());
  generateCertificateNumber(info);

  tempFile.setName(info['Email Address']);  
  tempFile.replaceAllText("{{Full Name}}", info['Full Name']);
  tempFile.replaceAllText("{{certificate-id}}", info['certificate-id']);
  tempFile.replaceAllText("{{date}}", info['date']);

  tempFile.saveAndClose();

  const blobPDF = newTempFile.getAs(MimeType.PDF);
  const pdfFile = pdfsFolder.createFile(blobPDF).setName(info['Email Address']);
  Logger.log("The PDF has been created for "+info['Email Address']);

  return pdfFile;
}

function getPDF(email) {
  const pdfsFolder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty("pdfsFolder"));
  const pdfFile = pdfsFolder.getFilesByName(email);
  if (pdfFile.hasNext()) {
    const fileHandle = pdfFile.next();
    Logger.log(fileHandle.getUrl());
    return fileHandle.getUrl();
  } else {
    Logger.log("No file found matching "+email);
  }
  return null;
}

function testGenerateFile() {
  var info = {
    "Full Name":["John Hopkins"],
    "Country":["USA"],
    "Email":["john@hopkins.com"]
  }
  addNewRow(info);
}

function testGenerate() {
  var data = findMatchingRow("bijoor@gmail.com");
  generateFiles(data);
}

function testGetPDF() {
  getPDF("bijoor@gmail.com");
}

