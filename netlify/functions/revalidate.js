// netlify/functions/revalidate.js

const fetch = require('node-fetch'); // Use node-fetch for making HTTP requests

exports.handler = async function (event, context) {
    try {
        // Construct the URL to call your Next.js revalidate API endpoint
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}`
        );

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Revalidation triggered successfully' })
            };
        } else {
            const errorMessage = await response.text();
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Revalidation failed', error: errorMessage })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error: ${error.message}` })
        };
    }
};
