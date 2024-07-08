// Setze das aktuelle Datum im Datumseingabefeld
window.addEventListener('load', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
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

    const table = document.getElementById('paymentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cellName = newRow.insertCell(0);
    const cellPrice = newRow.insertCell(1);
    const cellType = newRow.insertCell(2);
    const cellDate = newRow.insertCell(3);
    const cellFinalPrice = newRow.insertCell(4);
    const cellStatus = newRow.insertCell(5);
    const cellAction = newRow.insertCell(6);

    cellName.innerText = name;
    cellPrice.innerText = price.toFixed(2) + ' €';
    cellType.innerText = type;
    cellDate.innerText = date;
    cellFinalPrice.innerText = finalPrice + ' €';
    cellStatus.innerText = "Nicht bestätigt";
    cellStatus.classList.add('status-unconfirmed');

    const confirmButton = document.createElement('button');
    confirmButton.innerText = "Bestätigen";
    confirmButton.addEventListener('click', function() {
        cellStatus.innerText = "Bestätigt";
        cellStatus.classList.remove('status-unconfirmed');
        cellStatus.classList.add('status-confirmed');
    });
    cellAction.appendChild(confirmButton);

    document.getElementById('paymentForm').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
});
