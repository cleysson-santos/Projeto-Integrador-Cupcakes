const favButtons = document.querySelectorAll('.section-maisPedidos .fav-btn');

favButtons.forEach((favButton) => {
    favButton.addEventListener('click', () => {
        favButton.classList.toggle('fav-btn-clicado');
    });
});
