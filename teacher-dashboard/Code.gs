/****************************************************
 * COLLEGE LESSON HUB — TEACHER DASHBOARD BACKEND
 * Current database structure:
 *
 * Sheet1    → Lectures
 * Subjects  → Subjects
 * Units     → Units
 *
 * Dashboard UI is unchanged.
 ****************************************************/


/* =================================================
   CONFIGURATION
   ================================================= */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

const LECTURE_SHEET = 'Sheet1';
const SUBJECT_SHEET = 'Subjects';
const UNIT_SHEET = 'Units';

const FOLDER_NAME =
  'College Lesson Hub PDFs';


/*
 * ONLY these Google accounts can use
 * teacher/admin functions.
 */
const AUTHORIZED_TEACHERS = [
  'YOUR_TEACHER_EMAIL@example.com'
];


/* =================================================
   WEB APP
   ================================================= */

function doGet() {

  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('College Lesson Hub - Teacher Dashboard')
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


/* =================================================
   SECURITY
   ================================================= */

function requireTeacherAccess() {

  const email =
    String(
      Session
        .getActiveUser()
        .getEmail() || ''
    )
    .trim()
    .toLowerCase();

  if (!email) {

    throw new Error(
      'Please open Dashboard with Google account.'
    );

  }

  if (
    AUTHORIZED_TEACHERS
      .map(function(item) {
        return String(item)
          .trim()
          .toLowerCase();
      })
      .indexOf(email) === -1
  ) {

    throw new Error(
      'You are not authorized to access Teacher Dashboard.'
    );

  }

  return true;
}


/* =================================================
   CURRENT TEACHER
   ================================================= */

function getCurrentTeacher() {

  requireTeacherAccess();

  const email =
    Session
      .getActiveUser()
      .getEmail();

  return {
    email: email
  };

}


/* =================================================
   BASIC HELPERS
   ================================================= */

function getSpreadsheet() {

  return SpreadsheetApp
    .openById(SHEET_ID);

}


function getSheetByName(name) {

  const sheet =
    getSpreadsheet()
      .getSheetByName(name);

  if (!sheet) {

    throw new Error(
      'Sheet not found: ' + name
    );

  }

  return sheet;

}


function normalizeText(value) {

  return String(value == null ? '' : value)
    .trim();

}


function normalizePdfLink(value) {

  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'object') {

    return (
      value.url ||
      value.pdfUrl ||
      value.fileUrl ||
      ''
    );

  }

  return String(value);

}


function rowToObject(headers, row, rowNumber) {

  const obj = {};

  headers.forEach(function(header, index) {

    obj[header] =
      row[index] == null
        ? ''
        : row[index];

  });

  obj.rowNumber =
    rowNumber;

  return obj;

}


function getDataObjects(sheet) {

  const lastRow =
    sheet.getLastRow();

  const lastColumn =
    sheet.getLastColumn();

  if (
    lastRow < 2 ||
    lastColumn < 1
  ) {

    return [];

  }

  const values =
    sheet
      .getRange(
        1,
        1,
        lastRow,
        lastColumn
      )
      .getValues();

  const headers =
    values[0].map(function(header) {

      return normalizeText(header);

    });

  const result = [];

  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    const row =
      values[i];

    const hasData =
      row.some(function(value) {

        return normalizeText(value) !== '';

      });

    if (!hasData) {
      continue;
    }

    result.push(
      rowToObject(
        headers,
        row,
        i + 1
      )
    );

  }

  return result;

}


/* =================================================
   SUBJECTS
   ================================================= */

function getSubjects() {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      SUBJECT_SHEET
    );

  return getDataObjects(sheet);

}


function addSubject(data) {

  requireTeacherAccess();

  if (!data) {
    throw new Error('Subject data missing.');
  }

  const subject =
    normalizeText(data.subject);

  const code =
    normalizeText(data.code);

  const semester =
    normalizeText(data.semester);

  const status =
    normalizeText(data.status) ||
    'Active';

  if (!subject) {

    throw new Error(
      'Subject name is required.'
    );

  }

  const sheet =
    getSheetByName(
      SUBJECT_SHEET
    );

  sheet.appendRow([
    subject,
    code,
    semester,
    status
  ]);

  return 'Subject added successfully.';

}


function updateSubject(row, data) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      SUBJECT_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid subject row.'
    );

  }

  const subject =
    normalizeText(data.subject);

  const code =
    normalizeText(data.code);

  const semester =
    normalizeText(data.semester);

  const status =
    normalizeText(data.status) ||
    'Active';

  if (!subject) {

    throw new Error(
      'Subject name is required.'
    );

  }

  const oldSubject =
    sheet
      .getRange(row, 1)
      .getValue();

  sheet
    .getRange(row, 1, 1, 4)
    .setValues([[
      subject,
      code,
      semester,
      status
    ]]);

  synchronizeSubjectEverywhere(
    oldSubject,
    subject
  );

  return 'Subject updated successfully.';

}


function updateSubjectStatus(
  row,
  newStatus
) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      SUBJECT_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid subject row.'
    );

  }

  sheet
    .getRange(row, 4)
    .setValue(
      normalizeText(newStatus)
    );

  return 'Subject status updated.';

}


function deleteSubject(row) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      SUBJECT_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid subject row.'
    );

  }

  const subject =
    sheet
      .getRange(row, 1)
      .getValue();

  sheet.deleteRow(row);

  /*
   * We do not delete lectures automatically.
   * Existing lecture data is preserved.
   */

  return (
    'Subject deleted: ' +
    subject
  );

}


/* =================================================
   SUBJECT SYNCHRONIZATION
   ================================================= */

function synchronizeSubjectEverywhere(
  oldSubject,
  newSubject
) {

  const oldValue =
    normalizeText(oldSubject);

  const newValue =
    normalizeText(newSubject);

  if (!oldValue) {
    return;
  }


  /* ---------- Units ---------- */

  const unitSheet =
    getSheetByName(
      UNIT_SHEET
    );

  const unitData =
    getDataObjects(unitSheet);

  unitData.forEach(function(item) {

    if (
      normalizeText(item.Subject) ===
      oldValue
    ) {

      unitSheet
        .getRange(
          item.rowNumber,
          1
        )
        .setValue(newValue);

    }

  });


  /* ---------- Sheet1 ---------- */

  const lectureSheet =
    getSheetByName(
      LECTURE_SHEET
    );

  const lectureData =
    getDataObjects(
      lectureSheet
    );

  lectureData.forEach(function(item) {

    if (
      normalizeText(item.Subject) ===
      oldValue
    ) {

      const headers =
        getHeaders(lectureSheet);

      const subjectColumn =
        findHeaderColumn(
          headers,
          'Subject'
        );

      if (subjectColumn) {

        lectureSheet
          .getRange(
            item.rowNumber,
            subjectColumn
          )
          .setValue(newValue);

      }

    }

  });

}


/* =================================================
   UNITS
   ================================================= */

function getUnits() {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      UNIT_SHEET
    );

  return getDataObjects(sheet);

}


function addUnit(data) {

  requireTeacherAccess();

  if (!data) {
    throw new Error('Unit data missing.');
  }

  // Accept the field names used by the existing Dashboard,
  // plus common capitalization variants.
  const subject = normalizeText(
    data.subject || data.Subject || data.subjectName
  );

  const unit = normalizeText(
    data.unit || data.Unit || data.unitName
  );

  const title = normalizeText(
    data.title || data.Title || data.unitTitle || data.description
  );

  const status = normalizeText(
    data.status || data.Status
  ) || 'Active';

  if (!subject) {
    throw new Error('Subject is required for the Unit.');
  }

  if (!unit) {
    throw new Error('Unit number/name is required.');
  }

  if (!title) {
    throw new Error('Unit title is required.');
  }

  const sheet = getSheetByName(UNIT_SHEET);

  // Ensure the Units sheet has the expected four columns.
  const headers = getHeaders(sheet);

  if (headers.length < 4) {
    throw new Error(
      'Units sheet must have these columns in row 1: Subject, Unit, Title, Status.'
    );
  }

  // Prevent accidental duplicate Unit records for the same Subject.
  const existing = getDataObjects(sheet);

  const duplicate = existing.some(function(item) {
    return (
      normalizeText(item.Subject).toLowerCase() === subject.toLowerCase() &&
      normalizeText(item.Unit).toLowerCase() === unit.toLowerCase()
    );
  });

  if (duplicate) {
    throw new Error(
      'This Unit already exists for the selected Subject.'
    );
  }

  sheet.appendRow([
    subject,
    unit,
    title,
    status
  ]);

  SpreadsheetApp.flush();

  return 'Unit added successfully.';
}


function updateUnit(row, data) {

  requireTeacherAccess();

  const sheet = getSheetByName(UNIT_SHEET);

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {
    throw new Error('Invalid unit row.');
  }

  if (!data) {
    throw new Error('Unit data missing.');
  }

  const newSubject = normalizeText(
    data.subject || data.Subject || data.subjectName
  );

  const newUnit = normalizeText(
    data.unit || data.Unit || data.unitName
  );

  const newTitle = normalizeText(
    data.title || data.Title || data.unitTitle || data.description
  );

  const newStatus = normalizeText(
    data.status || data.Status
  ) || 'Active';

  if (!newSubject) {
    throw new Error('Subject is required for the Unit.');
  }

  if (!newUnit) {
    throw new Error('Unit number/name is required.');
  }

  if (!newTitle) {
    throw new Error('Unit title is required.');
  }

  const oldValues = sheet
    .getRange(row, 1, 1, 4)
    .getValues()[0];

  const oldSubject = oldValues[0];
  const oldUnit = oldValues[1];

  // Prevent duplicate Subject + Unit combinations,
  // except for the record currently being edited.
  const existing = getDataObjects(sheet);

  const duplicate = existing.some(function(item) {
    return (
      item.rowNumber !== row &&
      normalizeText(item.Subject).toLowerCase() === newSubject.toLowerCase() &&
      normalizeText(item.Unit).toLowerCase() === newUnit.toLowerCase()
    );
  });

  if (duplicate) {
    throw new Error(
      'Another Unit with this Subject and Unit already exists.'
    );
  }

  sheet
    .getRange(row, 1, 1, 4)
    .setValues([[
      newSubject,
      newUnit,
      newTitle,
      newStatus
    ]]);

  SpreadsheetApp.flush();

  synchronizeUnitEverywhere(
    oldSubject,
    oldUnit,
    newSubject,
    newUnit
  );

  return 'Unit updated successfully.';
}


function updateUnitStatus(
  row,
  newStatus
) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      UNIT_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid unit row.'
    );

  }

  sheet
    .getRange(row, 4)
    .setValue(
      normalizeText(newStatus)
    );

  return 'Unit status updated.';

}


function deleteUnit(row) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      UNIT_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid unit row.'
    );

  }

  sheet.deleteRow(row);

  return 'Unit deleted successfully.';

}


/* =================================================
   UNIT SYNCHRONIZATION
   ================================================= */

function synchronizeUnitEverywhere(
  oldSubject,
  oldUnit,
  newSubject,
  newUnit
) {

  const oldSubjectValue =
    normalizeText(oldSubject);

  const oldUnitValue =
    normalizeText(oldUnit);

  const newSubjectValue =
    normalizeText(newSubject);

  const newUnitValue =
    normalizeText(newUnit);


  const lectureSheet =
    getSheetByName(
      LECTURE_SHEET
    );

  const headers =
    getHeaders(
      lectureSheet
    );

  const subjectColumn =
    findHeaderColumn(
      headers,
      'Subject'
    );

  const unitColumn =
    findHeaderColumn(
      headers,
      'Unit'
    );

  if (
    !subjectColumn ||
    !unitColumn
  ) {

    return;

  }


  const data =
    getDataObjects(
      lectureSheet
    );

  data.forEach(function(item) {

    if (
      normalizeText(item.Subject) ===
        oldSubjectValue &&
      normalizeText(item.Unit) ===
        oldUnitValue
    ) {

      lectureSheet
        .getRange(
          item.rowNumber,
          subjectColumn
        )
        .setValue(
          newSubjectValue
        );

      lectureSheet
        .getRange(
          item.rowNumber,
          unitColumn
        )
        .setValue(
          newUnitValue
        );

    }

  });

}


/* =================================================
   LECTURES
   ================================================= */

function getLectures() {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      LECTURE_SHEET
    );

  return getDataObjects(sheet);

}


function addLecture(data) {

  requireTeacherAccess();

  if (!data) {

    throw new Error(
      'Lecture data missing.'
    );

  }

  const subject =
    normalizeText(data.subject);

  const unit =
    normalizeText(data.unit);

  const lecture =
    normalizeText(data.lecture);

  const description =
    normalizeText(data.description);

  const pdfLink =
    normalizePdfLink(
      data.pdfLink ||
      data.pdf ||
      data.PDFLink
    );

  const status =
    normalizeText(data.status) ||
    'Draft';

  if (
    !subject ||
    !unit ||
    !lecture
  ) {

    throw new Error(
      'Please fill all Lecture fields.'
    );

  }

  const sheet =
    getSheetByName(
      LECTURE_SHEET
    );

  const headers =
    getHeaders(sheet);

  const row =
    headers.map(function(header) {

      const key =
        normalizeText(header)
          .toLowerCase();

      if (key === 'subject') {
        return subject;
      }

      if (key === 'unit') {
        return unit;
      }

      if (key === 'lecture') {
        return lecture;
      }

      if (
        key === 'description'
      ) {
        return description;
      }

      if (
        key === 'pdf link' ||
        key === 'pdflink'
      ) {
        return pdfLink;
      }

      if (key === 'status') {
        return status;
      }

      return '';

    });

  sheet.appendRow(row);

  return 'Lecture added successfully.';

}


function updateLecture(
  row,
  data
) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      LECTURE_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid lecture row.'
    );

  }

  const headers =
    getHeaders(sheet);

  const values =
    headers.map(function(header) {

      const key =
        normalizeText(header)
          .toLowerCase();

      if (key === 'subject') {
        return normalizeText(
          data.subject
        );
      }

      if (key === 'unit') {
        return normalizeText(
          data.unit
        );
      }

      if (key === 'lecture') {
        return normalizeText(
          data.lecture
        );
      }

      if (
        key === 'description'
      ) {
        return normalizeText(
          data.description
        );
      }

      if (
        key === 'pdf link' ||
        key === 'pdflink'
      ) {

        return normalizePdfLink(
          data.pdfLink ||
          data.pdf
        );

      }

      if (key === 'status') {
        return normalizeText(
          data.status
        );
      }

      /*
       * Preserve any unknown existing
       * column values.
       */
      return sheet
        .getRange(
          row,
          headers.indexOf(header) + 1
        )
        .getValue();

    });

  sheet
    .getRange(
      row,
      1,
      1,
      values.length
    )
    .setValues([values]);

  return 'Lecture updated successfully.';

}


function updateLectureStatus(
  row,
  newStatus
) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      LECTURE_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid lecture row.'
    );

  }

  const headers =
    getHeaders(sheet);

  const statusColumn =
    findHeaderColumn(
      headers,
      'Status'
    );

  if (!statusColumn) {

    throw new Error(
      'Status column not found.'
    );

  }

  sheet
    .getRange(
      row,
      statusColumn
    )
    .setValue(
      normalizeText(newStatus)
    );

  return 'Lecture status updated.';

}


function deleteLecture(row) {

  requireTeacherAccess();

  const sheet =
    getSheetByName(
      LECTURE_SHEET
    );

  if (
    row < 2 ||
    row > sheet.getLastRow()
  ) {

    throw new Error(
      'Invalid lecture row.'
    );

  }

  sheet.deleteRow(row);

  return 'Lecture deleted successfully.';

}


/* =================================================
   PDF UPLOAD
   ================================================= */

function getPdfFolder() {

  const folders =
    DriveApp
      .getFoldersByName(
        FOLDER_NAME
      );

  if (folders.hasNext()) {

    return folders.next();

  }

  return DriveApp
    .createFolder(
      FOLDER_NAME
    );

}


function uploadPDF(
  base64Data,
  fileName,
  mimeType
) {

  requireTeacherAccess();

  if (!base64Data) {

    throw new Error(
      'PDF file content is missing.'
    );

  }

  const folder =
    getPdfFolder();

  const decoded =
    Utilities.base64Decode(
      base64Data
    );

  const blob =
    Utilities.newBlob(
      decoded,
      mimeType ||
        'application/pdf',
      fileName ||
        'lecture.pdf'
    );

  const file =
    folder.createFile(blob);

  try {

    file.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW
    );

  } catch (error) {

    console.log(
      'Sharing permission could not be changed: ' +
      error.message
    );

  }

  return {

    fileId:
      file.getId(),

    fileName:
      file.getName(),

    url:
      'https://drive.google.com/file/d/' +
      file.getId() +
      '/view'

  };

}


/*
 * Compatibility alias.
 */

function uploadFile(
  fileData
) {

  requireTeacherAccess();

  if (!fileData) {

    throw new Error(
      'File data missing.'
    );

  }

  /*
   * Supports the old frontend object format.
   */
  if (
    typeof fileData === 'object'
  ) {

    return uploadPDF(
      fileData.base64 ||
      fileData.data ||
      fileData.base64Data,
      fileData.name ||
      fileData.fileName,
      fileData.type ||
      fileData.mimeType
    );

  }

  return uploadPDF(
    fileData
  );

}


/* =================================================
   DASHBOARD STATISTICS
   ================================================= */

/*
 * IMPORTANT:
 *
 * The Dashboard expects:
 *
 * totalSubjects
 * activeSubjects
 * totalUnits
 * totalLectures
 * publishedLectures
 *
 * The old backend returned:
 *
 * subjects
 * units
 * lectures
 * published
 *
 * That mismatch caused the Dashboard
 * to display 0.
 */

function getStats() {

  requireTeacherAccess();

  const subjects =
    getSubjects();

  const units =
    getUnits();

  const lectures =
    getLectures();


  const activeSubjects =
    subjects.filter(
      function(item) {

        return normalizeText(
          item.Status
        )
        .toLowerCase() ===
        'active';

      }
    );


  const publishedLectures =
    lectures.filter(
      function(item) {

        return normalizeText(
          item.Status
        )
        .toLowerCase() ===
        'published';

      }
    );


  const drafts =
    lectures.filter(
      function(item) {

        return normalizeText(
          item.Status
        )
        .toLowerCase() !==
        'published';

      }
    );


  return {

    /*
     * Current Dashboard names
     */
    totalSubjects:
      subjects.length,

    activeSubjects:
      activeSubjects.length,

    totalUnits:
      units.length,

    totalLectures:
      lectures.length,

    publishedLectures:
      publishedLectures.length,


    /*
     * Older names retained
     * for compatibility.
     */
    subjects:
      subjects.length,

    units:
      units.length,

    lectures:
      lectures.length,

    published:
      publishedLectures.length,

    drafts:
      drafts.length

  };

}


/* =================================================
   GENERAL SHEET HELPERS
   ================================================= */

function getHeaders(sheet) {

  if (
    sheet.getLastColumn() < 1
  ) {

    return [];

  }

  return sheet
    .getRange(
      1,
      1,
      1,
      sheet.getLastColumn()
    )
    .getValues()[0]
    .map(function(header) {

      return normalizeText(
        header
      );

    });

}


function findHeaderColumn(
  headers,
  name
) {

  const target =
    normalizeText(name)
      .toLowerCase();

  for (
    let i = 0;
    i < headers.length;
    i++
  ) {

    if (
      normalizeText(
        headers[i]
      ).toLowerCase() ===
      target
    ) {

      return i + 1;

    }

  }

  return 0;

}


/* =================================================
   REPAIR SHEET1
   ================================================= */

/*
 * Rebuilds Subject + Unit values
 * in Sheet1 using the Units sheet.
 *
 * DOES NOT delete lectures.
 */

function repairSheet1FromUnits() {

  requireTeacherAccess();

  const unitSheet =
    getSheetByName(
      UNIT_SHEET
    );

  const lectureSheet =
    getSheetByName(
      LECTURE_SHEET
    );

  const units =
    getDataObjects(
      unitSheet
    );

  const lectures =
    getDataObjects(
      lectureSheet
    );

  const lectureHeaders =
    getHeaders(
      lectureSheet
    );

  const subjectColumn =
    findHeaderColumn(
      lectureHeaders,
      'Subject'
    );

  const unitColumn =
    findHeaderColumn(
      lectureHeaders,
      'Unit'
    );

  if (
    !subjectColumn ||
    !unitColumn
  ) {

    throw new Error(
      'Subject or Unit column not found in Sheet1.'
    );

  }


  lectures.forEach(
    function(lecture) {

      const matchingUnit =
        units.find(
          function(unit) {

            return (
              normalizeText(
                unit.Unit
              ) ===
              normalizeText(
                lecture.Unit
              )
            );

          }
        );


      if (matchingUnit) {

        lectureSheet
          .getRange(
            lecture.rowNumber,
            subjectColumn
          )
          .setValue(
            matchingUnit.Subject
          );

      }

    }
  );


  return (
    'Sheet1 repaired successfully.'
  );

}


/* =================================================
   TEST CONNECTION
   ================================================= */

function testConnection() {

  requireTeacherAccess();

  const spreadsheet =
    getSpreadsheet();

  return {

    success: true,

    spreadsheet:
      spreadsheet.getName(),

    spreadsheetId:
      spreadsheet.getId(),

    teacher:
      Session
        .getActiveUser()
        .getEmail()

  };

}


/* =================================================
   TEST TEACHER AUTHORIZATION
   ================================================= */

function testTeacherAuthorization() {

  requireTeacherAccess();

  return {

    authorized: true,

    email:
      Session
        .getActiveUser()
        .getEmail(),

    message:
      'Teacher authorization is working.'

  };

}


/* =================================================
   CHECK CURRENT GOOGLE ACCOUNT
   ================================================= */

function checkCurrentGoogleAccount() {

  const activeEmail =
    Session
      .getActiveUser()
      .getEmail();

  const effectiveEmail =
    Session
      .getEffectiveUser()
      .getEmail();

  Logger.log(
    'Active User: ' +
    activeEmail
  );

  Logger.log(
    'Effective User: ' +
    effectiveEmail
  );

  return {

    activeUser:
      activeEmail,

    effectiveUser:
      effectiveEmail

  };

}


/* =================================================
   SHEET1 SYNCHRONIZATION TEST
   ================================================= */

function testSheet1Sync() {

  requireTeacherAccess();

  const subjects =
    getSubjects();

  const units =
    getUnits();

  const lectures =
    getLectures();

  return {

    subjects:
      subjects,

    units:
      units,

    lectures:
      lectures,

    message:
      'Sheet1 synchronization test completed.'

  };

}