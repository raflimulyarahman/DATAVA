import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FormData from 'form-data';

const app = express();
const port = process.env.PORT || 5051;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  }
});

// Get Walrus relay and network config from environment
const WALRUS_UPLOAD_RELAY = process.env.WALRUS_UPLOAD_RELAY || process.env.WALRUS_RELAY || 'https://upload-relay.testnet.walrus.space';
const WALRUS_NETWORK = process.env.WALRUS_NETWORK || 'testnet';
const SUI_FULLNODE = process.env.SUI_FULLNODE_URL || 'https://fullnode.testnet.sui.io:443';

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'DATAVA Ingestion Service',
    status: 'running',
    walrusConfig: {
      uploadRelay: WALRUS_UPLOAD_RELAY,
      network: WALRUS_NETWORK,
      suiFullnode: SUI_FULLNODE
    }
  });
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Uploading file: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // For now, directly uploading to Walrus using axios and multipart form data
    // Note: This implementation may need to be adjusted based on actual Walrus API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype || 'application/octet-stream'
    });

    // Add metadata
    formData.append('filename', req.file.originalname);
    formData.append('size', req.file.size.toString());
    formData.append('mimetype', req.file.mimetype || 'application/octet-stream');

    // Upload to Walrus relay
    const uploadResponse = await axios.post(`${WALRUS_UPLOAD_RELAY}/store`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 60000, // 60 second timeout for large uploads
    });

    // Extract CID from the response (format depends on actual Walrus API)
    const cid = uploadResponse.data.digest || uploadResponse.data.cid ||
                uploadResponse.data.id || uploadResponse.data.objectId;

    if (!cid) {
      throw new Error('Invalid response from Walrus relay: no CID returned');
    }

    console.log(`File uploaded successfully, CID: ${cid}`);

    res.json({
      cid: cid,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error: any) {
    console.error('Walrus upload error:', error.message || error);

    // If Walrus upload fails, fall back to generating a hash-based CID for demo purposes
    if (req.file) {
      console.log('Walrus upload failed, generating demo CID...');

      // Generate a CID based on the file content
      const encoder = new TextEncoder();
      const data = encoder.encode(`${req.file.originalname}-${req.file.size}-${Date.now()}`);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const demoCid = `bafy${hashArray.map(b => b.toString(16).padStart(2, '0')).slice(0, 32).join('')}`;

      res.json({
        cid: demoCid,
        filename: req.file.originalname,
        size: req.file.size,
        fallback: true,
        message: 'Walrus upload failed, using demo CID for development'
      });
    } else {
      res.status(500).json({ error: 'Upload failed', details: error.message || 'Unknown error' });
    }
  }
});

app.listen(port, () => {
  console.log(`DATAVA Ingestion Service running on port ${port}`);
  console.log(`Walrus relay: ${WALRUS_UPLOAD_RELAY}`);
  console.log(`Walrus network: ${WALRUS_NETWORK}`);
  console.log(`SUI fullnode: ${SUI_FULLNODE}`);
});