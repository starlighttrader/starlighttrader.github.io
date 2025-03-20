const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const envPath = path.join(__dirname, '../../.env.local');

// Read MongoDB URI from .env.local directly
function getMongoDbUri() {
    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const mongoUriLine = envContent.split('\n').find(line => line.startsWith('NEXT_PUBLIC_MONGODB_URI='));
        if (!mongoUriLine) {
            throw new Error('MongoDB URI not found in .env.local');
        }
        // Extract the URI and clean it
        const uri = mongoUriLine.substring(mongoUriLine.indexOf('=') + 1).trim();
        // Remove surrounding quotes if they exist
        return uri.replace(/^["'](.+)["']$/, '$1');
    } catch (error) {
        console.error('Error reading MongoDB URI:', error);
        process.exit(1);
    }
}

async function updateDiscountCodes() {
    let client;
    try {
        // Connect to MongoDB using URI from .env.local
        const mongoUri = getMongoDbUri();
        console.log('Attempting to connect to MongoDB...');
        
        client = new MongoClient(mongoUri, {
            connectTimeoutMS: 10000,      // 10 seconds
            socketTimeoutMS: 45000,       // 45 seconds
            serverSelectionTimeoutMS: 10000, // 10 seconds
            maxPoolSize: 10,
            retryWrites: true,
            retryReads: true
        });

        await client.connect();
        console.log('Connected to MongoDB successfully');

        // Get the database and collection
        const db = client.db('SLT_Transactions');
        const collection = db.collection('discountCodes');

        // Fetch the discount codes document
        const discountCodes = await collection.findOne({
            _id: { $exists: true }  // Get the first document
        });

        if (!discountCodes) {
            throw new Error('No discount codes found in MongoDB');
        }

        // Log the fetched discount codes
        console.log('\nFetched Discount Codes from MongoDB:');
        console.log(JSON.stringify(discountCodes, null, 2));

        // Remove the MongoDB _id field before encoding
        const { _id, ...discountCodesWithoutId } = discountCodes;

        // Convert to base64
        const base64Encoded = Buffer.from(JSON.stringify(discountCodesWithoutId)).toString('base64');

        // Read current .env.local
        let envContent = '';
        try {
            envContent = fs.readFileSync(envPath, 'utf8');
        } catch (error) {
            // File doesn't exist, that's okay
        }

        // Check if NEXT_PUBLIC_DISCOUNT_CODES already exists
        const envLines = envContent.split('\n');
        const newEnvLines = envLines.filter(line => !line.startsWith('NEXT_PUBLIC_DISCOUNT_CODES='));

        // Add the new encoded discount codes
        newEnvLines.push(`NEXT_PUBLIC_DISCOUNT_CODES="${base64Encoded}"`);

        // Write back to .env.local
        fs.writeFileSync(envPath, newEnvLines.join('\n'));

        console.log('\nSuccessfully updated discount codes in .env.local');
    } catch (error) {
        console.error('\nError updating discount codes:', error);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('Disconnected from MongoDB');
        }
    }
}

// Run the async function
updateDiscountCodes(); 