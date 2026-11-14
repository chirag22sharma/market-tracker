
const api_key = "CG-Bbd4ZZzQz1tjBUNyPbgB2nye";

const api = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";
async function fetchData() {
    try {
        const response = await fetch(api, {
            headers: {
                "x-cg-demo-api-key": api_key
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Unable to fetch data from API");
        }

        const coinData = document.getElementById("coin-data");
        coinData.textContent = "";

        for (let i = 0; i < data.length; i++) {
            const coinChange = document.createElement("p");
            coinChange.textContent = "24h Change: " + data[i].price_change_percentage_24h + "%";

            const coinMarketCap = document.createElement("p");
            coinMarketCap.textContent = "Market Cap: $" + data[i].market_cap;

            if (data[i].price_change_percentage_24h >= 0) {
                coinChange.className = "text-green-500";
            } else {
                coinChange.className = "text-red-500";
            }

            const coinCard = document.createElement("div");
            coinCard.className = "bg-gray-800 p-4 rounded-lg shadow-md mb-4";

            const coinName = document.createElement("h3");
            coinName.textContent = data[i].name;

            const coinPrice = document.createElement("p");
            coinPrice.textContent = "Price: $" + data[i].current_price;


            coinCard.appendChild(coinName);
            coinCard.appendChild(coinPrice);
            coinCard.appendChild(coinChange);
            coinCard.appendChild(coinMarketCap);

            coinData.appendChild(coinCard);
        }
        const searchInput = document.getElementById("search-input");
        const searchBtn = document.getElementById("search-btn");

        searchBtn.addEventListener("click", function () {
            const searchValue = searchInput.value.toLowerCase();

            const searchCoin = data.filter(function (coin) {
                return coin.name.toLowerCase().includes(searchValue);
            });
            for (let i = 0; i < data.length; i++) {
                if (searchCoin.includes(data[i])) {
                    coinData.children[i].style.display = "block";
                } else {
                    coinData.children[i].style.display = "none";
                }
            }
        });
        console.log(data);

    } catch (error) {

        console.log(error);
    }
}

fetchData();
