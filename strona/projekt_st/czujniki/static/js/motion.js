        function fetchData() {
            $.ajax({
                url: 'http://127.0.0.1:8000/api/motion/',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    const motionTableBody = document.getElementById('motion-table-body');
                    motionTableBody.innerHTML = '';

                    data.forEach(x => {
                        const row = document.createElement('tr');


                        const motionCell = document.createElement('td');
                        motionCell.textContent = x.motion;
                        row.appendChild(motionCell);


                        const dateCell = document.createElement('td');
                        dateCell.textContent = x.date;
                        row.appendChild(dateCell);

                        motionTableBody.appendChild(row);
                    });
                },
                error: function(error) {
                    console.error('Błąd pobierania danych z API:', error);
                }
            });
        }

        fetchData();

        setInterval(fetchData, 2000);