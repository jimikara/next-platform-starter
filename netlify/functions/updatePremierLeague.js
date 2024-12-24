const getFootballClubPoints = require('../../utils/getFootballClubPoints');
const updateTimestamp = require('../../utils/updateTimestamp');

exports.handler = async function (event, context) {
    try {
        const result = await getFootballClubPoints(39);
        await updateTimestamp(1);
        return result;
    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred' })
        };
    }
};
