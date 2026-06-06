const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = (order, invoiceNumber, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
      }

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Header Banner
      doc
        .fillColor('#1e3a8a')
        .fontSize(20)
        .text('VAIZAI E-COMMERCE PLATFORM', 50, 50, { align: 'left' })
        .fontSize(10)
        .fillColor('#6b7280')
        .text('AI-Powered Multi-Vendor SaaS', 50, 75)
        .moveDown();

      // Invoice metadata
      doc
        .fillColor('#1f2937')
        .fontSize(12)
        .text(`TAX INVOICE / BILL OF SUPPLY`, 300, 50, { align: 'right' })
        .fontSize(10)
        .text(`Invoice No: ${invoiceNumber}`, 300, 65, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 300, 80, { align: 'right' })
        .text(`Order ID: ${order._id.toString().substring(0, 8)}...`, 300, 95, { align: 'right' })
        .moveDown(2);

      // Horizontal line separator
      doc.moveTo(50, 115).lineTo(550, 115).strokeColor('#e5e7eb').stroke();

      // Buyer & Payment details
      doc
        .fontSize(11)
        .fillColor('#111827')
        .text('Bill To:', 50, 130)
        .fontSize(10)
        .fillColor('#4b5563')
        .text(order.shippingAddress.address, 50, 145)
        .text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 50, 158)
        .text(order.shippingAddress.country, 50, 171);

      doc
        .fontSize(11)
        .fillColor('#111827')
        .text('Payment Mode:', 300, 130, { align: 'right' })
        .fontSize(10)
        .fillColor('#4b5563')
        .text(order.paymentMethod, 300, 145, { align: 'right' })
        .text(`Status: Paid (Razorpay / Stripe)`, 300, 158, { align: 'right' });

      // Horizontal separator
      doc.moveTo(50, 195).lineTo(550, 195).strokeColor('#e5e7eb').stroke();

      // Items Table Header
      let y = 215;
      doc
        .fontSize(10)
        .fillColor('#111827')
        .text('Product Name', 50, y)
        .text('Qty', 250, y, { width: 30, align: 'right' })
        .text('Unit Price', 300, y, { width: 70, align: 'right' })
        .text('GST Rate', 380, y, { width: 60, align: 'right' })
        .text('GST Amt', 450, y, { width: 50, align: 'right' })
        .text('Amount', 500, y, { width: 50, align: 'right' });

      doc.moveTo(50, 230).lineTo(550, 230).strokeColor('#e5e7eb').lineWidth(1).stroke();

      y = 240;
      let totalGST = 0;
      order.items.forEach((item) => {
        const itemGST = item.gstAmount || 0;
        const lineTotal = (item.price * item.quantity) + itemGST;
        totalGST += itemGST;

        // Draw Row
        doc
          .fontSize(9)
          .fillColor('#4b5563')
          .text(item.name, 50, y, { width: 190 })
          .text(item.quantity.toString(), 250, y, { width: 30, align: 'right' })
          .text(`Rs. ${item.price.toFixed(2)}`, 300, y, { width: 70, align: 'right' })
          .text(`18%`, 380, y, { width: 60, align: 'right' })
          .text(`Rs. ${itemGST.toFixed(2)}`, 450, y, { width: 50, align: 'right' })
          .text(`Rs. ${lineTotal.toFixed(2)}`, 500, y, { width: 50, align: 'right' });

        y += 25;
      });

      doc.moveTo(50, y).lineTo(550, y).strokeColor('#e5e7eb').stroke();
      y += 15;

      // Totals Panel
      doc
        .fontSize(10)
        .fillColor('#4b5563')
        .text('Taxable Subtotal:', 300, y, { width: 150 })
        .text(`Rs. ${(order.totalAmount - totalGST - order.shippingAmount + order.discountAmount).toFixed(2)}`, 450, y, { width: 100, align: 'right' });

      y += 15;
      doc
        .text('CGST (9.0%):', 300, y, { width: 150 })
        .text(`Rs. ${(totalGST / 2).toFixed(2)}`, 450, y, { width: 100, align: 'right' });

      y += 15;
      doc
        .text('SGST (9.0%):', 300, y, { width: 150 })
        .text(`Rs. ${(totalGST / 2).toFixed(2)}`, 450, y, { width: 100, align: 'right' });

      if (order.discountAmount > 0) {
        y += 15;
        doc
          .fillColor('#16a34a')
          .text('Discount Code Applied:', 300, y, { width: 150 })
          .text(`- Rs. ${order.discountAmount.toFixed(2)}`, 450, y, { width: 100, align: 'right' })
          .fillColor('#4b5563');
      }

      y += 15;
      doc
        .text('Shipping & Handling:', 300, y, { width: 150 })
        .text(`Rs. ${order.shippingAmount.toFixed(2)}`, 450, y, { width: 100, align: 'right' });

      y += 20;
      doc
        .fontSize(11)
        .fillColor('#111827')
        .text('Total Invoice Value:', 300, y, { width: 150 })
        .text(`Rs. ${order.totalAmount.toFixed(2)}`, 450, y, { width: 100, align: 'right' });

      // Footer
      doc
        .fontSize(8)
        .fillColor('#9ca3af')
        .text('Thank you for shopping with us! This is a computer-generated tax invoice. No signature required.', 50, 720, { align: 'center' });

      doc.end();

      writeStream.on('finish', () => {
        resolve(outputPath);
      });
      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateInvoicePDF };
