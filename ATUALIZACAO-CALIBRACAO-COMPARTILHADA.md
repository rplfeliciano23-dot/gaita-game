# Calibração compartilhada entre afinador e atividades

## O que mudou
- A calibração individual agora é armazenada por posição física da gaita: furo + direção (soprado/aspirado), em `S.holeCals`.
- O afinador continua usando a leitura bruta para calcular a correção, evitando aplicar o ajuste duas vezes.
- Todas as atividades que passam por `matches()` aplicam a correção da posição-alvo antes de avaliar a afinação. Isso cobre exercícios, lições, músicas e modos de prática/ritmo que utilizam essa função.
- A calibração de um furo não altera outra posição, mesmo quando duas posições produzem a mesma nota MIDI.
- As calibrações antigas em `S.cals` continuam sendo consideradas como fallback para manter compatibilidade com dados já salvos.
- “Zerar nota” remove apenas a posição selecionada; “zerar tudo” limpa calibrações individuais e gerais.
- O service worker foi atualizado para `gaita-bem-te-vi-v9` para evitar cache antigo.

## Como testar no celular
1. Abra o afinador e permita o microfone.
2. Selecione no mapa, por exemplo, furo 1 soprado.
3. Toque essa posição de forma estável e pressione Calibrar.
4. Abra uma atividade que peça exatamente furo 1 soprado.
5. Toque a nota. A atividade deve comparar o som com a afinação corrigida dessa posição.
6. Repita para furo 1 aspirado e para outros furos.

## Limitação importante
O microfone identifica frequência, não consegue distinguir sozinho sopro de aspiração quando ambas as posições produzem frequências iguais ou muito próximas. Nas atividades, a posição esperada (furo/direção) é conhecida pela tablatura, então o ajuste correspondente é aplicado à comparação daquela nota. Ruído, harmônicos fortes, vazamento de ar e microfones com processamento automático ainda podem afetar a detecção e precisam ser testados no aparelho real.

## Validação realizada
- JavaScript embutido no `index.html` validado com `node --check`.
- A validação acústica final depende de teste com a gaita e o microfone reais.
