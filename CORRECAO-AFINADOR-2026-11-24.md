# Gaita Game 2.0 — correção inicial do mapa do afinador

## O que foi corrigido

- O afinador não escolhe mais silenciosamente o primeiro furo quando uma mesma altura musical existe em mais de uma posição da gaita.
- Quando a nota pode corresponder a mais de uma posição natural, o afinador informa todas as posições possíveis.
- Se o aluno selecionou uma posição no mapa e a nota detectada corresponde à nota dessa posição, o afinador usa a seleção explícita para contextualizar o resultado.
- Notas naturais têm prioridade sobre candidatos de bend. Isso evita rotular uma nota natural como bend de outro furo quando as alturas coincidem.

## O que não pode ser concluído apenas pelo código

A frequência, isoladamente, não revela qual furo foi tocado nem se o ar foi soprado ou aspirado quando duas posições produzem a mesma nota. Para distinguir essas posições sem seleção prévia, seria necessário analisar outros sinais acústicos e validar o algoritmo com gravações reais.

Esta entrega não declara resolvidos os desvios de frequência relatados nos furos aspirados. A detecção atual foi mantida para não trocar um algoritmo sem validação por outro potencialmente pior. É necessário testar no aparelho real, com a gaita do usuário, e comparar a frequência em Hz com um afinador de referência.

## Validação executada

- Extração do JavaScript embutido no `index.html`.
- Verificação sintática com `node --check` concluída sem erros.
- Não foi possível validar a captação acústica neste ambiente, pois ela depende do microfone, da gaita e do navegador no aparelho real.

## Instalação

1. Faça backup da versão atualmente publicada.
2. Extraia o pacote e substitua o `index.html` pela versão incluída.
3. Mantenha os demais arquivos e recursos do projeto como estão.
4. Publique no mesmo local do PWA e recarregue o aplicativo.
5. Teste primeiro notas naturais compartilhadas e depois os furos aspirados que apresentaram divergência.

Não apague os dados locais nem restaure backup para aplicar esta correção.
