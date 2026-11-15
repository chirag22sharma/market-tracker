
const api_key = "CG-Bbd4ZZzQz1tjBUNyPbgB2nye";

const api = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let allCoins = [];
const coinDetails = document.getElementById("coin-details");
async function fetchData() {
    const coinData = document.getElementById("coin-data");
    try {
        coinData.textContent = "Loading...";
        const response = await fetch(api, {
            headers: {
                "x-cg-demo-api-key": api_key
            }
        });
        const data = await response.json();
        allCoins = data;

        const coinNames = data.map(function (coin) {
            return coin.name;
        });
        console.log(coinNames);

        if (!response.ok) {
            throw new Error("Unable to fetch data from API");
        }
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
            coinCard.setAttribute("data-id", data[i].id);
            coinCard.className = "bg-gray-800 text-white p-5 rounded-xl shadow-lg border border-gray-600 hover:border-emerald-400 hover:shadow-xl transition duration-300";

            const coinName = document.createElement("h3");
            coinName.textContent = data[i].name;

            const coinPrice = document.createElement("p");
            coinPrice.textContent = "Price: $" + data[i].current_price;

            const watchlistBtn = document.createElement("button");
            watchlistBtn.textContent = "☆";
            watchlistBtn.className = "ml-2 text-yellow-500 text-2xl";
            watchlistBtn.addEventListener("click", function () {
                let coinFound = false;

                for (let j = 0; j < watchlist.length; j++) {
                    if (watchlist[j].id === data[i].id) {
                        coinFound = true;
                    }
                }

                if (coinFound === false) {
                    watchlist.push(data[i]);

                    localStorage.setItem("watchlist", JSON.stringify(watchlist));
                    watchlistData.textContent = "";

                    for (let j = 0; j < watchlist.length; j++) {
                        const savedCoin = document.createElement("p");

                        savedCoin.textContent = watchlist[j].name + " - $" + watchlist[j].current_price;

                        watchlistData.appendChild(savedCoin);
                    }

                    watchlistBtn.textContent = "★";
                }
            });


            coinCard.appendChild(coinName);
            coinCard.appendChild(coinPrice);
            coinCard.appendChild(watchlistBtn);
            coinCard.appendChild(coinChange);
            coinCard.appendChild(coinMarketCap);

            coinData.appendChild(coinCard);
        }


        const searchInput = document.getElementById("search-input");
        const searchBtn = document.getElementById("search-btn");

        searchBtn.addEventListener("click", async function () {
            const searchValue = searchInput.value.toLowerCase();

            const searchCoin = data.filter(function (coin) {
                return coin.name.toLowerCase().includes(searchValue);
            });

            if (searchCoin.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (searchCoin.includes(data[i])) {
                        coinData.children[i].style.display = "block";
                    } else {
                        coinData.children[i].style.display = "none";
                    }
                }
            } else {
                try {
                    const response = await fetch(
                        "https://api.coingecko.com/api/v3/search?query=" +
                        encodeURIComponent(searchValue),
                        {
                            headers: {
                                "x-cg-demo-api-key": api_key
                            }
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Search failed");
                    }
                    const searchData = await response.json();
                    if (searchData.coins.length > 0) {
                        showCoinDetails(searchData.coins[0].id);
                    } else {
                        coinDetails.textContent = "Coin not found.";
                    }
                } catch (error) {
                    console.log(error);
                    coinDetails.textContent = "Unable to search coin.";
                }
            }
        });

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


        const watchlistData = document.getElementById("watchlist-data");
        watchlistData.textContent = "";
        for (let i = 0; i < watchlist.length; i++) {
            const savedCoin = document.createElement("div");
            savedCoin.className = "bg-gray-800 text-white p-4 rounded-xl border border-gray-600 mb-3";
            savedCoin.textContent = watchlist[i].name + "- $" + watchlist[i].current_price;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "text-white bg-red-600 px-3 py-1 rounded-lg ml-3 hover:bg-red-700 transition duration-300";

            removeBtn.addEventListener("click", function () {
                watchlist.splice(i, 1);

                localStorage.setItem("watchlist", JSON.stringify(watchlist));
                savedCoin.remove();
            });
            savedCoin.appendChild(removeBtn);
            watchlistData.appendChild(savedCoin);
        }


        const sortSelect = document.getElementById("sort-select");
        sortSelect.addEventListener("change", function () {
            const sortValue = sortSelect.value;

            let sortedCoins = data
            if (sortValue == "low") {
                sortedCoins = data.sort(function (a, b) {
                    return a.current_price - b.current_price;
                });
            } else if (sortValue == "high") {
                sortedCoins = data.sort(function (a, b) {
                    return b.current_price - a.current_price;
                });
            } else if (sortValue == "change-low") {
                sortedCoins = data.sort(function (a, b) {
                    return a.price_change_percentage_24h - b.price_change_percentage_24h;
                });
            } else if (sortValue == "change-high") {
                sortedCoins = data.sort(function (a, b) {
                    return b.price_change_percentage_24h - a.price_change_percentage_24h;
                });
            } else if (sortValue == "market-low") {
                sortedCoins = data.sort(function (a, b) {
                    return a.market_cap - b.market_cap;
                });
            } else if (sortValue == "market-high") {
                sortedCoins = data.sort(function (a, b) {
                    return b.market_cap - a.market_cap;
                });
            }

            coinData.textContent = "";
            for (let i = 0; i < sortedCoins.length; i++) {
                const coinCard = document.createElement("div");
                coinCard.setAttribute("data-id", sortedCoins[i].id);
                coinCard.className = "bg-gray-800 text-white p-5 rounded-xl shadow-lg border border-gray-600 hover:border-emerald-400 hover:shadow-xl transition duration-300";

                const coinName = document.createElement("h3");
                coinName.textContent = sortedCoins[i].name;
                coinName.className = "text-lg font-bold text-emerald-400 mb-3";

                const coinPrice = document.createElement("p");
                coinPrice.textContent = "Price: $" + sortedCoins[i].current_price;
                const coinChange = document.createElement("p");
                coinChange.textContent = "24h Change: " + sortedCoins[i].price_change_percentage_24h + "%";
                if (sortedCoins[i].price_change_percentage_24h >= 0) {
                    coinChange.className = "text-green-500";
                } else {
                    coinChange.className = "text-red-500";
                }

                const coinMarketCap = document.createElement("p");
                coinMarketCap.textContent = "Market Cap: $" + sortedCoins[i].market_cap;

                coinCard.appendChild(coinName);
                coinCard.appendChild(coinPrice);
                coinCard.appendChild(coinChange);
                coinCard.appendChild(coinMarketCap);

                coinData.appendChild(coinCard);
            }
        });
        console.log(data);

    } catch (error) {

        console.log(error);
        coinData.textContent = "Unable to load coin data. Please try again later.";
        coinData.className = "bg-red-900 text-red-200 p-5 rounded-lg text-center";
    }
}
const refreshBtn = document.getElementById("refresh-btn");
refreshBtn.addEventListener("click", function () {
    fetchData();
})
async function showCoinDetails(coinId) {
    coinDetails.textContent = "Loading coin details...";

    try {
        const selectedCoin = allCoins.find(function (coin) {
            return coin.id === coinId;
        });

        console.log(selectedCoin);
        const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/" + coinId +
            "?localization=false&tickers=false&market_data=true"
            , {
                headers: {
                    "x-cg-demo-api-key": api_key
                }
            });
        if (!response.ok) {
            throw new Error("Unable to fetch coin details");
        }
        const details = await response.json();
        coinDetails.textContent = "";
        const name = document.createElement("h3");
        name.textContent = details.name;
        name.className = "text-xl font-bold text-white";

        const description = document.createElement("p");
        description.textContent = details.description.en
            ? details.description.en.replace(/<[^>]*>/g, "")
            : "Description not available.";
        description.className = "text-gray-300 mt-3";
        const price = document.createElement("p");
        price.textContent = "Price: $" +
            details.market_data.current_price.usd.toLocaleString("en-US");
        const marketCap = document.createElement("p");
        marketCap.textContent = "Market Cap: $" +
            details.market_data.market_cap.usd.toLocaleString("en-US");
        coinDetails.appendChild(name);
        coinDetails.appendChild(description);
        coinDetails.appendChild(price);
        coinDetails.appendChild(marketCap);
    } catch (error) {
        console.log(error);
        coinDetails.textContent = "Unable to load coin details.";
    }
}
const coinContainer = document.getElementById("coin-data");
coinContainer.addEventListener("click", function (event) {
    if (event.target.closest("button")) {
        return;
    }
    const coinCard = event.target.closest("[data-id]");
    if (coinCard) {
        const coinId = coinCard.getAttribute("data-id");
        showCoinDetails(coinId);
    }

});

fetchData();
