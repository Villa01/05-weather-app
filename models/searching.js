
const fs = require('fs');

const axios = require('axios');

class Searching {
    history = []
    dbPath = './db/database.json'

    constructor() {

    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    get historyCapitalized() {
        return this.history.map( item => {
            let words = item.split(' ');
            words = words.map(word => word[0].toUpperCase() + word.substring(1) );
            return words.join(' ')
        });
    }

    async city(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })

            const resp = await instance.get();
            return resp.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }));
        } catch (error) {
            return [];
        }

    }

    async weatherByPlace(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon}
            });

            const { data } = await instance.get();
            const { weather, main: { temp, temp_min, temp_max} } = data;
            return {
                temp,
                temp_min,
                temp_max,
                desc: weather[0]?.description
            }

        } catch ( err ) {
            console.error(err);
        }
    }

    addHistory( place = ''){

        if ( this.history.includes(place.toLowerCase())){
            return;
        }
        this.history = this.history.splice(0,5);

        this.history.unshift( place.toLowerCase() );
        this.saveDB();
    }

    saveDB(){
        const payload = {
            history: this.history
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readBD() {
        if( !fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {encoding:'utf-8'});
        
        const data = JSON.parse(info);
        this.history = [...data.history];
    }

}

module.exports = Searching;