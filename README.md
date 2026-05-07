# Vozyx Studio

Frontend estatico da Vozyx Studio.

## Estrutura

- `audio/`
- `imagens/`
- `index.html`
- `style.css`
- `script.js`
- `README.md`
- `.gitignore`

## Checkout

O formulario envia os dados para a API externa configurada em `script.js`, por meio de `API_BASE_URL`.

Endpoint usado pelo frontend:

```text
https://vozyx-studio-backend-production.up.railway.app/criar-pagamento
```

## Deploy

Deploy recomendado: Vercel apontando para a raiz deste repositorio.

Nao ha build step, framework ou servidor local neste projeto.
