const Address = require('../models/Address');

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body, userId: req.user.id });
    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    if (address.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    Object.assign(address, req.body);
    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }
    await address.save();
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    if (address.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await address.deleteOne();
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };