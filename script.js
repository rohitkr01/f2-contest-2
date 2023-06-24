const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const sortMarketCapButton = document.getElementById('sort-market-cap-button');
const sortPercentageChangeButton = document.getElementById('sort-percentage-change-button');
const dataTable = document.getElementById('data-table');

let coinData = []; 

fetchData()
    .then(data => {
        coinData = data;
        renderTable(coinData);
    })
    .catch(error => console.log(error));


function fetchData() {
    return fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
        .then(response => response.json())
        .catch(error => console.log(error));
}

// Render the table with the fetched data
function renderTable(data) {
    const tableBody = dataTable.querySelector('tbody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        
        const idCell = createTableCell(item.id);
        const nameCell = createTableCell(item.name);
        const symbolCell = createTableCell(item.symbol.toUpperCase());
        const imageCell = createImageTableCell(item.image, item.name);
        const priceCell = createTableCell('$' + item.current_price);
        const volumeCell = createTableCell('$'+ item.total_volume);
        const changeCell = createChangeTableCell(item.price_change_percentage_24h);
        const marketCapCell = createTableCell("Mkt Cap : "+ '$' + item.market_cap);
        
    
        row.appendChild(imageCell);
        row.appendChild(nameCell);
        row.appendChild(symbolCell);
        row.appendChild(priceCell);
        row.appendChild(volumeCell);
        row.appendChild(changeCell);
        row.appendChild(marketCapCell);

        tableBody.appendChild(row);
    });
}


const createTableCell = (text) =>{
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}
  
const createImageTableCell = (imageUrl, altText) => {
    const cell = document.createElement('td');
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = altText;
    image.width= 35;
    cell.appendChild(image);
    return cell;
}
  
const createChangeTableCell = (changePercentage) => {
    const cell = document.createElement('td');
    const changeValue = changePercentage.toFixed(2) + '%';
    cell.textContent = changeValue;
  
    if (changePercentage < 0) {
      cell.classList.add('negative');
    } else {
      cell.classList.add('positive');
    }
  
    return cell;
}

// ----------
// Search functionality
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredData = coinData.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.symbol.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
});

// Sort by Market Cap
sortMarketCapButton.addEventListener('click', () => {
    const sortedData = [...coinData].sort((a, b) => a.market_cap - b.market_cap);
    renderTable(sortedData);
});

// Sort by Percentage Change
sortPercentageChangeButton.addEventListener('click', () => {
    const sortedData = [...coinData].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    renderTable(sortedData);
});
