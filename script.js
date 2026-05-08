const API_BASE_URL = 'https://vozyx-studio-backend-production.up.railway.app';

const checkoutStatus = document.getElementById('checkout-status');
const params = new URLSearchParams(window.location.search);
const status = params.get('status');

const statusMessages = {
  sucesso: 'Pagamento confirmado. Recebemos sua história e em breve sua música será criada.',
  falha: 'O pagamento não foi concluído. Você pode tentar novamente pelo formulário.',
  pendente: 'Pagamento pendente. Assim que for confirmado, entraremos em contato.'
};

if (statusMessages[status]) {
  checkoutStatus.textContent = statusMessages[status];
  checkoutStatus.dataset.status = status;
  checkoutStatus.hidden = false;
}

document
  .getElementById('music-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    const formData = new FormData(form);

    const data = {
      valor: 20,
      itens: [
        {
          title: 'Música Personalizada Vozyx',
          quantity: 1,
          unit_price: 20,
          currency_id: 'BRL'
        }
      ],
      cliente: {
        nome: formData.get('nome'),
        whatsapp: formData.get('whatsapp'),
        email: formData.get('email')
      },
      pedido: {
        tipo: formData.get('tipo'),
        estilo: formData.get('estilo'),
        voz: formData.get('voz'),
        historia: formData.get('historia'),
        observacoes: formData.get('observacoes') || ''
      }
    };

    button.disabled = true;
    button.textContent = 'Gerando pagamento...';

    try {
      const response = await fetch(`${API_BASE_URL}/criar-pagamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.init_point) {
        throw new Error(result.message || 'Erro na resposta do servidor');
      }

      window.location.href = result.init_point;
    } catch (error) {
      checkoutStatus.textContent = 'Não foi possível gerar o pagamento agora. Confira seus dados ou fale pelo WhatsApp.';
      checkoutStatus.dataset.status = 'falha';
      checkoutStatus.hidden = false;

      button.disabled = false;
      button.textContent = originalText;
    }
  });
