const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Create schema and register pre-save hook
const testSchema = new mongoose.Schema({
  name: String,
  value: Number
});

testSchema.pre('save', function(next) {
  console.log('--- Pre save hook executed ---');
  console.log('Arguments count:', arguments.length);
  for (let i = 0; i < arguments.length; i++) {
    console.log(`Argument ${i}:`, typeof arguments[i], arguments[i]);
  }
  if (typeof next === 'function') {
    next();
  } else {
    console.log('Warning: next is not a function!');
  }
});

const TestModel = mongoose.model('TestModel', testSchema);

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const doc = new TestModel({ name: 'test', value: 123 });
    await doc.save();
    console.log('Document saved successfully');
    // clean up
    await TestModel.deleteOne({ _id: doc._id });
    console.log('Document cleaned up');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
