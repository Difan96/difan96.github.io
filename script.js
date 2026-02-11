const app = document.getElementById('app');

async function renderPostList() {
    app.innerHTML = '<div class="list1">Memuat daftar...</div>';
    try {
        const response = await fetch('data/post.json');
        const posts = await response.json();
        let html = '';
        
        posts.forEach((post, index) => {
            // Selang-seling antara list1 dan list2
            const classList = (index % 2 === 0) ? 'list1' : 'list2';
            html += `
                <div class="${classList}">
                    <img src="${post.image}" style="vertical-align:middle; margin-right:5px;">
                    <a href="#post/${post.id}" onclick="renderSinglePost('${post.id}')"><b>${post.title}</b></a>
                    <br><small>${post.date}</small>
                </div>
            `;
        });
        app.innerHTML = html;
    } catch (error) {
        app.innerHTML = '<div class="list1" style="color:red;">Gagal memuat artikel.</div>';
    }
}

async function renderSinglePost(id) {
    app.innerHTML = '<div class="list1">Memuat isi...</div>';
    try {
        const response = await fetch(`data/${id}.json`);
        const post = await response.json();
        const contentHtml = marked.parse(post.content);
        
        app.innerHTML = `
            <div class="phdr">${post.title}</div>
            <div class="list1">
                <small>Oleh: ${post.author} | ${post.date}</small>
                <div style="margin-top:10px;" class="maintxt">${contentHtml}</div>
                <div class="func">
                    <a href="javascript:void(0)" onclick="renderPostList()">« Kembali</a>
                </div>
            </div>
        `;
    } catch (error) {
        app.innerHTML = '<div class="list1">Artikel tidak ditemukan.</div>';
    }
}

window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#post/')) {
        renderSinglePost(hash.replace('#post/', ''));
    } else {
        renderPostList();
    }
});
