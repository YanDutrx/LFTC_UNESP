# Simulador de Linguagens Formais (Regex & Gramáticas Regulares)

Este projeto é um simulador web unificado de **Expressões Regulares (Regex)** e **Gramáticas Regulares (GRD, GRE, GRUD, GRUE)** desenvolvido como requisito para a disciplina de **Linguagens Formais e Teoria da Computação (LFTC)**.

## Sobre o Projeto

O sistema reúne em uma **única interface acadêmica coesa** dois módulos fundamentais da hierarquia de Chomsky (Tipo 3 - Linguagens Regulares):

1. **Módulo Expressão Regular (Regex):**
   - Validação de padrões em tempo real.
   - Destaque visual interativo (*highlight*) de todas as ocorrências encontradas no texto alvo.
   - Feedback de status do match com diagnóstico de sintaxe.

2. **Módulo Gramática Regular (GR):**
   - Inserção flexível de produções no formato $A \to \alpha$ (com suporte a alternativas `|` e símbolos de cadeia vazia $\epsilon, \lambda, e$).
   - **Classificador Formal Automático** baseado na lousa e slides do Prof. Dr. Celso Olivette Junior:
     - **GRD** (Regular à Direita): $A \to wB \mid w$ ($|w| \ge 0$).
     - **GRE** (Regular à Esquerda): $A \to Bw \mid w$ ($|w| \ge 0$).
     - **GRUD** (Regular Unitária à Direita): $A \to aB \mid a \mid \epsilon$ ($|w| \le 1$).
     - **GRUE** (Regular Unitária à Esquerda): $A \to Ba \mid a \mid \epsilon$ ($|w| \le 1$).
     - Detecção e justificativa de gramáticas **Não-Regulares** (Livre de Contexto / Tipo 2).
   - Extração automática do **Quarteto Formal:** $G = (V, T, P, S)$.
   - **Simulador e Reconhecedor de Sentenças:** testa se uma palavra pertence à linguagem da gramática.
   - **Rastreamento de Derivação Passo a Passo:** exibe a cadeia de derivação $S \Rightarrow^* w$ e a evolução de cada passo sentencial.
   - **Menu de Exemplos Prontos:** acesso imediato aos casos clássicos apresentados em aula (ex: $a(ba)^*$, $a^*bb$, $(a|b)^*(aa|bb)$, $0^+ 1 0^*$).

## Tecnologias Utilizadas

O projeto foi construído utilizando apenas tecnologias web nativas, sem dependências externas:
- **HTML5:** Estruturação semântica da página com navegação por abas.
- **CSS3:** Estilização visual mantendo o padrão institucional sóbrio e acadêmico.
- **JavaScript (ES6):** Motor de parsing, autômatos conceituais, classificação formal e busca em largura (BFS) para derivação sentencial.

## Como Executar Localmente

Como não há dependências complexas ou compilação necessária:

**Opção 1: Direto no navegador (Mais simples)**
1. Clone ou acesse este repositório.
2. Dê um duplo clique no arquivo `index.html`.
3. O projeto abrirá no seu navegador padrão e já estará pronto para uso.

**Opção 2: Servidor Local (Opcional)**
1. Abra o terminal na pasta do projeto.
2. Execute: `python -m http.server 3000`
3. Acesse `http://localhost:3000` em seu navegador.

## Autores (Integrantes do Grupo)

- Gustavo Leão Pontes Nunes
- João Pedro Biffe Lopes Pedroso
- Yan Felipe Dutra Martins

---
**Disciplina:** Linguagens Formais e Teoria da Computação (LFTC)  
**Professor:** Dr. Celso Olivette Junior  
**Instituição:** Faculdade de Ciências e Tecnologia UNESP (FCT-UNESP) - 6º Semestre de Ciência da Computação
