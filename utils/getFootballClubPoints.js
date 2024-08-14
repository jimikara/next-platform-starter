const { Client } = require('pg');
const axios = require('axios');

async function getFootballClubPoints(leagueId) {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });

    await client.connect();

    try {
        const season = 2024;
        // const leagueId = 39;
        const url = `https://api-football-v1.p.rapidapi.com/v3/standings?season=${season}&league=${leagueId}`;

        const response = await axios.get(url, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });

        const standings = response.data.response[0].league.standings[0];

        for (const team of standings) {
            const { id: apiId } = team.team;
            const points = team.points;
            const gamesPlayed = team.all.played;

            await client.query(
                `UPDATE football_clubs
             SET points = $1, gamesPlayed = $2, updatedAt = NOW()
             WHERE apiId = $3`,
                [points, gamesPlayed, apiId]
            );
        }

        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Football clubs updated successfully.' })
        };
    } catch (error) {
        console.error('Error updating football clubs:', error);
        await client.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update football clubs.' })
        };
    }
}

module.exports = getFootballClubPoints;
