document.querySelector('#fullview').setAttribute('tabindex', 0);
document.querySelector('#fullview').focus();

document.addEventListener('DOMContentLoaded', function() {
    var fullview = new Fullview('#fullview', {
        direction: 'horizontal',
        loop: true, // Para permitir a rolagem contínua
    });

    var downButton = document.getElementById('down');
        downButton.addEventListener('click', function() {
            fullview.next();
        });
            
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            fullview.next(); // Navegar para a próxima seção quando a seta direita for pressionada
        } else if (event.key === 'ArrowLeft') {
            fullview.prev(); // Navegar para a seção anterior quando a seta esquerda for pressionada
        }
    });
});