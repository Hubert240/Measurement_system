        var ctx = document.getElementById("masno");

        var golddatas = {
            labels: [],
            datasets: [
                {
                    label: 'Humidity',
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


            }
        });
        function updateChart(newData, counter) {
    myChart.data.labels = counter;
    myChart.data.datasets[0].data = newData;
    myChart.update();
}


    function formatujDate(ISODate) {
        const data = new Date(ISODate);
        const rok = data.getFullYear();
        const miesiac = (data.getMonth() + 1).toString().padStart(2, '0'); // Dodaj 1 do miesiąca, bo indeksowanie miesięcy zaczyna się od 0
        const dzien = data.getDate().toString().padStart(2, '0');
        const godzina = data.getHours().toString().padStart(2, '0');
        const minuta = data.getMinutes().toString().padStart(2, '0');
        const sekunda = data.getSeconds().toString().padStart(2, '0');
        const sformatowanaData = `${rok}/${miesiac}/${dzien} ${godzina}:${minuta}:${sekunda}`;
        return sformatowanaData;
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
                const humidityValues = Object.values(data).map(item => item.humidity);
                console.log(humidityValues);
                updateChart(humidityValues, array);
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