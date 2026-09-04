// script.js
// Pegando as referências dos inputs e divs lá do HTML
// o JavaScript possui uma classe nativa chamada RegExp para trabalhar com expressões regulares
const inputExpressao = document.getElementById('regexInput');
const inputTexto = document.getElementById('textInput');
const mensagemStatus = document.getElementById('statusMessage');
const divMatches = document.getElementById('matchesOutput');

// Função que roda toda vez que o usuário digita algo
function testarExpressao() {
    const expressao = inputExpressao.value;
    const texto = inputTexto.value;

    // Se estiver vazio, só reseta a interface
    if (!expressao || !texto) {
        mensagemStatus.textContent = 'Aguardando entrada...';
        mensagemStatus.className = 'status-box neutral';
        divMatches.innerHTML = 'Nenhum teste realizado ainda.';
        return;
    }

    try {
        // A gente cria o objeto RegExp. Adicionamos a flag 'g' por padrão para buscar todas as ocorrências
        const regex = new RegExp(expressao, 'g');
        
        // Verifica se dá match (se a expressão é válida pro texto)
        const ehValida = regex.test(texto);

        if (ehValida) {
            mensagemStatus.textContent = 'VÁLIDA! A expressão encontrou correspondências no texto.';
            mensagemStatus.className = 'status-box success';

            // Agora a gente destaca as palavras que deram match
            destacarTexto(regex, texto);
        } else {
            mensagemStatus.textContent = 'INVÁLIDA! A expressão não encontrou nada no texto.';
            mensagemStatus.className = 'status-box error';
            
            // Mostra o texto limpo, sem nada destacado
            divMatches.textContent = texto;
        }
    } catch (erro) {
        // Cai aqui se tiver erro de compilação da Regex
        mensagemStatus.textContent = 'Erro de Sintaxe na Expressão Regular.';
        mensagemStatus.className = 'status-box error';
        divMatches.textContent = 'Por favor, corrija a sintaxe da expressão regular.';
    }
}

// Função pra colocar aquele fundo amarelo (tag <mark>) no que deu match
function destacarTexto(regexOrigem, texto) {
    // Pra destacar tudo, precisamos garantir que a flag global 'g' tá ligada, senão ele só substitui a primeira ocorrência
    let flagsUsadas = regexOrigem.flags;
    if (!flagsUsadas.includes('g')) {
        flagsUsadas += 'g';
    }
    
    try {
        const regexGlobal = new RegExp(regexOrigem.source, flagsUsadas);
        
        // O $& significa "a própria string que casou com a expressão"
        const textoComDestaque = texto.replace(regexGlobal, match => `<mark>${match}</mark>`);
        
        divMatches.innerHTML = textoComDestaque;
    } catch (erro) {
        divMatches.textContent = 'Ocorreu um erro ao tentar destacar o texto.';
    }
}

// Escutando os eventos de digitação pra atualizar em tempo real
inputExpressao.addEventListener('input', testarExpressao);
inputTexto.addEventListener('input', testarExpressao);
