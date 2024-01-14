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





 function fetchData() {
    $.ajax({
        url: 'http://127.0.0.1:8000/api/motion/',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            const motionTableBody = document.getElementById('motion-table-body');
            motionTableBody.innerHTML = '';

            dataSort = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            data.forEach(x => {
                const row = document.createElement('tr');

                const motionCell = document.createElement('td');
                motionCell.textContent = x.motion;
                row.appendChild(motionCell);

                const dateCell = document.createElement('td');
                const sformatowanaData = formatujDate(x.date);
                dateCell.textContent = sformatowanaData;
                row.appendChild(dateCell);

                        motionTableBody.appendChild(row);
                    });
                    const lastMotionElement = document.getElementById('last-motion');
                const timeSinceLastMotionElement = document.getElementById('time-since-last-motion');

                if (data.length > 0) {
                    const lastMotion = dataSort[0];
                    const lastMotionDate = new Date(data[0].date);
                    lastMotionDate.setHours(lastMotionDate.getHours() - 1);
                    const lastMotionDateUtcPlus2 = new Date(lastMotionDate.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
                    const sformatowanaData = formatujDate(new Date(data[0].date));
                    const currentTime = new Date();

                    lastMotionElement.textContent = `Ostatni ruch: ${sformatowanaData}`;
                    const timeDifference = currentTime - lastMotionDateUtcPlus2;
                    const secondsSinceLastMotion = Math.floor(timeDifference / 1000);

                    const hours = Math.floor(secondsSinceLastMotion / 3600);
                    const minutes = Math.floor((secondsSinceLastMotion % 3600) / 60);
                    const seconds = secondsSinceLastMotion % 60;

                    timeSinceLastMotionElement.textContent = `Czas od ostatniego ruchu: ${hours}h ${minutes}m ${seconds}s`;
                } else {
                    // Jeśli brak danych, ustaw informacje na puste
                    lastMotionElement.textContent = 'Ostatni ruch: brak danych';
                    timeSinceLastMotionElement.textContent = 'Czas od ostatniego ruchu: brak danych';
                }
                },
                error: function(error) {
                    console.error('Błąd pobierania danych z API:', error);
                }
            });
        }

        fetchData();

        setInterval(fetchData, 1000);