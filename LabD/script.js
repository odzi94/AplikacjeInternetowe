const API_KEY = "7ded80d91f2b280ec979100cc8bbba94";

document.getElementById("btnWeather").addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();
    if (!city) return alert("Wpisz nazwę miasta!");

    getCurrentWeather(city);
    getForecast(city);
});

// Metoda 1: XMLHttpRequest (Bieżąca pogoda)
function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log("CURRENT WEATHER:", data);

            // Wyciągamy ikonę z danych API
            const icon = data.weather[0].icon;

            document.getElementById("weather").innerHTML = `
                <div class="weather-card">
                    <div>
                        <h3>Bieżąca pogoda: ${data.name}</h3>
                        <p style="font-size: 1.5em; margin: 5px 0;"><strong>${data.main.temp}°C</strong></p>
                        <p>Opis: ${data.weather[0].description}</p>
                    </div>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Ikona pogody" class="weather-icon">
                </div>
            `;
        } else {
            document.getElementById("weather").innerHTML =
                "<p style='color:red;'>Błąd pobierania bieżącej pogody. Sprawdź nazwę miasta.</p>";
        }
    };

    xhr.send();
}

// Metoda 2: Fetch API (Prognoza 5 dni)
function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Błąd sieci");
            return response.json();
        })
        .then(data => {
            console.log("FORECAST:", data);

            let html = `<h3>Prognoza (najbliższe godziny)</h3>`;
            
            // Pobieramy pierwsze 8 wpisów (co 3h = 24h prognozy)
            data.list.slice(0, 8).forEach(item => {
                const icon = item.weather[0].icon;
                const time = item.dt_txt.substring(11, 16); // Wycinamy tylko godzinę HH:MM

                html += `
                    <div class="forecast-item">
                        <span><strong>${time}</strong></span>
                        <img src="https://openweathermap.org/img/wn/${icon}.png" width="30" alt="icon">
                        <span>${item.main.temp}°C</span>
                        <span style="color: #666; font-size: 0.85em;">${item.weather[0].description}</span>
                    </div>
                `;
            });

            document.getElementById("forecast").innerHTML = html;
        })
        .catch(() => {
            document.getElementById("forecast").innerHTML =
                "<p style='color:red;'>Błąd pobierania prognozy.</p>";
        });
}