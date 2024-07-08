document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Formulardaten abrufen
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;

    // Endpreis berechnen
    const finalPrice = (price * 1.35).toFixed(2);

    // Neue Zeile in der Tabelle erstellen
    const table = document.getElementById('paymentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cellName = newRow.insertCell(0);
    const cellPrice = newRow.insertCell(1);
    const cellType = newRow.insertCell(2);
    const cellDate = newRow.insertCell(3);
    const cellFinalPrice = newRow.insertCell(4);

    cellName.innerText = name;
    cellPrice.innerText = price.toFixed(2) + ' €';
    cellType.innerText = type;
    cellDate.innerText = date;
    cellFinalPrice.innerText = finalPrice + ' €';

    // Formular zurücksetzen
    document.getElementById('paymentForm').reset();
});
