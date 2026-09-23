const paymentForm = document.querySelector('#paymentForm');
const paymentOptions = document.querySelectorAll('input[name="pagamento"]');
const paymentPanels = document.querySelectorAll('[data-payment-panel]');
const boletoButton = document.querySelector('.generate-boleto');
const boletoCode = document.querySelector('.boleto-code');
const formError = document.querySelector('#formError');

function updatePaymentPanel() {
    const selectedPayment = document.querySelector('input[name="pagamento"]:checked').value;

    paymentPanels.forEach((panel) => {
        const isSelected = panel.dataset.paymentPanel === selectedPayment;
        panel.hidden = !isSelected;
        panel.querySelectorAll('input').forEach((input) => {
            input.required = isSelected;
        });
    });

    formError.hidden = true;
}

paymentOptions.forEach((option) => option.addEventListener('change', updatePaymentPanel));

boletoButton.addEventListener('click', () => {
    boletoCode.hidden = false;
    boletoButton.textContent = 'Boleto gerado';
    boletoButton.disabled = true;
});

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formError.hidden = true;

    if (!paymentForm.checkValidity()) {
        paymentForm.reportValidity();
        formError.textContent = 'Confira os campos obrigatórios antes de concluir o pedido.';
        formError.hidden = false;
        return;
    }

    const selectedPayment = document.querySelector('input[name="pagamento"]:checked').value;

    if (selectedPayment === 'boleto' && boletoCode.hidden) {
        formError.textContent = 'Clique em "Gerar boleto" antes de concluir o pedido.';
        formError.hidden = false;
        return;
    }

    window.location.href = '/src/pages/pedido-concluido.html';
});

updatePaymentPanel();