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

    return leagueTable;
}

const prizeSpotColors = ['bg-amber-300', 'bg-gray-300', 'bg-orange-300', 'bg-pink-100', 'bg-blue-100'];

export default async function LeagueTablePage() {
    const leagueTable = await fetchLeagueTable();

    const prizeSpotClassnames = (index) => {
        if (index === 0) {
            return 'bg-amber-300';
        } else if (index === 1) {
            return 'bg-gray-300';
        } else if (index === 2) {
            return 'bg-orange-300';
        } else if (index === 3) {
            return 'bg-pink-100';
        } else if (index === 13) {
            return 'bg-blue-100';
        } else {
            return '';
        }
    };

    return (
        <div className="py-24">
            <h1 className="text-xl">Four to Follow 2024/25</h1>
            <div className="overflow-scroll">
                <table className="table-xs md:table-sm lg:table ">
                    <thead className="text-xs md:text-baseline">
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
                        {leagueTable.map((row, index) => (
                            <tr key={row.player_name} className={`bg-opacity-75 ${prizeSpotClassnames(index)}`}>
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
            <div className="flex mt-8 items-center">
                <div className={`w-4 h-4 mr-2 ${prizeSpotColors[0]}`}></div> <p>1st: £140</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[1]}`}></div> <p>2nd: £75</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[2]}`}></div> <p>3rd: £45</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[3]}`}></div> <p>4th: £25</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[4]}`}></div> <p>Wooden Spoon: £10</p>
            </div>
        </div>
    );
}
