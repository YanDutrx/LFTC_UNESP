// script.js - Simulador Unificado: Expressões Regulares & Gramáticas Regulares (LFTC UNESP)
// Autores: Gustavo Leão Pontes Nunes, João Pedro Biffe Lopes Pedroso e Yan Felipe Dutra Martins
// Disciplina: Linguagens Formais e Teoria da Computação - Prof. Dr. Celso Olivette Junior

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CONTROLE DE NAVEGAÇÃO E SELEÇÃO DE MODO (TABS)
       ========================================================================== */
    const btnModeRegex = document.getElementById('btnModeRegex');
    const btnModeGrammar = document.getElementById('btnModeGrammar');
    const sectionRegex = document.getElementById('sectionRegex');
    const sectionGrammar = document.getElementById('sectionGrammar');
    const mainTitle = document.getElementById('mainTitle');

    function switchMode(mode) {
        if (mode === 'regex') {
            btnModeRegex.classList.add('active');
            btnModeGrammar.classList.remove('active');
            sectionRegex.style.display = 'block';
            sectionGrammar.style.display = 'none';
            mainTitle.textContent = 'Simulador de Expressão Regular';
        } else {
            btnModeGrammar.classList.add('active');
            btnModeRegex.classList.remove('active');
            sectionGrammar.style.display = 'block';
            sectionRegex.style.display = 'none';
            mainTitle.textContent = 'Simulador de Gramática Regular';
            processarGramatica();
        }
    }

    btnModeRegex.addEventListener('click', () => switchMode('regex'));
    btnModeGrammar.addEventListener('click', () => switchMode('grammar'));


    /* ==========================================================================
       2. MÓDULO 1: EXPRESSÃO REGULAR (REGEX)
       ========================================================================== */
    const inputExpressao = document.getElementById('regexInput');
    const inputTexto = document.getElementById('textInput');
    const divMatches = document.getElementById('matchesOutput');
    const matchInfoArea = document.getElementById('matchInfoArea');

    function testarExpressao() {
        const expressao = inputExpressao.value;
        const texto = inputTexto.value;

        if (!expressao || !texto) {
            matchInfoArea.innerHTML = `<p class="match-info-highlight neutral">Aguardando entrada...</p>`;
            divMatches.innerHTML = 'Nenhum teste realizado ainda.';
            return;
        }

        try {
            const regex = new RegExp(expressao, 'g');
            const ehValida = regex.test(texto);

            if (ehValida) {
                const regexGlobal = new RegExp(expressao, 'g');
                const textoComDestaque = texto.replace(regexGlobal, match => `<mark>${match}</mark>`);
                divMatches.innerHTML = textoComDestaque;
                
                matchInfoArea.innerHTML = `
                    <p class="match-info-highlight success">A sua expressão regular encontrou correspondências no texto.</p>
                `;
            } else {
                divMatches.textContent = texto;
                matchInfoArea.innerHTML = `
                    <p class="match-info-highlight error">A sua expressão regular não deu match no texto alvo.</p>
                    <p class="match-info-subtext">Tente revisar a sua sintaxe para descobrir o porquê.</p>
                `;
            }
        } catch (erro) {
            divMatches.textContent = 'Expressão regular inválida. Corrija a sintaxe.';
            matchInfoArea.innerHTML = `
                <p class="match-info-highlight error">Erro de sintaxe na expressão regular.</p>
            `;
        }
    }

    inputExpressao.addEventListener('input', testarExpressao);
    inputTexto.addEventListener('input', testarExpressao);


    /* ==========================================================================
       3. MÓDULO 2: GRAMÁTICA REGULAR (GRE, GRD, GRUD, GRUE)
       ========================================================================== */
    const grammarInput = document.getElementById('grammarInput');
    const wordInput = document.getElementById('wordInput');
    const grammarPresetSelect = document.getElementById('grammarPresetSelect');
    const classificationBadge = document.getElementById('classificationBadge');
    const classificationExplanation = document.getElementById('classificationExplanation');
    const quartetoV = document.getElementById('quartetoV');
    const quartetoT = document.getElementById('quartetoT');
    const quartetoS = document.getElementById('quartetoS');
    const quartetoP = document.getElementById('quartetoP');
    const grammarMatchInfoArea = document.getElementById('grammarMatchInfoArea');
    const derivationArea = document.getElementById('derivationArea');
    const derivationSteps = document.getElementById('derivationSteps');

    // Exemplos pré-carregados
    const PRESETS = {
        ex_grud_aba: {
            text: "S -> aA\nA -> bB | e\nB -> aA",
            word: "ababa",
            desc: "Linguagem a(ba)* modelada em GRUD (|w| ≤ 1, variável à direita)."
        },
        ex_grue_aba: {
            text: "S -> Aa | a\nA -> Sb",
            word: "ababa",
            desc: "Linguagem a(ba)* modelada em GRUE (|w| ≤ 1, variável à esquerda)."
        },
        ex_grd_aba: {
            text: "S -> aA\nA -> baA | e",
            word: "ababa",
            desc: "Linguagem a(ba)* em GRD com bloco terminal 'ba' (|w| = 2)."
        },
        ex_gre_aba: {
            text: "S -> Sba | a",
            word: "ababa",
            desc: "Linguagem a(ba)* em GRE com bloco terminal 'ba' (|w| = 2)."
        },
        ex_abb_grd: {
            text: "A -> aA | B\nB -> bb",
            word: "aabb",
            desc: "Linguagem a*bb em GRD (não-unitária pois 'bb' possui comprimento 2)."
        },
        ex_abb_grud: {
            text: "A -> aA | bB\nB -> b",
            word: "aabb",
            desc: "Linguagem a*bb fatiada em GRUD (|w| ≤ 1 para todas as produções)."
        },
        ex_par_id_grd: {
            text: "S -> aS | bS | A\nA -> aa | bb",
            word: "abaa",
            desc: "Linguagem (a|b)*(aa|bb) em GRD terminando no par idêntico."
        },
        ex_prova_grue: {
            text: "S -> S0 | A1\nA -> A0 | 0",
            word: "0100",
            desc: "Linguagem 0⁺ 1 0* em GRUE com derivação da direita para a esquerda."
        },
        ex_nao_regular_glc: {
            text: "S -> aSb | e",
            word: "aabb",
            desc: "Linguagem aⁿbⁿ é Livre de Contexto (GLC). A regra S -> aSb viola a linearidade (não-terminal no meio)."
        }
    };

    // Parser Formal de Gramática: G = (V, T, P, S)
    function parseGrammar(rawText) {
        const lines = rawText.split('\n');
        const rules = [];
        const variablesSet = new Set();
        let startSymbol = null;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

            let sep = null;
            if (trimmed.includes('->')) sep = '->';
            else if (trimmed.includes('→')) sep = '→';
            else if (trimmed.includes(':')) sep = ':';
            else if (trimmed.includes('=')) sep = '=';

            if (sep) {
                const parts = trimmed.split(sep);
                const lhs = parts[0].trim();
                if (lhs) {
                    variablesSet.add(lhs);
                    if (!startSymbol) startSymbol = lhs;
                }
            }
        });

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

            let sep = null;
            if (trimmed.includes('->')) sep = '->';
            else if (trimmed.includes('→')) sep = '→';
            else if (trimmed.includes(':')) sep = ':';
            else if (trimmed.includes('=')) sep = '=';

            if (!sep) return;

            const [lhsRaw, rhsRaw] = trimmed.split(sep);
            const lhs = lhsRaw.trim();
            if (!lhs) return;

            const alternatives = rhsRaw.split('|');
            alternatives.forEach(altRaw => {
                let alt = altRaw.trim();
                if (['e', 'ε', 'λ', 'lambda', 'epsilon', '&', '""', "''"].includes(alt.toLowerCase())) {
                    alt = '';
                }
                rules.push({ lhs, rhs: alt, originalRhs: altRaw.trim() });
            });
        });

        const terminalsSet = new Set();
        rules.forEach(r => {
            for (let i = 0; i < r.rhs.length; i++) {
                const char = r.rhs[i];
                if (!variablesSet.has(char) && char !== ' ') {
                    terminalsSet.add(char);
                }
            }
        });

        return {
            variables: Array.from(variablesSet),
            terminals: Array.from(terminalsSet),
            startSymbol: startSymbol || 'S',
            rules
        };
    }

    // Classificador Formal de Gramáticas
    function classifyGrammar(parsed) {
        if (!parsed.rules || parsed.rules.length === 0) {
            return {
                type: 'EMPTY',
                name: 'Vazia',
                badgeClass: 'neutral',
                description: 'Insira regras de produção para classificar a gramática.',
                isRegular: false
            };
        }

        let hasRightLinear = false;
        let hasLeftLinear = false;
        let isUnitary = true;
        const violations = [];

        parsed.rules.forEach(rule => {
            const { lhs, rhs } = rule;

            if (!parsed.variables.includes(lhs) || lhs.length !== 1) {
                violations.push(`O lado esquerdo "${lhs}" deve ser composto por um único não-terminal.`);
            }

            if (rhs === '') return;

            const varsInRhs = [];
            for (let i = 0; i < rhs.length; i++) {
                if (parsed.variables.includes(rhs[i])) {
                    varsInRhs.push({ var: rhs[i], index: i });
                }
            }

            const terminalsCount = rhs.length - varsInRhs.length;
            if (terminalsCount > 1) {
                isUnitary = false;
            }

            if (varsInRhs.length > 1) {
                violations.push(`A regra "${lhs} -> ${rhs}" possui mais de uma variável adjacente, extrapolando a forma linear.`);
                return;
            }

            if (varsInRhs.length === 1) {
                const v = varsInRhs[0];
                if (v.index === rhs.length - 1) {
                    hasRightLinear = true;
                } else if (v.index === 0) {
                    hasLeftLinear = true;
                } else {
                    violations.push(`A regra "${lhs} -> ${rhs}" possui não-terminal no meio dos terminais, violando a linearidade (Gramática Livre de Contexto).`);
                }
            }
        });

        if (violations.length > 0) {
            return {
                type: 'NAO_REGULAR',
                name: 'Não-Regular (Tipo 2 / GLC)',
                badgeClass: 'nao-regular',
                description: `A gramática não é regular. Violações identificadas:<br>• ${violations.join('<br>• ')}`,
                isRegular: false
            };
        }

        if (hasRightLinear && hasLeftLinear) {
            return {
                type: 'NAO_REGULAR',
                name: 'Não-Regular (Linear Mista)',
                badgeClass: 'nao-regular',
                description: 'A gramática mistura produções lineares à direita (A → wB) com produções lineares à esquerda (A → Bw). Uma gramática regular deve ser estritamente pura em uma direção.',
                isRegular: false
            };
        }

        if (hasLeftLinear) {
            if (isUnitary) {
                return {
                    type: 'GRUE',
                    name: 'GRUE (Regular Unitária à Esquerda)',
                    badgeClass: 'grue',
                    description: '<strong>Classificação: GRUE</strong><br>• Variável sempre no início (à esquerda) do lado direito: <code>A → Bw | w</code>.<br>• Extensão unitária satisfeita: <code>|w| ≤ 1</code> (no máximo 1 terminal por produção).<br>• A derivação constrói a palavra <strong>da direita para a esquerda</strong>.',
                    isRegular: true
                };
            } else {
                return {
                    type: 'GRE',
                    name: 'GRE (Linear à Esquerda)',
                    badgeClass: 'gre',
                    description: '<strong>Classificação: GRE</strong><br>• Variável sempre no início (à esquerda) do lado direito: <code>A → Bw | w</code>.<br>• Não-unitária: contém produções com 2 ou mais terminais (<code>|w| ≥ 0</code> livre).',
                    isRegular: true
                };
            }
        }

        if (isUnitary) {
            return {
                type: 'GRUD',
                name: 'GRUD (Regular Unitária à Direita)',
                badgeClass: 'grud',
                description: '<strong>Classificação: GRUD</strong><br>• Variável sempre no final (à direita) do lado direito: <code>A → wB | w</code>.<br>• Extensão unitária satisfeita: <code>|w| ≤ 1</code> (no máximo 1 terminal por produção).<br>• A derivação segue a ordem natural de leitura do autômato (da esquerda para a direita).',
                isRegular: true
            };
        } else {
            return {
                type: 'GRD',
                name: 'GRD (Linear à Direita)',
                badgeClass: 'grd',
                description: '<strong>Classificação: GRD</strong><br>• Variável sempre no final (à direita) do lado direito: <code>A → wB | w</code>.<br>• Não-unitária: contém produções com 2 ou mais terminais (<code>|w| ≥ 0</code> livre).',
                isRegular: true
            };
        }
    }

    // Algoritmo de Derivação e Reconhecimento de Sentença
    function deriveWord(parsed, classification, targetWord) {
        if (!classification.isRegular) {
            return {
                accepted: false,
                reason: 'A gramática não é regular. A simulação suporta formalmente GRD, GRE, GRUD e GRUE.'
            };
        }

        const isLeftLinear = (classification.type === 'GRE' || classification.type === 'GRUE');
        const start = parsed.startSymbol;
        const rules = parsed.rules;
        const maxSteps = 4000;

        if (isLeftLinear) {
            const queue = [{ current: start, path: [start] }];
            const visited = new Set([start]);

            while (queue.length > 0) {
                const { current, path } = queue.shift();

                if (current === targetWord) {
                    return { accepted: true, path };
                }

                let varChar = null;
                let varIdx = -1;
                for (let i = 0; i < current.length; i++) {
                    if (parsed.variables.includes(current[i])) {
                        varChar = current[i];
                        varIdx = i;
                        break;
                    }
                }

                if (varIdx === -1) continue;

                const suffix = current.slice(varIdx + 1);
                if (suffix && !targetWord.endsWith(suffix)) continue;

                for (let r = 0; r < rules.length; r++) {
                    const rule = rules[r];
                    if (rule.lhs === varChar) {
                        const nextStr = current.slice(0, varIdx) + rule.rhs + suffix;

                        if (nextStr.length <= targetWord.length + 2 && !visited.has(nextStr)) {
                            visited.add(nextStr);
                            queue.push({ current: nextStr, path: [...path, nextStr] });

                            if (visited.size > maxSteps) {
                                return { accepted: false, reason: 'Limite de passos excedido na busca.' };
                            }
                        }
                    }
                }
            }

            return { accepted: false };

        } else {
            const queue = [{ current: start, path: [start] }];
            const visited = new Set([start]);

            while (queue.length > 0) {
                const { current, path } = queue.shift();

                if (current === targetWord) {
                    return { accepted: true, path };
                }

                let varChar = null;
                let varIdx = -1;
                for (let i = current.length - 1; i >= 0; i--) {
                    if (parsed.variables.includes(current[i])) {
                        varChar = current[i];
                        varIdx = i;
                        break;
                    }
                }

                if (varIdx === -1) continue;

                const prefix = current.slice(0, varIdx);
                if (prefix && !targetWord.startsWith(prefix)) continue;

                for (let r = 0; r < rules.length; r++) {
                    const rule = rules[r];
                    if (rule.lhs === varChar) {
                        const nextStr = prefix + rule.rhs + current.slice(varIdx + 1);

                        if (nextStr.length <= targetWord.length + 2 && !visited.has(nextStr)) {
                            visited.add(nextStr);
                            queue.push({ current: nextStr, path: [...path, nextStr] });

                            if (visited.size > maxSteps) {
                                return { accepted: false, reason: 'Limite de passos excedido na busca.' };
                            }
                        }
                    }
                }
            }

            return { accepted: false };
        }
    }

    // Processamento e Atualização Visual da Gramática
    function processarGramatica() {
        const text = grammarInput.value;
        const wordRaw = wordInput.value.trim();
        const targetWord = (wordRaw === 'e' || wordRaw === 'ε' || wordRaw === 'λ') ? '' : wordRaw;

        if (!text.trim()) {
            classificationBadge.className = 'badge neutral';
            classificationBadge.textContent = 'Aguardando regras...';
            quartetoV.textContent = '—';
            quartetoT.textContent = '—';
            quartetoS.textContent = '—';
            quartetoP.textContent = '—';
            classificationExplanation.innerHTML = 'Insira as regras de produção acima para classificar automaticamente a gramática.';
            grammarMatchInfoArea.innerHTML = '<p class="match-info-highlight neutral">Aguardando entrada...</p>';
            derivationArea.style.display = 'none';
            return;
        }

        const parsed = parseGrammar(text);
        const classification = classifyGrammar(parsed);

        classificationBadge.className = `badge ${classification.badgeClass}`;
        classificationBadge.textContent = classification.name;

        quartetoV.textContent = `{ ${parsed.variables.join(', ')} }`;
        quartetoT.textContent = parsed.terminals.length > 0 ? `{ ${parsed.terminals.join(', ')} }` : '∅';
        quartetoS.textContent = parsed.startSymbol;
        quartetoP.textContent = `${parsed.rules.length} produção(ões)`;

        classificationExplanation.innerHTML = classification.description;

        if (!classification.isRegular) {
            grammarMatchInfoArea.innerHTML = `
                <p class="match-info-highlight error">A gramática informada não é regular (${classification.name}).</p>
                <p class="match-info-subtext">Revise as produções para enquadrá-la em GRD, GRE, GRUD ou GRUE.</p>
            `;
            derivationArea.style.display = 'none';
            return;
        }

        if (wordInput.value === '') {
            grammarMatchInfoArea.innerHTML = '<p class="match-info-highlight neutral">Digite uma palavra acima para testar e derivar.</p>';
            derivationArea.style.display = 'none';
            return;
        }

        const result = deriveWord(parsed, classification, targetWord);
        const displayWord = targetWord === '' ? 'ε (cadeia vazia)' : `"${targetWord}"`;

        if (result.accepted) {
            grammarMatchInfoArea.innerHTML = `
                <p class="match-info-highlight success">A palavra ${displayWord} pertence à linguagem da gramática!</p>
            `;

            derivationArea.style.display = 'block';
            let stepsHtml = '';
            result.path.forEach((step, idx) => {
                const formattedStep = step === '' ? 'ε' : step;
                if (idx === 0) {
                    stepsHtml += `<div><span class="derivation-step-num">Passo ${idx + 1}:</span><strong>${formattedStep}</strong> <span class="derivation-rule-tag">(Símbolo inicial)</span></div>`;
                } else {
                    stepsHtml += `<div style="margin-top: 4px;"><span class="derivation-step-num">Passo ${idx + 1}:</span><span class="derivation-arrow">⇒</span> <strong>${formattedStep}</strong></div>`;
                }
            });

            const chainSummary = result.path.map(s => s === '' ? 'ε' : s).join(' <span class="derivation-arrow">⇒</span> ');
            derivationSteps.innerHTML = `
                <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #cbd5e0; color: #2c5282;">
                    <strong>Cadeia de Derivação:</strong> ${chainSummary}
                </div>
                ${stepsHtml}
            `;
        } else {
            grammarMatchInfoArea.innerHTML = `
                <p class="match-info-highlight error">A palavra ${displayWord} foi REJEITADA pela gramática.</p>
                <p class="match-info-subtext">Não existe nenhuma sequência válida de derivações para essa sentença.</p>
            `;
            derivationArea.style.display = 'none';
        }
    }

    grammarPresetSelect.addEventListener('change', () => {
        const selected = grammarPresetSelect.value;
        if (selected && PRESETS[selected]) {
            const preset = PRESETS[selected];
            grammarInput.value = preset.text;
            wordInput.value = preset.word;
            processarGramatica();
        }
    });

    grammarInput.addEventListener('input', processarGramatica);
    wordInput.addEventListener('input', processarGramatica);

    if (!grammarInput.value) {
        grammarInput.value = PRESETS.ex_grud_aba.text;
        wordInput.value = PRESETS.ex_grud_aba.word;
    }
});
