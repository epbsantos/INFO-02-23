document.getElementById('showMoreNews').addEventListener('click', function() {
    alert('Carregando mais notícias...');

    setTimeout(function() {
        const moreNews = [
            "<h3>Tecnologias ajudam no mapeamento e preservação florestal</h3><p></p>",
            `<a href="https://www.cnnbrasil.com.br/branded-content/nacional/tecnologias-ajudam-no-mapeamento-e-preservacao-florestal/" target="_blank">Link para CNN Brasil</a>`,
            "<h3>Cinco tendências de sustentabilidade em 2023</h3><p></p>",
            `<a href="https://greenworld.pt/cinco-tendencias-de-sustentabilidade-a-que-deve-estar-atento-em-2023/" target="_blank">Link para Green World</a>`,
            "<h3>Notícias sobre sustentabilidade no G1</h3><p></p>",
            `<a href="https://g1.globo.com/meio-ambiente/sustentabilidade/" target="_blank">Link para G1 Globo</a>`
        ];

        const newsContainer = document.getElementById('newsContainer');
        moreNews.forEach(function(news) {
            const newsItem = document.createElement('div');
            newsItem.className = 'newsItem';
            newsItem.innerHTML = news;
            newsContainer.appendChild(newsItem);
        });

        document.getElementById('showMoreNews').style.display = 'none';
    }, 1000); 
});


