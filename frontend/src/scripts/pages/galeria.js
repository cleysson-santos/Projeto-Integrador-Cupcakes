const galleryModal = document.querySelector('#galleryModal');
const galleryModalImage = document.querySelector('#galleryModalImage');
const galleryModalClose = document.querySelector('#galleryModalClose');
const galleryImages = document.querySelectorAll('.container .card img');

function closeGalleryModal() {
    galleryModal.hidden = true;
    document.body.classList.remove('modal-open');
}

galleryImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', 'Abrir imagem ampliada');

    image.addEventListener('click', () => {
        galleryModalImage.src = image.src;
        galleryModalImage.alt = image.alt || 'Imagem ampliada da galeria';
        galleryModal.hidden = false;
        document.body.classList.add('modal-open');
        galleryModalClose.focus();
    });

    image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            image.click();
        }
    });
});

galleryModalClose.addEventListener('click', closeGalleryModal);

galleryModal.addEventListener('click', (event) => {
    if (event.target === galleryModal) {
        closeGalleryModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !galleryModal.hidden) {
        closeGalleryModal();
    }
});