import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 5051;

// Enable CORS for all routes
app.use(cors());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  }
});

// Get Walrus relay URL from environment
const WALRUS_RELAY = process.env.WALRUS_RELAY || 'https://upload-relay.testnet.walrus.space';

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DATAVA Ingestion Service', status: 'running' });
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Uploading file: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Prepare file data for Walrus upload
    const fileBuffer = req.file.buffer;
    const filename = req.file.originalname;

    // In a real implementation, we would upload to the actual Walrus relay
    // For this example, we'll simulate the upload and return a mock CID
    // In practice, you would send the file to the Walrus relay endpoint
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock CID (in real implementation, this would come from Walrus)
    const mockCid = `bafybeidsken34j${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    
    console.log(`File uploaded successfully, CID: ${mockCid}`);
    
    res.json({ 
      cid: mockCid,
      filename: filename,
      size: req.file.size 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`DATAVA Ingestion Service running on port ${port}`);
  console.log(`Walrus relay: ${WALRUS_RELAY}`);
});