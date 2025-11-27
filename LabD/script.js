const API_KEY = "7ded80d91f2b280ec979100cc8bbba94";

document.getElementById("btnWeather").addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();
    if (!city) return alert("Wpisz nazwę miasta!");

    getCurrentWeather(city);
    getForecast(city);
});

function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log("CURRENT WEATHER:", data);

            document.getElementById("weather").innerHTML = `
                <h3>Bieżąca pogoda w ${data.name}</h3>
                <p>Temperatura: ${data.main.temp}°C</p>
                <p>Opis: ${data.weather[0].description}</p>
            `;
        } else {
            document.getElementById("weather").innerHTML =
                "Błąd pobierania bieżącej pogody.";
        }
    };

    xhr.send();
}

function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("FORECAST:", data);

            let html = `<h3>Prognoza (5 dni – co 3h)</h3>`;
            data.list.slice(0, 8).forEach(item => {
                html += `
                    <p><b>${item.dt_txt}</b> –
                    ${item.main.temp}°C, 
                    ${item.weather[0].description}</p>
                `;
            });

            document.getElementById("forecast").innerHTML = html;
        })
        .catch(() => {
            document.getElementById("forecast").innerHTML =
                "Błąd pobierania prognozy.";
        });
}