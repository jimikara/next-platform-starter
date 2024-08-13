  const { Client } = require('pg'); // pg client for connecting to PostgreSQL
  const axios = require('axios');

  exports.handler = async function (event, context) {
    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await client.connect();

    const leagues = [
      { leagueId: 39, name: 'Premier League' },
      { leagueId: 40, name: 'Championship' },
      { leagueId: 41, name: 'League One' },
      { leagueId: 42, name: 'League Two' },
    ];

    try {
      const requests = leagues.map((league) => {
        const season = 2024;
        const url = `https://api-football-v1.p.rapidapi.com/v3/standings?season=${season}&league=${league.leagueId}`;
        
        return axios.get(url, {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
          });
      });

      const responses = await Promise.all(requests);

      for (const response of responses) {
        const standings = response.data.response[0].league.standings[0];

        const queries = standings.map((team) => {
          const { id: apiId, points } = team.team;
          const gamesPlayed = team.all.played;

          return client.query(
            `UPDATE football_clubs
            SET points = $1, gamesPlayed = $2, updatedAt = NOW()
            WHERE apiId = $3`,
            [points, gamesPlayed, apiId]
          );
        });

        await Promise.all(queries);
      }

      await client.end();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Football clubs updated successfully.' }),
      };
    } catch (error) {
      console.error('Error updating football clubs:', error);
      await client.end();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update football clubs.' }),
      };
    }
  };


  // const { Client } = require('pg'); // pg client for connecting to PostgreSQL
  // const axios = require('axios');

  // exports.handler = async function (event, context) {
  //     // Database connection setup
  //     const client = new Client({
  //         user: process.env.DB_USER,
  //         host: process.env.DB_HOST,
  //         database: process.env.DB_NAME,
  //         password: process.env.DB_PASSWORD,
  //         port: process.env.DB_PORT
  //     });

  //     await client.connect();

  //     const leagues = [
  //         { leagueId: 39, name: 'Premier League' }, // Add other leagues here
  //         { leagueId: 40, name: 'Championship' },
  //         { leagueId: 41, name: 'League One' },
  //         { leagueId: 42, name: 'League Two' }
  //     ];

  //     try {
  //         for (const league of leagues) {
  //             const season = 2024; // Set the current season
  //             const url = `https://api-football-v1.p.rapidapi.com/v3/standings?season=${season}&league=${league.leagueId}`;

  //             const response = await axios.get(url, {
  //                 headers: {
  //                     'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
  //                     'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  //                 }
  //             });

  //             const standings = response.data.response[0].league.standings[0];

  //             for (const team of standings) {
  //                 const { id: apiId, points } = team.team;
  //                 const gamesPlayed = team.all.played;

  //                 // Update the football_clubs table
  //                 await client.query(
  //                     `UPDATE football_clubs
  //            SET points = $1, gamesPlayed = $2, updatedAt = NOW()
  //            WHERE apiId = $3`,
  //                     [points, gamesPlayed, apiId]
  //                 );
  //             }
  //         }

  //         await client.end();

  //         return {
  //             statusCode: 200,
  //             body: JSON.stringify({ message: 'Football clubs updated successfully.' })
  //         };
  //     } catch (error) {
  //         console.error('Error updating football clubs:', error);
  //         await client.end();
  //         return {
  //             statusCode: 500,
  //             body: JSON.stringify({ error: 'Failed to update football clubs.' })
  //         };
  //     }
  // };
