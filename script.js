<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saffire Resort Booking System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Saffire Beach Resort & Glamping Booking System</h1>
        <form id="bookingForm">
            <label for="name">Full Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="checkin">Check-in Date:</label>
            <input type="date" id="checkin" name="checkin" required>

            <label for="checkout">Check-out Date:</label>
            <input type="date" id="checkout" name="checkout" required>

            <button type="submit">Submit Booking</button>
        </form>

        <div id="calendar">
            <h2>Booked Dates Calendar</h2>
            <div id="calendarDisplay"></div>
        </div>
    </div>

    <script>
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;

            if (new Date(checkin) >= new Date(checkout)) {
                alert("Check-out date must be after the check-in date.");
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('checkin', checkin);
            formData.append('checkout', checkout);

            fetch('https://script.google.com/macros/s/AKfycbzJqB_J5FCi44btJkTcxjLs7onIxTQayCJxkmeef8WiALUt004Iw751vcc4G5UraxBafw/exec', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert("Booking successfully submitted!");
                loadCalendar();
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error submitting booking. Please try again.");
            });
        });

function loadCalendar() {
    fetch('https://script.google.com/macros/s/AKfycbzJqB_J5FCi44btJkTcxjLs7onIxTQayCJxkmeef8WiALUt004Iw751vcc4G5UraxBafw/exec')
        .then(response => response.json())
        .then(data => {
            const calendarDisplay = document.getElementById('calendarDisplay');
            calendarDisplay.innerHTML = '';

            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            const calendarGrid = document.createElement('div');
            calendarGrid.classList.add('calendar-grid');

            for (let i = 1; i <= lastDay.getDate(); i++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('day-cell');
                dayCell.textContent = i;

                const currentDate = new Date(year, month, i).toISOString().split('T')[0];

                const isBooked = data.some(booking => 
                    currentDate >= booking.checkin && currentDate <= booking.checkout
                );

                if (isBooked) {
                    dayCell.classList.add('booked');
                    dayCell.title = data
                        .filter(booking => 
                            currentDate >= booking.checkin && currentDate <= booking.checkout
                        )
                        .map(booking => `${booking.name}: ${booking.checkin} to ${booking.checkout}`)
                        .join('\n');
                }

                calendarGrid.appendChild(dayCell);
            }

            calendarDisplay.appendChild(calendarGrid);
        })
        .catch(error => console.error('Error loading calendar:', error));
}

window.onload = loadCalendar;
    </script>
</body>
</html>
