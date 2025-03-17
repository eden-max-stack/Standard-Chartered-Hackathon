const vision = require('@google-cloud/vision');
require('dotenv').config();
const path = require('path');
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../service-account.json');
const client = new vision.ImageAnnotatorClient();

const quickstart = async (req, res) => {
    try {
        if (!req.files || (!req.files.aadhaar && !req.files.pan && !req.files.income)) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        console.log("Received files:", req.files); // Debugging

        const processFile = async (file, type) => {
            // Convert file buffer to base64 encoding
            const imageBuffer = file.data.toString('base64');

            const [result] = await client.textDetection({
                image: { content: imageBuffer }
            });

            return {
                type,
                text: result.textAnnotations.length ? result.textAnnotations[0].description : 'No text detected'
            };
        };

        const results = await Promise.all(
            ['aadhaar', 'pan', 'income'].map(type => req.files[type] ? processFile(req.files[type], type) : null)
        );

        res.json({ results: results.filter(r => r) });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { quickstart };
