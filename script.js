"use strict";

const link = 'http://api.weatherstack.com/current?access_key=d2df2b2c5eeee529730a3a8253d182fd';

const root = document.getElementById('root');
const city = document.getElementById('city');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');

let store = {
    city: 'Mogilev',
    temperature: 0,
    isDay: "yes",
    observationTime: "00:00 AM",
    description: "",
    properties: {
        cloudcover: {},
        humidity: {},
        windSpeed: {},
        pressure: {},
        uvIndex: {},
        visibility: {},
    },
};

const fetchData = async () => {
    try {
        const query = localStorage.getItem('query') || store.city;
        const result = await fetch(`${link}&query=${query}`);
        const data = await result.json();

        const {
            current: {
                cloudcover,
                temperature,
                humidity,
                is_day: isDay,
                observation_time: observationTime,
                pressure,
                visibility,
                uv_index: uvIndex,
                weather_descriptions: description,
                wind_speed: windSpeed
            },
            location: {
                name
            },
        } = data;

        store = {
            ...store,
            temperature,
            isDay,
            city: name,
            observationTime,
            description: description[0],
            properties: {
                cloudcover: {
                    title: 'cloudcover',
                    value: `${cloudcover}%`,
                    icon: 'cloud.png',
                },

                humidity: {
                    title: 'humidity',
                    value: `${humidity}%`,
                    icon: 'humidity.png',
                },
                windSpeed: {
                    title: 'windSpeed',
                    value: `${windSpeed} km/h`,
                    icon: 'wind.png',
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure}%`,
                    icon: 'gauge.png',
                },
                uvIndex: {
                    title: 'uvIndex',
                    value: `${uvIndex} / 100`,
                    icon: 'uv-index.png',
                },
                visibility: {
                    title: 'visibility',
                    value: `${visibility}%`,
                    icon: 'visibility.png',
                },
            },
        };

        renderComponent();
    } catch (arr) {
        console.log(error);
    }
};

const getImages = (descriptions) => {
    const value = descriptions.toLowerCase();

    switch (value) {
        case 'partly cloudy':
            return 'partly.png';
        case 'cloud':
            return 'cloud.png';
        case 'fog':
            return 'fog.png';
        case 'sunny':
            return 'sunny.png';
        case 'sunny':
            return 'sunny.png';
        default:
            return 'the.png';
    }
};

const renderProperty = (properties) => {
    return Object.values(properties).map(({ title, value, icon }) => {
        // const { title, value, icon } = data; //деструктуризация     
        return `<div class="property">
                    <div class="property-icon">
                        <img src="./img/icons/${icon}" alt="">
                    </div>
                    <div class="property-info">
                        <div class="property-info__value">${value}</div>
                        <div class="property-info__description">${title}</div>
                    </div>
                </div>`;
    }).join('');
};

const markup = () => {
    const { city, description, observationTime, temperature, isDay, properties } = store;
    const containerClasss = isDay === 'yes' ? 'is-day' : '';

    return `<div class="container ${containerClasss}">
                        <div class="top">
                            <div class="city">
                                <div class="city-subtitle">Weather Today in</div>
                                    <div class="city-title" id="city">
                                        <span>${city}</span>
                                    </div>
                            </div>

                            <div class="city-info">
                                <div class="top-info">
                                <img class="icon" src="./img/${getImages(description)}" alt="" />
                                <div class="description">${description}</div>
                            </div>
                        
                            
                            <div class="top-right">
                                <div class="city-info__subtitle">as of ${observationTime}</div>
                                <div class="city-info__title">${temperature}°</div>
                            </div>
                        </div>
                    </div>
                <div id="properties">${renderProperty(properties)}</div>
            </div>`;
};

const togglePopupClass = () => {
    popup.classList.toggle('active');
}

const renderComponent = () => {
    root.innerHTML = markup();

    const city = document.getElementById('city');
    city.addEventListener('click', togglePopupClass);
};

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value,
    }
};

const handleSubmit = (e) => {
    e.preventDefault();
    const value = store.city;

    if (!value) return null;

    localStorage.setItem('query', value);
    fetchData();
    togglePopupClass();

};

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);

fetchData();