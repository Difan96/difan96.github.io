const app = document.getElementById('app');

// Fungsi untuk mengambil ID dari URL (contoh: ?id=judul)
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Navigasi tanpa reload halaman
function navigateToPost(id) {
    const newUrl = `${window.location.pathname}?id=${id}`;
    window.history.pushState({ id: id }, '', newUrl);
    loadContent();
}

function goHome() {
    const newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
    loadContent();
}

window.onpopstate = loadContent;

// Fungsi utama untuk memuat konten
async function loadContent() {
    const postId = getQueryParam('id');
    app.innerHTML = '<div class="list1" style="text-align:center;">Memuat data...</div>';

    if (postId) {
        await renderSinglePost(postId);
    } else {
        await renderPostList();
    }
}

// Menampilkan daftar artikel di halaman depan
async function renderPostList() {
    try {
        const response = await fetch('data/posts.json');
        if (!response.ok) throw new Error();
        const posts = await response.json();

        let html = '<div class="phdr"><b>ARTIKEL TERBARU</b></div>';
        posts.forEach((post, index) => {
            const cssClass = index % 2 === 0 ? 'list1' : 'list2';
            html += `
                <div class="${cssClass}">
                    <img src="http://putramsumatra.mw.lt/css/images/tmn.gif" style="vertical-align:middle;"> 
                    <a href="javascript:void(0)" onclick="navigateToPost('${post.id}')"><b>${post.title}</b></a>
                    <div style="margin-top:4px; color:#aaa;">${post.excerpt}</div>
                    <div class="func">Tgl: ${post.date}</div>
                </div>`;
        });
        app.innerHTML = html;
    } catch (e) {
        app.innerHTML = '<div class="rmenu">Belum ada artikel atau folder /data/posts.json belum dibuat.</div>';
    }
}

// Menampilkan isi artikel lengkap
async function renderSinglePost(id) {
    try {
        const response = await fetch(`data/${id}.json`);
        if (!response.ok) throw new Error();
        const post = await response.json();
        
        // Mengubah Markdown menjadi HTML
        const contentHtml = marked.parse(post.content);

        app.innerHTML = `
            <div class="phdr"><b>${post.title}</b></div>
            <div class="gmenu">Oleh: ${post.author} | ${post.date}</div>
            <div class="list1 markdown-body">${contentHtml}</div>
            <div class="list2">
                <a href="javascript:void(0)" onclick="goHome()">&laquo; Kembali ke Home</a>
            </div>`;
    } catch (e) {
        app.innerHTML = '<div class="rmenu">Artikel tidak ditemukan!</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadContent);
