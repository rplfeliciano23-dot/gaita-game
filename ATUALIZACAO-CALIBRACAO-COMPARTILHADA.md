# Calibração compartilhada entre afinador e atividades

## O que mudou
- A calibração individual é armazenada por posição física da gaita: furo + direção (`S.holeCals`, por exemplo `4d` para o furo 4 aspirado).
- O detector mantém a leitura-base corrigida pelo ajuste geral; o afinador e as atividades aplicam a calibração individual uma única vez no contexto da posição selecionada/alvo.
- Todas as atividades que passam por `matches()` aplicam a correção da posição-alvo antes de avaliar a afinação. Isso cobre exercícios, lições, músicas e modos de prática/ritmo que utilizam essa função.
- A calibração de um furo não altera outra posição, mesmo quando duas posições produzem a mesma nota MIDI.
- As calibrações antigas em `S.cals` (indexadas apenas por MIDI) continuam como fallback para compatibilidade. Até uma calibração específica ser feita, uma entrada legada pode continuar sendo compartilhada por posições com a mesma nota.
- “Zerar esta calibração” remove a posição selecionada e sua entrada legada correspondente; “zerar tudo” limpa as calibrações individuais e gerais.
- A comparação de oitavas é estrita por padrão. A preferência de aceitar outra oitava só é aplicada quando ativada explicitamente.
- O service worker foi atualizado para `gaita-bem-te-vi-v14` para invalidar o cache anterior.

## Como testar no celular
1. Abra o afinador e permita o microfone.
2. Selecione no mapa, por exemplo, furo 1 soprado.
3. Toque essa posição de forma estável e pressione Calibrar.
4. Abra uma atividade que peça exatamente furo 1 soprado.
5. Toque a nota. A atividade deve comparar o som com a afinação corrigida dessa posição.
6. Repita para furo 1 aspirado e para outros furos.

## Limitação importante
O microfone identifica frequência, não consegue distinguir sozinho sopro de aspiração quando ambas as posições produzem frequências iguais ou muito próximas. Nas atividades, a posição esperada (furo/direção) é conhecida pela tablatura, então o ajuste correspondente é aplicado à comparação daquela nota. Ruído, harmônicos fortes, vazamento de ar e microfones com processamento automático ainda podem afetar a detecção e precisam ser testados no aparelho real.

## Validação necessária
- As regras puras de calibração e comparação de oitava têm testes automatizados em `tests/gaita-architecture.test.js`.
- O JavaScript embutido no `index.html` deve passar por `node --check`.
- A validação acústica final continua dependendo de teste com a gaita e o microfone reais, nos 10 furos em sopro e aspiração e em cada atividade.
