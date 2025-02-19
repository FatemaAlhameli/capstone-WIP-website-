const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Set up middleware to serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads with more detailed settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Serve the upload interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle photo upload
app.post('/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // //Convert image file
    //         // Define new file path for the converted JPEG
    //         const jpegFilePath = path.join('uploads', req.file.filename.split('.')[0] + '.jpg');

    //         // Convert the image to JPEG using sharp
    //         await sharp(req.file.path)
    //             .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
    //             .toFile(jpegFilePath);
    
    //         // Optionally delete the original file after conversion
    //         fs.unlinkSync(req.file.path);
    
    //         console.log(`Converted file saved as: ${jpegFilePath}`);

    // Here add the printer logic
    // For now, just return success
    res.json({ 
      message: 'Photo uploaded successfully!',
      file: {
        name: req.file.filename,
        path: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Static files served from: ${path.join(__dirname, 'public')}`);
});