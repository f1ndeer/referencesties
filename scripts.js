document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.getElementById("main-content");
    const searchInput = document.getElementById("searchInput");
    let allData = []; // Храним все данные здесь

    // 1. Загружаем данные
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            allData = data; // Запоминаем данные
            renderPage(allData); // Рисуем страницу
        })
        .catch(error => console.error("Ошибка:", error));

    // 2. Слушаем ввод в поле поиска
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();

            // Фильтруем данные
            const filteredData = allData.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.tag.toLowerCase().includes(searchTerm)
            );

            renderPage(filteredData);
        });
    }

    // Функция отрисовки (та же, что и была, но теперь очищает контейнер перед рисованием)
    function renderPage(data) {
        mainContainer.innerHTML = ""; // Очищаем перед новой отрисовкой

        if (data.length === 0) {
            mainContainer.innerHTML = "<p style='text-align:center; color:#777;'>Ничего не найдено :(</p>";
            return;
        }

        const categories = {};

        data.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });

        for (const [categoryName, items] of Object.entries(categories)) {
            const section = document.createElement("section");
            section.classList.add("referenc_section");

            const title = document.createElement("h2");
            title.classList.add("section_title");
            title.textContent = categoryName;

            const grid = document.createElement("div");
            grid.classList.add("referenc_grid");

            items.forEach(site => {
                const cardHTML = `
                    <a href="${site.url}" target="_blank" class="card">
                        <div class="card-image-wrapper">
                            <img src="${site.image}" alt="${site.title}">
                            <span class="card-tag">${site.tag}</span>
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">${site.title}</h3>
                            <p class="card-description">${site.description}</p>
                            <span class="card-btn">Перейти</span>
                        </div>
                    </a>
                `;
                grid.innerHTML += cardHTML;
            });

            section.appendChild(title);
            section.appendChild(grid);
            mainContainer.appendChild(section);
        }
    }
});