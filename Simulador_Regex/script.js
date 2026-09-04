// script.js
// Pegando as referências dos inputs e divs lá do HTML
// o JavaScript possui uma classe nativa chamada RegExp para trabalhar com expressões regulares
const inputExpressao = document.getElementById('regexInput');
const inputTexto = document.getElementById('textInput');
const divMatches = document.getElementById('matchesOutput');

// Função que roda toda vez que o usuário digita algo
function testarExpressao() {
    const expressao = inputExpressao.value;
    const texto = inputTexto.value;

    // Se estiver vazio, só reseta a interface
    if (!expressao || !texto) {
        divMatches.innerHTML = 'Nenhum teste realizado ainda.';
        return;
    }

    try {
        // Usa a flag 'g' para encontrar todas as correspondências, assim como nos outros sites de Regex
        const regex = new RegExp(expressao, 'g');
        
        // Verifica se há pelo menos um match
        const ehValida = regex.test(texto);

        if (ehValida) {
            // Reinicia a regex para fazer o replace corretamente (pois o test avançou o índice)
            const regexGlobal = new RegExp(expressao, 'g');
            // Destaca os trechos encontrados
            const textoComDestaque = texto.replace(regexGlobal, match => `<mark>${match}</mark>`);
            divMatches.innerHTML = textoComDestaque;
        } else {
            // Mostra o texto limpo, sem nada destacado
            divMatches.textContent = texto;
        }
    } catch (erro) {
        // Se a expressão estiver incompleta ou inválida sintaticamente
        divMatches.textContent = 'Expressão regular inválida. Corrija a sintaxe.';
    }
}

// Escutando os eventos de digitação pra atualizar em tempo real
inputExpressao.addEventListener('input', testarExpressao);
inputTexto.addEventListener('input', testarExpressao);
