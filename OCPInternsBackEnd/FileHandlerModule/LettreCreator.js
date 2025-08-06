const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const DownloadsHandler = require("../DatabasesHandlers/DownloadsHandler");
const capitalize = require("capitalize");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

async function generateQRCode(documentId) {
  try {
    const qrCodeBuffer = await QRCode.toBuffer(
      `${process.env.WEB_APP_URL}/verify/${documentId}`
    );
    return qrCodeBuffer;
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}

async function LetterCreator(application) {
  const documentId = uuidv4();
  const qrCodeBuffer = await generateQRCode(documentId);
  const pdfDoc = await PDFDocument.create();
  const ocpLogo = fs.readFileSync(path.join(__dirname, "/Assets", "ocp-group-logo.png"));
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  // Add a blank page to the document (A4 size)
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points

  // Get the width and height    of the page
  const { width, height } = page.getSize();

  // Define padding for all sides
  const padding = 50;

  // Colors
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.4, 0.4, 0.4);

  // Generate unique reference number based on application
  const referenceNumber = `MIKH N°${application.applicationId.slice(-6)}`;

  // Format dates
  const currentDate = new Date().toLocaleDateString("fr-FR");
  const startDate = application.startDate
    ? new Date(application.startDate).toLocaleDateString("fr-FR")
    : "À définir";
  const endDate = application.endDate
    ? new Date(application.endDate).toLocaleDateString("fr-FR")
    : "À définir";

  // Get most recent education for specialization
  const mostRecentEducation =
    application.education && application.education.length > 0
      ? application.education.reduce((latest, current) =>
          new Date(current.startDate) > new Date(latest.startDate)
            ? current
            : latest
        )
      : null;

  const specialization = mostRecentEducation
    ? `${mostRecentEducation.degree}, ${mostRecentEducation.branch}`
    : application.generalInfo?.internField || "Non spécifié";

  // Embed and draw logo (top left)
  const ocpLogoEmbedded = await pdfDoc.embedPng(ocpLogo);
  page.drawImage(ocpLogoEmbedded, {
    x: padding,
    y: height - 120,
    width: 180,
    height: 60,
  });

  const qrCodeEmbedded = await pdfDoc.embedPng(new Uint8Array(qrCodeBuffer).buffer);
  page.drawImage(qrCodeEmbedded, {
    x: width - padding -50,
    y: height - 130,
    width: 50,
    height: 50,
  });

  // Header text (top left, below logo)
  page.drawText("Strategic Business Unit - Mining", {
    x: padding,
    y: height - 140,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  page.drawText("Khouribga Integrated Platform", {
    x: padding,
    y: height - 155,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  page.drawText("Direction Capital Humain", {
    x: padding,
    y: height - 170,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });

  // Reference number (top left) - Dynamic based on application ID
  page.drawText(referenceNumber, {
    x: padding,
    y: height - 200,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });

  // Date (top right) - Dynamic current date
  page.drawText(`Khouribga, le ${currentDate}`, {
    x: width - padding - 250,
    y: height - 170,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });

  // Recipient info (dynamic from application data)
  page.drawText(capitalize.words(application.fullName) || "Nom non spécifié", {
    x: width - padding - 250,
    y: height - 230,
    size: 11,
    font: helveticaBoldFont,
    color: blackColor,
  });
  page.drawText("N° CNI : À compléter", {
    x: width - padding - 250,
    y: height - 250,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  // School info from most recent education
  const schoolInfo = mostRecentEducation?.schoolName || "École non spécifiée";
  page.drawText(`S/c de ${schoolInfo}`, {
    x: width - padding - 250,
    y: height - 270,
    size: 10,
    font: helveticaFont,
    color: blackColor,
    maxWidth: 200,
  });

  // Greeting
  page.drawText("Monsieur,", {
    x: padding,
    y: height - 290,
    size: 11,
    font: helveticaFont,
    color: blackColor,
  });

  // Main paragraph
  const mainText =
    "Suite à votre demande, nous avons l'honneur de vous faire part de notre accord pour l'organisation d'un stage au sein du Groupe OCP.";
  page.drawText(mainText, {
    x: padding,
    y: height - 320,
    size: 10,
    font: helveticaFont,
    color: blackColor,
    maxWidth: width - 2 * padding,
  });

  // Add noticeable spacing before internship details
  const detailsY = height - 370;

  page.drawText("Année d'étude et spécialité", {
    x: 2 * padding,
    y: detailsY,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });
  page.drawText(`: ${specialization}`, {
    x: 250 + padding,
    y: detailsY,
    size: 10,
    font: helveticaFont,
    color: blackColor,
    maxWidth: width - 300 - padding,
  });

  page.drawText("Période de stage", {
    x: 2 * padding,
    y: detailsY - 25,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });
  page.drawText(`: du ${startDate} au ${endDate}`, {
    x: 250 + padding,
    y: detailsY - 25,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });

  page.drawText("Direction d'accueil", {
    x: 2 * padding,
    y: detailsY - 50,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });
  page.drawText(
    `: ${application.department?.name || "Direction du Site de Khouribga"}`,
    {
      x: 250 + padding,
      y: detailsY - 50,
      size: 10,
      font: helveticaFont,
      color: blackColor,
    }
  );

  page.drawText("Entité d'accueil", {
    x: 2 * padding,
    y: detailsY - 75,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });
  page.drawText(
    `: ${
      application.department?.sousDepartment || "Informatique (DSI/CI/P/K)"
    }`,
    {
      x: 250 + padding,
      y: detailsY - 75,
      size: 10,
      font: helveticaFont,
      color: blackColor,
    }
  );

  page.drawText("Parrain de stage", {
    x: 2 * padding,
    y: detailsY - 100,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });
  page.drawText(`: ${application.mentor?.fullName || "À assigner"}`, {
    x: 250 + padding,
    y: detailsY - 100,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });

  page.drawText("Conditions générales", {
    x: 2 * padding,
    y: detailsY - 125,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });

  // Conditions details
  page.drawText("- Hébergement et restauration", {
    x: 2 * padding,
    y: detailsY - 155,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  page.drawText(": à la charge des stagiaires", {
    x: 250 + padding,
    y: detailsY - 155,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });

  page.drawText("- Assurance", {
    x: 2 * padding,
    y: detailsY - 175,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  page.drawText(": Les stagiaires doivent être assurés par leurs", {
    x: 250 + padding,
    y: detailsY - 175,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  page.drawText("  soins ou leur école contre les risques encourus", {
    x: 250 + padding,
    y: detailsY - 190,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  page.drawText("  durant leur séjour au sein du Groupe OCP", {
    x: 250 + padding,
    y: detailsY - 205,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });
  page.drawText("  (accident de travail, de trajet, maladie...)", {
    x: 250 + padding,
    y: detailsY - 220,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });

  // Closing
  page.drawText(
    "  Veuillez agréer, Monsieur, l'expression de nos sentiments distingués.",
    {
      x: 2 * padding,
      y: detailsY - 250,
      size: 10,
      font: helveticaFont,
      color: blackColor,
    }
  );

  // Signature section (right aligned)
  const signatureText1 = "Le Directeur Capital Humain";
  const signatureText2 = "Site de Khouribga";

  // Calculate text width for left alignment
  const signatureText1Width = signatureText1.length * 6; // Approximate width

  page.drawText(signatureText1, {
    x: width - 4 * padding,
    y: detailsY - 270,
    size: 10,
    font: helveticaBoldFont,
    color: blackColor,
  });
  page.drawText(signatureText2, {
    x: width - 4 * padding,
    y: detailsY - 285,
    size: 10,
    font: helveticaFont,
    color: blackColor,
  });

  // Signature space
  page.drawRectangle({
    x: width - padding - 150,
    y: detailsY - 350,
    width: 150,
    height: 50,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
    color: rgb(0.95, 0.95, 0.95),
  });
  page.drawText("[SIGNATURE]", {
    x: width - padding - 110,
    y: detailsY - 328,
    size: 10,
    font: helveticaFont,
    color: grayColor,
  });

  // Footer (with padding and text wrapping)
  const footerY = 80;
  page.drawText("OCP S.A", {
    x: padding,
    y: footerY,
    size: 8,
    font: helveticaBoldFont,
    color: blackColor,
  });

  const footerText1 =
    "Société anonyme au capital de 8 287 500 000 DH• Registre du commerce de Casablanca n° 40327 • Identifiant Fiscal n° 01223794 • Patente n° 35000014";
  page.drawText(footerText1, {
    x: padding,
    y: footerY - 15,
    size: 7,
    font: helveticaFont,
    color: blackColor,
    maxWidth: width - 2 * padding,
  });

  const footerText2 =
    "Bd Abid Al Andaloussi, Hay Elbrahia, 20 100 Casablanca • Maroc•Téléphone/telephone : + 212 (0) 5 22 23 03 69 • 212 (0) 5 22 23 96 06 • 212 (0) 5 22 23 10 25 • 212 (0) 5 22 23 95 40 40";
  page.drawText(footerText2, {
    x: padding,
    y: footerY - 28,
    size: 7,
    font: helveticaFont,
    color: blackColor,
    maxWidth: width - 2 * padding,
  });

  page.drawText("www.ocpgroup.ma", {
    x: padding,
    y: footerY - 41,
    size: 7,
    font: helveticaFont,
    color: blackColor,
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // add to the database
  await DownloadsHandler.createDownload({
    documentId: documentId,
    fullName: capitalize.words(application.fullName),
    applicationId: application.applicationId,
    startDate: application.startDate,
    endDate: application.endDate,
  });

  return pdfBytes;
}

// Export the function and remove the immediate call
module.exports = { LetterCreator };
