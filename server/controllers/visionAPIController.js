const vision = require('@google-cloud/vision');
require('dotenv').config();
const path = require('path');
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../service-account.json');

const client = new vision.ImageAnnotatorClient();

const extractAadhaarDetails = (text) => {
    let aadhaarData = {
        name: null,
        dob: null,
        gender: null,
        aadhaar_number: null
    };

    const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b|\b\d{12}\b/;
    const dobRegex = /\b\d{2}\/\d{2}\/\d{4}\b|\bDOB[:\s]*(\d{4})\b/;
    const genderRegex = /\b(Male|Female|Other)\b/i;
    const nameRegex = /(?<=\n)[A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)?(?=\n\d{4})/;

    const aadhaarMatch = text.match(aadhaarRegex);
    const dobMatch = text.match(dobRegex);
    const genderMatch = text.match(genderRegex);
    const nameMatch = text.match(nameRegex);

    if (aadhaarMatch) aadhaarData.aadhaar_number = aadhaarMatch[0];
    if (dobMatch) aadhaarData.dob = dobMatch[0];
    if (genderMatch) aadhaarData.gender = genderMatch[0];
    if (nameMatch) aadhaarData.name = nameMatch[0];

    return aadhaarData;
};

const extractPanDetails = (text) => {
    let panData = {
        name: null,
        pan_number: null
    };

    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;
    const nameRegex = /(?<=Name\n)[A-Z ]+/;

    const panMatch = text.match(panRegex);
    const nameMatch = text.match(nameRegex);

    if (panMatch) panData.pan_number = panMatch[0];
    if (nameMatch) panData.name = nameMatch[0].trim();

    return panData;
};

const extractIncomeDetails = (text) => {
    let incomeData = {
        employment_type: null,
        income: null
    };

    const employmentRegex = /\b(Salaried|Self[-\s]?Employed|Business|Freelancer)\b/i;
    const incomeRegex = /(?:Gross Salary|Total Income|Net Salary|Total|NET|Net|NET PAY|Net Pay|Take Home Pay)[\s:]*₹?\s*([\d,]+)/i;

    const employmentMatch = text.match(employmentRegex);
    const incomeMatch = text.match(incomeRegex);

    if (employmentMatch) incomeData.employment_type = employmentMatch[0];
    if (incomeMatch) incomeData.income = incomeMatch[1].replace(/,/g, ''); // Remove commas from the number

    return incomeData;
};

const quickstart = async (req, res) => {
    try {
        if (!req.files || (!req.files.aadhaar && !req.files.pan && !req.files.income)) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        console.log("Received files:", req.files);

        const processFile = async (file, type) => {
            const imageBuffer = file.data;

            const [textResult] = await client.textDetection({ image: { content: imageBuffer.toString('base64') } });
            const textDetections = textResult.textAnnotations.length ? textResult.textAnnotations[0].description : 'No text detected';

            if (type === "aadhaar") {
                return { type, data: extractAadhaarDetails(textDetections) };
            }

            if (type === "pan") {
                return { type, data: extractPanDetails(textDetections) };
            }

            if (type === "income") {
                return { type, data: extractIncomeDetails(textDetections) };
            }

            return { type, text: textDetections };
        };

        const results = await Promise.all(
            ['aadhaar', 'pan', 'income'].map(type => req.files[type] ? processFile(req.files[type], type) : null)
        );

        console.log(results);

        res.json({ results: results.filter(r => r) });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { quickstart };
