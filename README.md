# Instalação

```bash
npm install
```

# Uso

```bash
HEADLESS=false DEVTOOLS=true npx ts-node discover.ts
```

### discover.ts

Esse cara possui uma lista de sites (hardcoded), e gera discover.csv e sites.json contendo
os possíveis GTM, GA3 e GA4.

### Saída

Como saída, temos o arquivo discover.csv, que pode ser importado para o sheets.