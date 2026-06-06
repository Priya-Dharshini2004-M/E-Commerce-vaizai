const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoice(order, filePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(20).text('Tax Invoice', { align: 'center' });
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Date: ${order.createdAt}`);
  // add items, GST calculation, total
  doc.end();
}