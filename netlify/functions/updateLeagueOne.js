const getFootballClubPoints = require('../../utils/getFootballClubPoints');
const updateTimestamp = require('../../utils/updateTimestamp');

exports.handler = async function (event, context) {
    try {
        const result = await getFootballClubPoints(41);
        await updateTimestamp(3);
        return result;
    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred' })
        };
    }
};
