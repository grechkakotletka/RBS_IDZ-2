document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchBtn").addEventListener("click", searchUserRepositories);
    
    // Пошук по натисканню Enter
    document.getElementById("usernameInput").addEventListener("keypress", (e) => {
        if (e.key === 'Enter') searchUserRepositories();
    });
});

// Допоміжна функція заголовків авторизації
function getAuthHeaders() {
    const token = document.getElementById("tokenInput").value.trim();
    const headers = { "Accept": "application/vnd.github.v3+json" };
    if (token) {
        headers["Authorization"] = `token ${token}`;
    }
    return headers;
}

async function searchUserRepositories() {
    const username = document.getElementById("usernameInput").value.trim();
    
    const loader = document.getElementById("loader");
    const resultsBlock = document.getElementById("resultsBlock");
    const errorAlert = document.getElementById("errorAlert");
    const repoList = document.getElementById("repoList");
    const detailsPlaceholder = document.getElementById("detailsPlaceholder");
    const repoDetails = document.getElementById("repoDetails");

    // Очищення інтерфейсу перед новим пошуком
    errorAlert.classList.add("d-none");
    resultsBlock.classList.add("d-none");
    detailsPlaceholder.classList.remove("d-none");
    repoDetails.classList.add("d-none");
    repoList.innerHTML = "";

    if (!username) {
        showError("Будь ласка, введіть ім'я користувача GitHub.");
        return;
    }

    loader.classList.remove("d-none");

    try {
        const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

        const response = await fetch(apiUrl, { headers: getAuthHeaders() });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Користувача "${username}" не знайдено в реєстрах GitHub.`);
            } else if (response.status === 403) {
                throw new Error("Перевищено ліміт запитів GitHub API. Будь ласка, вкажіть Personal Access Token.");
            } else {
                throw new Error(`Помилка сервера: ${response.status}`);
            }
        }

        const repos = await response.json();

        if (repos.length === 0) {
            throw new Error(`У користувача "${username}" немає публічних репозиторіїв.`);
        }

        document.getElementById("reposTitle").innerText = `Знайдені репозиторії (${repos.length}):`;

        // Відображення списку репозиторіїв
        repos.forEach(repo => {
            const a = document.createElement("a");
            a.className = "list-group-item list-group-item-action repo-item d-flex justify-content-between align-items-center";
            a.innerHTML = `
                <span class="fw-semibold text-break">${repo.name}</span>
                <span class="badge badge-gh rounded-pill">${repo.language || 'Code'}</span>
            `;

            a.addEventListener("click", () => {
                document.querySelectorAll(".repo-item").forEach(item => item.classList.remove("active"));
                a.classList.add("active");

                loadRepositoryDetails(repo);
            });

            repoList.appendChild(a);
        });

        resultsBlock.classList.remove("d-none");

    } catch (error) {
        showError(error.message);
    } finally {
        loader.classList.add("d-none");
    }
}

async function loadRepositoryDetails(repo) {
    const detailsPlaceholder = document.getElementById("detailsPlaceholder");
    const repoDetails = document.getElementById("repoDetails");
    const commitsContainer = document.getElementById("detailCommits");
    const languagesContainer = document.getElementById("detailLanguages");

    detailsPlaceholder.classList.add("d-none");
    repoDetails.classList.remove("d-none");

    // Основні дані
    document.getElementById("detailName").innerText = repo.name;
    document.getElementById("detailDescription").innerText = repo.description || "Опис відсутній.";
    document.getElementById("detailUrl").href = repo.html_url;
    document.getElementById("detailCreated").innerText = formatDate(repo.created_at);
    document.getElementById("detailUpdated").innerText = formatDate(repo.updated_at);

    // Очищення блоків
    languagesContainer.innerHTML = '<span class="spinner-border spinner-border-sm text-secondary"></span>';
    commitsContainer.innerHTML = '<li class="list-group-item text-muted border-0">Завантаження комітів...</li>';

    // 1. Мови
    try {
        const langResponse = await fetch(repo.languages_url, { headers: getAuthHeaders() });
        if (langResponse.ok) {
            const languages = await langResponse.json();
            const langKeys = Object.keys(languages);

            if (langKeys.length > 0) {
                languagesContainer.innerHTML = langKeys
                    .map(lang => `<span class="badge bg-secondary me-1">${lang}</span>`)
                    .join("");
            } else {
                languagesContainer.innerText = "Мови не вказано";
            }
        }
    } catch {
        languagesContainer.innerText = "Не вдалося завантажити мови";
    }

    // 2. Коміти (до 10 шт)
    try {
        const commitsUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=10`;
        const commitsResponse = await fetch(commitsUrl, { headers: getAuthHeaders() });

        if (!commitsResponse.ok) {
            if (commitsResponse.status === 409) {
                commitsContainer.innerHTML = '<li class="list-group-item text-muted border-0">Репозиторій порожній.</li>';
                return;
            }
            throw new Error();
        }

        const commits = await commitsResponse.json();
        commitsContainer.innerHTML = "";

        commits.forEach(item => {
            const li = document.createElement("li");
            li.className = "list-group-item px-0 bg-transparent";

            const msg = item.commit.message.split('\n')[0];
            const hash = item.sha.substring(0, 7);
            const date = formatDate(item.commit.author.date);

            li.innerHTML = `
                <div class="fw-bold text-dark">${escapeHtml(msg)}</div>
                <div class="text-muted text-monospace" style="font-size: 0.8rem;">
                    <code>${hash}</code> • ${date}
                </div>
            `;
            commitsContainer.appendChild(li);
        });

    } catch {
        commitsContainer.innerHTML = '<li class="list-group-item text-danger border-0">Не вдалося завантажити коміти.</li>';
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showError(message) {
    const errorAlert = document.getElementById("errorAlert");
    errorAlert.innerText = message;
    errorAlert.classList.remove("d-none");
}

function escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[s];
    });
}