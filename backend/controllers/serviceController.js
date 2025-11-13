const Service = require('../models/Service');

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  const { name, description, details: detailsString } = req.body; // --- UPDATED: detailsString ---
  
  // Parse details: split the comma-separated string, trim, and filter out empty strings
  const details = detailsString ? detailsString.split(',').map(d => d.trim()).filter(d => d.length > 0) : [];
  
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload an image' });
  }

  const imageUrl = req.file.path;

  try {
    const newService = new Service({
      name,
      description,
      imageUrl,
      details, // --- NEW FIELD ---
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// // @desc    Update a service
// // @route   PUT /api/services/:id
// // @access  Private/Admin
// exports.updateService = async (req, res) => {
//   const { name, description, price, details: detailsString } = req.body; // --- UPDATED: detailsString ---
//   let imageUrl = req.body.imageUrl; // Keep existing image if no new one is uploaded
  
//   // Parse details
//   const details = detailsString ? detailsString.split(',').map(d => d.trim()).filter(d => d.length > 0) : []; // --- NEW ---

//   if (req.file) {
//     imageUrl = req.file.path; // Set to new image path if uploaded
//   }

//   try {
//     let service = await Service.findById(req.params.id);
//     if (!service) return res.status(404).json({ msg: 'Service not found' });

//     service.name = name;
//     service.description = description;
//     service.price = price;
//     service.imageUrl = imageUrl;
//     service.details = details; // --- NEW FIELD ---

//     await service.save();
//     res.json(service);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// @desc    Delete a serviceconst Service = require('../models/Service');
// Optional: require fs if you want to delete the image file upon service deletion
// const fs = require('fs');
// const path = require('path');

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public


// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  // Destructure details as detailsString to parse from FormData
  const { name, description, details: detailsString } = req.body; 
  
  // Parse details: split the comma-separated string, trim, and filter out empty strings
  const details = detailsString ? detailsString.split(',').map(d => d.trim()).filter(d => d.length > 0) : [];
  
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload an image' });
  }

  const imageUrl = req.file.path;

  try {
    const newService = new Service({
      name,
      description,
      imageUrl,
      details,
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found (Invalid ID)' });
    }
    res.status(500).send('Server Error');
  }
};

exports.updateService = async (req, res) => {
  // Check if req.body is defined first to prevent crash
  if (!req.body) {
    console.error("Update Service Error: req.body is undefined, likely an issue with multer.");
    return res.status(400).json({ msg: 'Request data missing. Check file upload middleware.' });
  }

  // Destructure fields, including detailsString
  // Use a fallback to empty string if properties are missing in req.body
  const { name = '', description = '', details: detailsString = '' } = req.body;
  let imageUrl = req.body.imageUrl; 

  // Parse details string into an array
  const details = detailsString ? detailsString.split(',').map(d => d.trim()).filter(d => d.length > 0) : [];

  if (req.file) {
    imageUrl = req.file.path; // Set to new image path if uploaded
  }

  // Object containing fields to update
  // Only include fields that are actually in the body if you want partial updates.
  // Assuming the frontend sends all fields, we construct the full object.
  const serviceFields = {
    name,
    description,
    imageUrl,
    details, 
  };
  
  // LOG the final fields before the DB call
  console.log('[updateService] Final serviceFields:', serviceFields);


  try {
    let service = await Service.findByIdAndUpdate(
        req.params.id,
        { $set: serviceFields },
        { new: true, runValidators: true } 
    );

    if (!service) return res.status(404).json({ msg: 'Service not found' });

    res.json(service);
  } catch (err) {
    console.error(`ERROR IN updateService: ${err.message}`); 
    // Handle specific validation errors (e.g., missing required field)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: `Validation Error: ${err.message}` });
    }
    // Handle case where ID format is incorrect
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
// serviceController.js

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    // This is the correct, safe way to delete in modern Mongoose
    const service = await Service.findByIdAndDelete(req.params.id);
    
    // Check if the service was found before deletion
    if (!service) {
      console.log(`[DELETE] Service ID ${req.params.id} not found.`);
      return res.status(404).json({ msg: 'Service not found' });
    }

    // IMPORTANT: Make absolutely sure you have NOT uncommented the fs.unlink logic 
    // without properly importing 'fs' and 'path' and handling its asynchronous nature.
    
    console.log(`[DELETE] Service ID ${req.params.id} successfully removed.`);
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(`!!! CRITICAL DELETE ERROR for ID ${req.params.id}: ${err.message}`); 
    console.error(err); // Log the full error object for detailed debugging

    // Handle case where ID format is incorrect (CastError)
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Service not found (Invalid ID format)' });
    }
    
    // Default to 500 Server Error
    res.status(500).send('Server Error');
  }
};