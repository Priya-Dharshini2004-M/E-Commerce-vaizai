const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testSchema2 = new mongoose.Schema({
  name: String,
  value: Number
});

// Pre-save hook defined without 'next' parameter
testSchema2.pre('save', function() {
  console.log('--- Pre save hook executed (no parameters) ---');
  console.log('this.name:', this.name);
  this.value = 999;
});

const TestModel2 = mongoose.model('TestModel2', testSchema2);

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const doc = new TestModel2({ name: 'test_no_next' });
    await doc.save();
    console.log('Document saved successfully, value =', doc.value);
    // clean up
    await TestModel2.deleteOne({ _id: doc._id });
    console.log('Document cleaned up');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
