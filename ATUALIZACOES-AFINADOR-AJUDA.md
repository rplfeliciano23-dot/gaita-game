# Gaita Game — atualização do afinador e central de ajuda

## Afinador e calibração pelo mapa
- O mapa agora é interativo: cada uma das 20 posições (10 furos soprados e 10 aspirados) pode ser selecionada.
- A seleção mostra furo, direção e nota musical, incluindo oitava.
- A calibração individual usa a nota escolhida pelo aluno como referência, em vez de assumir automaticamente que a nota detectada é a nota desejada.
- O ajuste considera o desvio geral da gaita já configurado e limita a correção individual a ±150 cents, rejeitando medições fora dessa faixa.
- Se o som detectado estiver muito distante da nota escolhida, o aplicativo avisa para conferir o furo e a direção, evitando gravar uma calibração evidentemente errada.
- A opção de zerar uma calibração atua sobre a posição selecionada; zerar todas continua disponível.
- Ao mudar o tom da gaita, o mapa é redesenhado com as notas correspondentes.

## Ajuda e dúvidas em Ajustes
Foi adicionada uma central de ajuda em formato de tópicos expansíveis, explicando:
- Tela inicial, nível, XP e sequência diária.
- Aulas teóricas.
- Aulas práticas, modos Aprender e Ritmo.
- Músicas, tablaturas e importação.
- Funcionamento do afinador e cents.
- Mapa da gaita e calibração individual.
- Permissão e sensibilidade do microfone.
- Bends e tolerância.
- Rotina, progresso e desafios.
- Backup e restauração.
- Tom da gaita e opções de visualização.

## Compatibilidade e publicação
- As mudanças são aditivas e mantêm o formato de armazenamento `S` já utilizado pelo aplicativo.
- O `service worker` foi atualizado para a versão de cache `gaita-bem-te-vi-v14`. O cache agora é isolado por prefixo do Gaita Game, sem apagar caches de outros aplicativos no mesmo domínio.
- O afinador depende da permissão de microfone do navegador e de contexto seguro (HTTPS).

## Testes realizados
- JavaScript embutido no `index.html` validado com `node --check`.
- A validação acústica em diferentes modelos de celular/gaita ainda precisa ser feita no aparelho real, porque depende do microfone, ruído ambiente e resposta das palhetas.

## Correções adicionais da versão 14
- Recalibrar uma mesma nota substitui a medição anterior, em vez de somá-la novamente.
- Nas atividades práticas, a calibração individual procura usar a nota esperada do exercício quando o som detectado está próximo dela, inclusive com diferenças de oitava.
- O filtro de suavização é reiniciado ao iniciar ou encerrar exercícios e ao remover calibrações.
- Datas da sequência diária e da rotina usam o calendário local do dispositivo.
- O backup foi versionado e passou a incluir os dados de rotina, configurações do microfone, preferências e histórico de aprendizagem, mantendo leitura do formato legado.
- Títulos de músicas importadas são escapados antes de entrar no HTML. A importação agora limita arquivos individuais a 20 MB e nomes a 80 caracteres.
- O leitor MIDI valida o cabeçalho, a divisão de tempo e os limites dos blocos antes de interpretar as notas.
- O boletim de progresso exibe as últimas tentativas práticas e teóricas registradas localmente.

## Validação da versão 14
- `node --check` executado no JavaScript embutido do `index.html`, em `gaita-architecture.js` e em `sw.js`.
- `manifest.webmanifest` validado como JSON.
- Leitor MIDI testado com um arquivo MIDI mínimo válido e com cabeçalho inválido.
- Teste de integridade do pacote ZIP executado após a montagem.
- Ainda exige teste em Android real: microfone, calibração acústica, botão voltar do aparelho, reprodução e atualização do PWA instalado.
