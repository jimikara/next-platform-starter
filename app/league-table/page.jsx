import { Client } from 'pg';

async function fetchLeagueTable() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });

    await client.connect();

    const res = await client.query('SELECT * FROM cached_league_table ORDER BY rank ASC');
    const leagueTable = res.rows;

    await client.end();

    console.log('leagueTable:', leagueTable);

    return leagueTable;
}

export default async function LeagueTablePage() {
    const leagueTable = await fetchLeagueTable();

    return (
        <div>
            <h1>League Table</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Prem. Team</th>
                        <th>Prem. Points</th>
                        <th>Champ. Team</th>
                        <th>Champ. Points</th>
                        <th>L1 Team</th>
                        <th>L1 Points</th>
                        <th>L2 Team</th>
                        <th>L2 Points</th>
                        <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    {leagueTable.map((row) => (
                        <tr key={row.player_name}>
                            <td>{row.rank}</td>
                            <td>{row.player_name}</td>
                            <td>{row.premierleagueteam}</td>
                            <td>{row.premierleaguepoints}</td>
                            <td>{row.championshipteam}</td>
                            <td>{row.championshippoints}</td>
                            <td>{row.leagueoneteam}</td>
                            <td>{row.leagueonepoints}</td>
                            <td>{row.leaguetwoteam}</td>
                            <td>{row.leaguetwopoints}</td>
                            <td>{row.total_weightedpoints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
