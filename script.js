const app = document.getElementById('app');

// 1. Setup Navigasi (Sama seperti sebelumnya)
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

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

// 2. Router Utama
async function loadContent() {
    const postId = getQueryParam('id');
    
    // Tampilan Loading gaya WAP
    app.innerHTML = '<div class="list1" style="text-align:center;">Sedang memuat...</div>';

    if (postId) {
        await renderSinglePost(postId);
    } else {
        await renderPostList();
    }
}

// 3. Render Daftar Artikel (Gaya WAP List)
async function renderPostList() {
    try {
        const response = await fetch('data/posts.json');
        if (!response.ok) throw new Error('Network error');
        const posts = await response.json();

        let html = '';
        
        // Judul Halaman
        html += '<div class="phdr"><b>Artikel Terbaru</b></div>';

        posts.forEach((post, index) => {
            // Selang-seling warna (Ganjil: list1, Genap: list2)
            const cssClass = index % 2 === 0 ? 'list1' : 'list2';
            
            html += `
                <div class="${cssClass}">
                    <img src="http://putramsumatra.mw.lt/css/images/tmn.gif" style="vertical-align:middle;"> 
                    <a href="javascript:void(0)" onclick="navigateToPost('${post.id}')"><b>${post.title}</b></a>
                    
                    <div style="margin-top:2px;">${post.excerpt}</div>
                    
                    <div class="func">
                        Diposting pada: ${post.date}
                    </div>
                </div>
            `;
        });

        // Tombol Navigasi Bawah
        html += `
            <div class="gmenu" style="text-align:center;">
                <a href="#">Next &raquo;</a>
            </div>
        `;

        app.innerHTML = html;
    } catch (error) {
        app.innerHTML = '<div class="rmenu">Gagal memuat data posts.json</div>';
    }
}

// 4. Render Artikel Lengkap
async function renderSinglePost(id) {
    try {
        const response = await fetch(`data/${id}.json`);
        if (!response.ok) {
            app.innerHTML = '<div class="rmenu">Artikel tidak ditemukan!</div><div class="bmenu"><a href="#" onclick="goHome()">Kembali</a></div>';
            return;
        }

        const post = await response.json();
        const contentHtml = marked.parse(post.content);

        let html = `
            <div class="phdr"><b>${post.title}</b></div>
            
            <div class="gmenu">
                Oleh: <b>${post.author}</b> | ${post.date}
            </div>

            <div class="list1 markdown-body" style="padding: 8px;">
                ${contentHtml}
            </div>
            
            <div class="bmenu">
                &laquo; <a href="#" onclick="goHome()">Kembali ke Depan</a>
            </div>
        `;

        app.innerHTML = html;
    } catch (error) {
        app.innerHTML = '<div class="rmenu">Error memuat artikel.</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadContent);
