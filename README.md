````markdown
# 🏥 Portal de Dashboards  
## Hospital Metropolitano Odilon Behrens

Este projeto consiste em um **Portal de Dashboards Institucional**, desenvolvido utilizando **HTML, CSS e JavaScript puro**, com foco em:

- **Usabilidade (UX)**
- **Visual limpo e institucional (UI)**
- **Alta performance**
- **Facilidade de manutenção e evolução**

O portal centraliza, em um único ambiente:

- 📊 Dashboards em Power BI  
- 📑 Planilhas Google  
- 📝 Formulários de controle  
- 🩺 Indicadores assistenciais e administrativos  

---

## 🎯 Objetivo do Projeto

Criar uma **página única, organizada e intuitiva** para acesso rápido aos principais recursos operacionais do hospital, como:

- Indicadores assistenciais  
- Controle de RH / PJ  
- Planilhas operacionais e administrativas  

Tudo isso com:

- Navegação simples por menu  
- Visual institucional (estilo hospitalar)  
- Código limpo, comentado e fácil de editar  

---

## 🧱 Tecnologias Utilizadas

- **HTML5** – Estrutura semântica da página  
- **CSS3** – Estilização, animações, responsividade e dark mode  
- **JavaScript (puro)** – Navegação entre seções e interações  
- **Power BI** – Dashboards externos  
- **Google Sheets / Forms** – Planilhas e formulários operacionais  

> ⚠️ O projeto **não utiliza frameworks** (Bootstrap, React, etc.), o que reduz complexidade e facilita a manutenção.

---

## 📂 Estrutura de Pastas Recomendada

```text
portal-dashboards/
│
├─ index.html
├─ style.css
├─ README.md
│
├─ img/
│   ├─ logo.webp
│   ├─ banner.webp
│   ├─ assistencial.webp
│   ├─ rh.webp
│   ├─ planilhas-horas.webp
│   ├─ planilhas-ocorrencias.webp
│   ├─ planilhas-kanban.webp
│   ├─ planilhas-udc.webp
│   └─ planilhas-formulario.webp
│
└─ bg-header.webp
````

---

## 🖥️ Como Executar o Projeto

1. Copie todos os arquivos do projeto
2. Mantenha `index.html` e `style.css` na mesma pasta
3. Abra o arquivo `index.html` em qualquer navegador moderno

✔ Não é necessário servidor
✔ Não há backend
✔ Internet é necessária apenas para acessar os links externos

---

## 🧭 Funcionamento da Navegação

O menu superior controla qual seção é exibida:

* 🩺 Assistencial
* 👥 RH / PJ
* 📑 Planilhas

A troca entre seções ocorre sem recarregar a página, utilizando JavaScript simples, com transições suaves e animações.

**Benefícios:**

* Interface limpa
* Menos poluição visual
* Navegação intuitiva
* Melhor experiência do usuário

---

## 🧩 Estrutura Geral do HTML

### 🔹 Banner Principal (Hero)

Apresenta o portal e reforça a identidade institucional do hospital.

### 🔹 Menu de Navegação

Controla a exibição das seções dinamicamente.

### 🔹 Seções de Conteúdo

Cada área do portal está organizada dentro de uma `<section>`:

* Assistencial
* RH / PJ
* Planilhas

Apenas uma seção fica visível por vez.

---

## 🖼️ Onde e Como Inserir Imagens

### 1️⃣ Imagens no topo dos cards (recomendado)

Cada card possui um espaço reservado para imagem:

```html
<div class="card-banner"></div>
```

As imagens são definidas exclusivamente no CSS:

```css
.assistencial-card .card-banner {
  background-image: url("./img/assistencial.webp");
}

.rh-card .card-banner {
  background-image: url("./img/rh.webp");
}
```

**Vantagens:**

* Não altera o HTML
* Padronização visual
* Troca rápida de imagens
* Melhor performance

### 2️⃣ Imagem do banner principal (topo da página)

No arquivo `style.css`, altere:

```css
.hero {
  background: url("./img/banner.webp");
}
```

---

## 🎨 Identidade Visual (UI)

O visual foi projetado para ambiente hospitalar e corporativo, seguindo princípios de:

* Cores claras e suaves
* Destaque institucional em laranja
* Cartões com sombra leve
* Bordas arredondadas
* Tipografia limpa e legível

---

## ✨ Animações e Interações

O portal conta com animações leves e performáticas:

* Transição suave entre seções
* Cards com efeito de elevação
* Botões com feedback visual
* Animação refinada no botão **“Acessar”**
* Botão flutuante de Dark Mode

Tudo feito apenas com **CSS e JavaScript puro**.

---

## 🌙 Modo Escuro (Dark Mode)

O portal possui modo escuro integrado, com:

* Alternância por ícone flutuante
* Cores ajustadas para leitura confortável
* Preservação da identidade visual
* Transições suaves

---

## 📱 Responsividade

O layout utiliza **CSS Grid** e **Media Queries**, adaptando-se automaticamente a:

* Desktop
* Notebook
* Tablets
* Smartphones

Sem necessidade de código extra.

---

## ➕ Como Adicionar um Novo Card

1. Copie um card existente
2. Cole dentro da `<div class="grid">` da seção desejada
3. Altere:

   * Título
   * Texto
   * Link

O layout se ajusta automaticamente.

---

## 🔧 Boas Práticas de Manutenção

* Manter HTML e CSS separados
* Centralizar imagens na pasta `/img`
* Usar sempre o `card-banner` para imagens
* Evitar alterações desnecessárias no JavaScript
* Utilizar imagens em `.webp` para melhor performance

---

## 🔐 Segurança

* O portal não armazena dados
* Apenas redireciona para sistemas externos
* A segurança depende das plataformas integradas (Power BI e Google)

---

## 🚀 Possíveis Evoluções Futuras

* Login institucional
* Controle de permissões por perfil
* Versão mobile dedicada
* Preview de dashboards Power BI
* Integração com APIs
* Dashboards internos via iframe

---

## 👨‍💻 Autor e Manutenção

Projeto desenvolvido para uso institucional, com foco em:

* Clareza
* Organização
* Performance
* Facilidade de manutenção

Pode ser mantido por qualquer pessoa com conhecimento básico em **HTML, CSS e JavaScript**.
