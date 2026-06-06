const API_BASE_URL = 'https://vozyx-studio-backend-production-81e0.up.railway.app';

const checkoutStatus = document.getElementById('checkout-status');
const params = new URLSearchParams(window.location.search);
const status = params.get('status');

const statusMessages = {
  sucesso: 'Pagamento confirmado. Recebemos sua historia e em breve sua musica sera criada.',
  falha: 'O pagamento nao foi concluido. Voce pode tentar novamente pelo formulario.',
  pendente: 'Pagamento pendente. Assim que for confirmado, entraremos em contato.'
};

function showCheckoutStatus(message, statusName) {
  if (!checkoutStatus || !message) {
    return;
  }

  checkoutStatus.textContent = message;
  checkoutStatus.dataset.status = statusName;
  checkoutStatus.hidden = false;
}

showCheckoutStatus(statusMessages[status], status);

const musicForm = document.getElementById('music-form');

if (musicForm) {
  musicForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    const formData = new FormData(form);

    const data = {
      valor: 20,
      itens: [
        {
          title: 'Musica Personalizada Vozyx',
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

      const responseText = await response.text();
      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        result = { raw: responseText };
      }

      const paymentUrl =
        result.init_point ||
        result.sandbox_init_point ||
        result.url ||
        result.paymentUrl;

      if (!response.ok || !paymentUrl) {
        console.error('Erro ao criar pagamento:', {
          status: response.status,
          statusText: response.statusText,
          response: result
        });

        throw new Error(result.message || 'Erro na resposta do servidor');
      }

      window.location.href = paymentUrl;
    } catch (error) {
      const errorMessage =
        'Nao foi possivel gerar o pagamento agora. Confira seus dados ou fale pelo WhatsApp.';

      showCheckoutStatus(
        errorMessage,
        'falha'
      );

      if (!checkoutStatus) {
        alert(errorMessage);
      }

      button.disabled = false;
      button.textContent = originalText;
    }
  });
}
