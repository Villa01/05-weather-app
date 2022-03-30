
require('dotenv').config()
const { readInput, pause, inquirerMenu, listPlaces } = require('./helpers/inquirer.js');
const Searching = require('./models/searching.js');

const main = async () => {

    let opt = -1;
    const searching = new Searching();

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Get the place
                const input = await readInput(`Write the place's name that you want to search`);
                const places = await searching.city(input);

                const selectedId = await listPlaces(places);
                // In case of return
                if( selectedId ==='0') continue;
                
                const selectedPlace = places.find(place => place.id = selectedId);
                const { name, lng, lat } = selectedPlace;

                // Save on DB
                searching.addHistory( name );

                // Get weather
                const { temp, temp_min, temp_max, desc } = await searching.weatherByPlace(lat, lng);

                console.log(`\nCity information\n`.green);
                console.log(`City: ${name}`);
                console.log(`Lat: ${lat}`);
                console.log(`Lon: ${lng}`);
                console.log(`Temperature: ${temp}`)
                console.log(`Min: ${temp_min}`)
                console.log(`Max: ${temp_max}`)
                console.log(`Description: ${desc}`)
                break;

            case 2:
                searching.readBD();
                searching.historyCapitalized.forEach((place, i) => {
                    const id = `${i + 1}.`.green;
                    console.log(`${id} ${place}`);
                });
                break;
        }

        if (opt !== 0) await pause();
    } while (opt !== 0);

}

main();