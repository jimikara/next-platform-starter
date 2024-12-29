const { Client } = require('pg');

async function updateTimestamp(divisionId) {
    if (!divisionId || divisionId <= 0 || divisionId > 4) return;

    console.log('env', process.env);

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });

    await client.connect();

    let columnName;
    switch (divisionId) {
        case 1:
            columnName = 'prem_timestamp';
            break;
        case 2:
            columnName = 'champ_timestamp';
            break;
        case 3:
            columnName = 'league_one_timestamp';
            break;
        case 4:
            columnName = 'league_two_timestamp';
    }

    try {
        console.log('col name', columnName);

        await client.query(
            `UPDATE data_update_times
            SET ${columnName} = NOW()
            WHERE id = 1 
          `
        );

        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'timestamps updated successfully.' })
        };
    } catch (error) {
        console.error('Error updating timestamps:', error);
        await client.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update timestamps.' })
        };
    }
}

module.exports = updateTimestamp;
