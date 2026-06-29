import PDFDocument from "pdfkit";

export const generateMeetingPDF = (
  meeting: any,
  res: any
) => {
  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${meeting.title}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text(meeting.title);

  doc.moveDown();

  doc.fontSize(14).text("Summary");

  doc.text(meeting.summary || "No summary");

  doc.moveDown();

  doc.text("Action Items");

  meeting.actionItems?.forEach(
    (item: string) => {
      doc.text(`• ${item}`);
    }
  );

  doc.end();
};