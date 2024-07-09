window.addEventListener('load', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    loadPayments();
});

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;

    if (price <= 0) {
        alert("Der Preis muss eine positive Zahl sein.");
        return;
    }

    const finalPrice = (price * 1.35).toFixed(2);

    const payment = {
        name: name,
        price: price,
        type: type,
        date: date,
        finalPrice: finalPrice,
        status: 'Nicht bestätigt'
    };

    fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
    })
    .then(response => response.json())
    .then(data => {
        addPaymentToTable(data);
        document.getElementById('paymentForm').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
    })
    .catch(error => console.error('Error:', error));
});

function loadPayments() {
    fetch('http://localhost:3000/payments')
    .then(response => response.json())
    .then(data => {
        data.forEach(payment => addPaymentToTable(payment));
    })
    .catch(error => console.error('Error:', error));
}

function addPaymentToTable(payment) {
    const table = document.getElementById('paymentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cellName = newRow.insertCell(0);
    const cellPrice = newRow.insertCell(1);
    const cellType = newRow.insertCell(2);
    const cellDate = newRow.insertCell(3);
    const cellFinalPrice = newRow.insertCell(4);
    const cellStatus = newRow.insertCell(5);
    const cellAction = newRow.insertCell(6);

    cellName.innerText = payment.name;
    cellPrice.innerText = payment.price.toFixed(2) + ' €';
    cellType.innerText = payment.type;
    cellDate.innerText = payment.date;
    cellFinalPrice.innerText = payment.finalPrice + ' €';
    cellStatus.innerText = payment.status;
    cellStatus.classList.add(payment.status === 'Bestätigt' ? 'status-confirmed' : 'status-unconfirmed');

    const confirmButton = document.createElement('button');
    confirmButton.innerText = "Bestätigen";
    confirmButton.addEventListener('click', function() {
        fetch(`http://localhost:3000/payments/${payment._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Bestätigt' })
        })
        .then(response => response.json())
        .then(updatedPayment => {
            cellStatus.innerText = updatedPayment.status;
            cellStatus.classList.remove('status-unconfirmed');
            cellStatus.classList.add('status-confirmed');
        })
        .catch(error => console.error('Error:', error));
    });

    const deleteButton = document.createElement('button'); // Hinzufügen des Löschbuttons
    deleteButton.innerText = "Löschen";
    deleteButton.addEventListener('click', function() {
        fetch(`http://localhost:3000/payments/${payment._id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            table.deleteRow(newRow.rowIndex);
        })
        .catch(error => console.error('Error:', error));
    });

    cellAction.appendChild(confirmButton);
    cellAction.appendChild(deleteButton); // Löschbutton zur Zeile hinzufügen
}
