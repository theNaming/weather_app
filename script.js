'use script'

const link = 'http://api.weatherstack.com/current?access_key=d2df2b2c5eeee529730a3a8253d182fd';

const fetchData = async () => {
    const result = await fetch(`${link}&query=London`);
    const data = await result.json();

    console.log(data);
};

fetchData();A