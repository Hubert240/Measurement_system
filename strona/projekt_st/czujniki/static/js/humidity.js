        var ctx = document.getElementById("masno");
        var ctx2 = document.getElementById("masno2");

        var golddatas = {
            labels: [],
            datasets: [
                {
                    label: 'Wilgotność',
                    fillColor: 'rgb(255,255,122)',
                    strokeColor: 'rgb(255,255,122)',
                    borderColor: 'rgba(255,0,0,1)',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointColor: 'rgba(127,150,199,0.5)',
                    pointStrokeColor: 'rgba(127,150,199,0.5)',
                    data: []
                }
            ]
        };
        var golddatas2 = {
            labels: [],
            datasets: [
                {
                    label: 'Średnia wilgotność - 7 dni',
                    fillColor: 'rgb(255,255,122)',
                    strokeColor: 'rgb(255,255,122)',
                    borderColor: 'rgba(255,0,0,1)',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointColor: 'rgba(127,150,199,0.5)',
                    pointStrokeColor: 'rgba(127,150,199,0.5)',
                    data: []
                }
            ]
        };

        var myChart = new Chart(ctx, {
    type: 'line',
    data: golddatas,
    options: {
        defaultFontSize: 10,
        defaultFontColor: '#FFF',
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            x: {
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Godzina'
                }
            },
            y: {
                type: 'linear', // użyj linearnego skalowania dla osi y
                ticks: {
                    // Formatuj wartości osi y jako procenty
                    callback: function (value, index) {
                        return value + '%';
                    }
                },
                title: {
                    display: true,
                    text: 'Procent'
                }
            }
        }
    }
});
        var myChart2 = new Chart(ctx2, {
            type: 'line',
            data: golddatas2,
            options: {
                defaultFontSize: 10,
                defaultFontColor: '#FFF',
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
            scales: {
            x: {
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Data'
                }
            },
            y: {
                type: 'linear', // użyj linearnego skalowania dla osi y
                ticks: {
                    // Formatuj wartości osi y jako procenty
                    callback: function (value, index) {
                        return value + '%';
                    }
                },
                title: {
                    display: true,
                    text: 'Procent'
                }
            }
        }

            }
        });
        function updateChart(newData, counter) {
    myChart.data.labels = counter;
    myChart.data.datasets[0].data = newData;
    myChart.update();
}
 function updateChart2(newData, counter) {
    myChart2.data.labels = counter;
    myChart2.data.datasets[0].data = newData;
    myChart2.update();
}


    function formatujDate(ISODate) {
        const data = new Date(ISODate);
        const rok = data.getFullYear();
        const miesiac = (data.getMonth() + 1).toString().padStart(2, '0'); // Dodaj 1 do miesiąca, bo indeksowanie miesięcy zaczyna się od 0
        const dzien = data.getDate().toString().padStart(2, '0');
        const godzina = (data.getHours() - 1).toString().padStart(2, '0');
        const minuta = data.getMinutes().toString().padStart(2, '0');
        const sekunda = data.getSeconds().toString().padStart(2, '0');
        const sformatowanaData = `${rok}/${miesiac}/${dzien} ${godzina}:${minuta}:${sekunda}`;
        return sformatowanaData;
}
function roundToTwoDecimalPlaces(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
}
function processDataForLast7Days(data) {
    const currentDate = new Date();

    // Ustaw datę na koniec dzisiejszego dnia
    currentDate.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Oblicz datę sprzed 6 dni, aby mieć łącznie 7 dni

    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && itemDate <= currentDate; // Ograniczenie do ostatnich 7 dni
    });

    const datesSet = new Set(); // Użyj Set do przechowywania unikalnych dat
    const averagesMap = new Map(); // Użyj Map do przechowywania par daty i średniej

    filteredData.forEach(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0]; // Formatowanie do "YYYY-MM-DD"
        datesSet.add(itemDate);
    });

    // Sortuj daty od najstarszej do najmłodszej
    const sortedDatesArray = Array.from(datesSet).sort();

    sortedDatesArray.forEach(date => {
        const valuesForDate = filteredData.filter(item => {
            const itemDate = new Date(item.date).toISOString().split('T')[0];
            return itemDate === date;
        });

        const averageValue = calculateAverageTemperature(valuesForDate); // Zastąp funkcją z obliczaniem średniej wartości dla danego pola
        const roundedAverage = roundToTwoDecimalPlaces(averageValue);
        averagesMap.set(date, roundedAverage);
    });

    // Skróć wyniki do ostatnich 7 dni
    const last7DatesArray = sortedDatesArray.slice(-7);
    const last7AveragesArray = last7DatesArray.map(date => averagesMap.get(date));

    return { dates: last7DatesArray, averages: last7AveragesArray };
}
function getLast15TemperaturesAndHours(data) {
    const last20Data = data.slice(-15); // Pobierz ostatnie 20 danych

    const temperaturesArray = [];
    const hoursArray = [];

    last20Data.forEach(item => {
        const itemDate = new Date(item.date);
        const temperature = item.humidity;

        // Dodaj godzinę do tablicy godzin w formacie "HH:mm"
        const hour = ('0' + itemDate.getHours()).slice(-2);
        const minutes = ('0' + itemDate.getMinutes()).slice(-2);
        const timeString = `${hour}:${minutes}`;

        temperaturesArray.push(temperature);
        hoursArray.push(timeString);
    });

    // Odwróć tablice, aby mieć od najstarszej do najmłodszej



    return { temperatures: temperaturesArray, hours: hoursArray };
}


// Funkcja do obliczania średniej temperatury
function calculateAverageTemperature(data) {
    const totalTemperature = data.reduce((sum, item) => sum + item.humidity, 0);
    return totalTemperature / data.length;
}

    function fetchData() {
        $.ajax({
            url: 'http://127.0.0.1:8000/api/data/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const humidityTableBody = document.getElementById('humidity-table-body');
                let counter = 0;
                let array = []
                humidityTableBody.innerHTML = '';
                let totalHumidity = 0;
                let maxHumidity = 0;
                let humidities = [];

                data.reverse();
                data.forEach(x => {
                    const row = document.createElement('tr');
                    counter = counter+1;
                    array.push(counter);
                    // Komórka dla wilgotności
                    const humidityCell = document.createElement('td');
                    humidityCell.textContent = x.humidity;
                    row.appendChild(humidityCell);

                    // Komórka dla daty
                    const dateCell = document.createElement('td');
                    const sformatowanaData = formatujDate(x.date);
                    dateCell.textContent = sformatowanaData;
                    row.appendChild(dateCell);

                    humidityTableBody.appendChild(row);

                    totalHumidity += x.humidity;

                    if (x.humidity > maxHumidity) {
                    maxHumidity = x.humidity;

                    humidities.push(x.humidity);
                }
                });
                const averageHumidity = totalHumidity / data.length;
                const averageHumidityElement = document.getElementById('average-humidity');
                averageHumidityElement.textContent = `Średnia wilgotność: ${averageHumidity.toFixed(2)}`;

                 const maxHumidityElement = document.getElementById('max-humidity');
                 maxHumidityElement.textContent = `Najwyższa wilgotność: ${maxHumidity.toFixed(2)}`;

                humidities.sort((a,b) => a - b);

                const medianHumidity = calculateMedian(humidities);
                const medianHumidityElement = document.getElementById('median-humidity');
                medianHumidityElement.textContent = `Mediana wilgotności: ${medianHumidity.toFixed(2)}`;


                data.reverse();
                const result2 = getLast15TemperaturesAndHours(data);
                updateChart(result2.temperatures, result2.hours);
                const result = processDataForLast7Days(data);
                updateChart2(result.averages, result.dates);
                console.log(result.dates);
                console.log(result.averages);
            },
            error: function(error) {
                console.error('Błąd pobierania danych z API:', error);
            }
        });
    }

   function calculateMedian(arr) {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

    fetchData();

    setInterval(fetchData, 2000);