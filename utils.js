import { uniqueNamesGenerator, adjectives, animals, NumberDictionary } from 'unique-names-generator';
// import fs from 'fs';

/*
Get the actual size of a resource downloaded by the browser (e.g. an image) in bytes.
This is supported in recent versions of all major browsers, with some caveats.
See https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/encodedBodySize
*/
export function getResourceSize(url) {
    const entry = window?.performance?.getEntriesByName(url)?.[0];
    if (entry) {
        const size = entry?.encodedBodySize;
        return size || undefined;
    } else {
        return undefined;
    }
}

// Note: this only works on the server side
export function getNetlifyContext() {
    return process.env.CONTEXT;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const uniqueNamesConfig = {
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
};

export function uniqueName() {
    return uniqueNamesGenerator(uniqueNamesConfig) + '-' + randomInt(100, 999);
}

export const uploadDisabled = process.env.NEXT_PUBLIC_DISABLE_UPLOADS?.toLowerCase() === 'true';

// export const getClubIds = async (leaugeId, leagueName) => {
//     // const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/standings?season=2024&league=39', {
//     //     'x-rapidapi-key': '4e186121bcmsh6d12fcb186789aep1a01acjsn3dce8af8a0bb'
//     // });

//     const url = 'https://api-football-v1.p.rapidapi.com/v3/standings?season=2024&league=42';

//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': '4e186121bcmsh6d12fcb186789aep1a01acjsn3dce8af8a0bb', // TODO: move to env
//             'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
//         }
//     };

//     const response = await fetch(url, options);
//     const data = await response.json();

//     console.log(data.response[0].league.standings[0].map((team) => ({ id: team.team.id, name: team.team.name })));

//     const ids = data.response[0].league.standings[0].map((team) => ({ id: team.team.id, name: team.team.name }));

//     // write to filter
//     fs.writeFileSync(`l2-ids.json`, JSON.stringify(ids, null, 2));
// };
