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
    const lastUpdateTimes = await client.query('SELECT * FROM data_update_times LIMIT 1');
    const leagueTable = res.rows;
    const mostRecent = getMostRecentTimestamp(lastUpdateTimes.rows[0]);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    console.log('MR--', lastUpdateTimes.rows[0], mostRecent);

    const prettyString = new Date(mostRecent).toLocaleString('en-GB', options);

    await client.end();

    return { table: leagueTable, lastUpdatedAt: prettyString };
}

function getMostRecentTimestamp(timestamps) {
    const arr = Object.values(timestamps);

    let mostRecent = arr[0];

    for (let i = 1; i < arr.length; i++) {
        const currentDate = new Date(arr[i]);
        const mostRecentDate = new Date(mostRecent);
        if (currentDate > mostRecentDate) {
            mostRecent = arr[i];
        }
    }

    return mostRecent;
}

const prizeSpotColors = ['bg-amber-300', 'bg-gray-300', 'bg-orange-300', 'bg-pink-100', 'bg-blue-100'];

export default async function LeagueTablePage() {
    const { table, lastUpdatedAt } = await fetchLeagueTable();

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
        <div className="pt-8 pb-24">
            <div className="flex items-baseline justify-between mb-4">
                <h1 className="text-xl mb-0 mr-2">Four to Follow 2024/25</h1>
                <p className="text-sm">Last auto update at: {lastUpdatedAt}</p>
            </div>
            <div className="overflow-scroll">
                <table className="w-full table-xs md:table-sm 2xl:table-md">
                    <thead className="text-xs md:text-baseline text-left">
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
                            <th className="text-right pr-3">Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.map((row, index) => (
                            <tr
                                key={row.player_name}
                                className={`
                                bg-opacity-65 ${prizeSpotClassnames(index)} ${
                                    index == 3 && 'border-b-2 border-b-indigo-600'
                                }`}
                            >
                                <td>{row.rank}</td>
                                <td className="font-medium">{row.player_name}</td>
                                <td>{row.premierleagueteam}</td>
                                <td>{row.premierleaguepoints}</td>
                                <td>{row.championshipteam}</td>
                                <td>{row.championshippoints}</td>
                                <td>{row.leagueoneteam}</td>
                                <td>{row.leagueonepoints}</td>
                                <td>{row.leaguetwoteam}</td>
                                <td>{row.leaguetwopoints}</td>
                                <td className="font-medium text-right pr-3">{row.total_weightedpoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex mt-8 items-center">
                <div className={`w-4 h-4 mr-2 ${prizeSpotColors[0]}`}></div> <p>1st: £145</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[1]}`}></div> <p>2nd: £75</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[2]}`}></div> <p>3rd: £50</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[3]}`}></div> <p>4th: £25</p>
                <div className={`w-4 h-4 mr-2 ml-5 ${prizeSpotColors[4]}`}></div> <p>Wooden Spoon: £10</p>
            </div>
        </div>
    );
}
