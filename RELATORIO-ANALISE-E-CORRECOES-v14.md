# Gaita Game 2.0 | Relatório de análise e correções v14

## Base analisada

A base principal utilizada foi o pacote mais recente disponível na conversa: `Gaita-Game-2.0-Bem-te-vi-interativo-v13.zip`, acompanhado dos arquivos de ajuda do afinador e da arquitetura. O ZIP original passou na verificação de integridade antes da edição.

O projeto recebido é um **PWA (aplicativo web instalável)** com `index.html`, `manifest.webmanifest` e service worker. Não há estrutura de projeto Android nativo/Gradle no pacote recebido. Portanto, esta entrega atualiza o PWA publicado; não é um APK.

## Problemas encontrados e mudanças aplicadas

### 1. Calibração individual

**Problema encontrado:** a calibração guardava a medição somando-a ao valor anterior. Como a leitura usada para calibrar já vinha do sinal bruto, repetir a calibração podia acumular o mesmo desvio mais de uma vez.

**Mudança aplicada:** a nova medição substitui o valor anterior da nota selecionada. Ao iniciar ou encerrar exercícios e ao remover calibrações, os filtros de suavização são reiniciados para evitar reaproveitar amostras antigas.

### 2. Aplicação da calibração nas atividades

**Problema encontrado:** a leitura durante a prática identificava a chave de calibração principalmente arredondando a frequência detectada. Quando a nota estava muito desafinada, podia arredondar para o semitom vizinho e não localizar a calibração da nota que o exercício esperava.

**Mudança aplicada:** foi adicionada uma seleção de chave que considera a nota esperada do exercício quando a leitura está suficientemente próxima dela, inclusive quando há diferença de oitava. Fora dessa correspondência, o detector mantém o comportamento de arredondamento como alternativa.

**Ainda precisa de teste real:** a eficácia depende da frequência captada pelo microfone e deve ser conferida com a gaita real, especialmente nos furos que já apresentaram erro.

### 3. Botão voltar e histórico

**Problema encontrado:** o evento `popstate` tratava estados de troca de abas, mas não resolvia explicitamente o retorno ao estado raiz. Isso podia deixar a navegação sem uma regra clara para voltar à tela inicial.

**Mudança aplicada:** o histórico agora trata abas, telas sobrepostas e retorno ao estado raiz, direcionando a navegação para Início quando o histórico do aplicativo chega à raiz.

**Ainda precisa de teste real:** validar com o botão físico/gesto Voltar do Android e com a navegação por abas no navegador usado para instalar o PWA.

### 4. Backup e restauração

**Problema encontrado:** a exportação anterior incluía apenas uma parte do estado do aplicativo. Dados como rotina diária e algumas preferências/configurações podiam ficar de fora.

**Mudança aplicada:** o backup agora tem identificação e versão (`gaita-game`, versão 2) e inclui todos os campos persistentes identificados no código atual, entre eles progresso, rotina, configurações de áudio/microfone, calibração, músicas importadas, favoritos, histórico e tentativas de aprendizagem. A restauração continua aceitando o formato legado anterior, aplica uma lista permitida de campos e sincroniza os controles da interface.

**Recomendação:** gerar um backup no aparelho antes de atualizar ou testar restauração.

### 5. Importação de músicas e nomes

**Problemas encontrados:** títulos importados eram inseridos diretamente em HTML em algumas telas. Além disso, a importação não tinha um limite explícito de tamanho por arquivo e nomes longos ou com caracteres de marcação podiam prejudicar a interface.

**Mudanças aplicadas:** títulos de músicas são escapados ao serem inseridos no HTML; os nomes importados são normalizados e limitados a 80 caracteres; arquivos individuais acima de 20 MB são recusados; o código valida a existência de dados antes de tentar interpretar o arquivo.

### 6. Leitor MIDI

**Problema encontrado:** a leitura do arquivo precisava validar com mais rigor o cabeçalho, a divisão de tempo, o número de trilhas e o limite de bytes dos eventos.

**Mudança aplicada:** o leitor valida cabeçalho `MThd`, tamanho do cabeçalho, formato, PPQ, quantidade de trilhas, limites dos blocos `MTrk` e tamanho máximo da codificação VLQ antes de interpretar eventos.

### 7. Datas, sequência e rotina

**Problema encontrado:** parte da sequência diária usava `toISOString()`, que calcula a data em UTC. No fuso brasileiro, isso pode virar o dia antes da meia-noite local e afetar sequência e rotina.

**Mudança aplicada:** o cálculo da data diária usa ano, mês e dia locais do aparelho, tanto para atividades práticas quanto para aulas teóricas e rotina.

### 8. Histórico pedagógico

**Problema encontrado:** o módulo `gaita-architecture.js` já possuía funções de migração e registro de tentativas, mas o fluxo das atividades ainda não gravava cada tentativa no histórico.

**Mudança aplicada:** atividades práticas, músicas e exercícios concluídos registram tentativas; aulas teóricas e revisões rápidas também passam a registrar resultado. O boletim apresenta as últimas oito tentativas. O histórico permanece local no dispositivo.

### 9. Áudio e microfone

**Mudanças aplicadas:** a decodificação de áudio fecha o `AudioContext` mesmo quando ocorre falha; os filtros do detector são limpos quando a prática termina ou quando a página é fechada; as faixas do microfone são encerradas no evento `pagehide`.

**Limitação já existente:** o projeto usa nove gravações-âncora de gaita Hohner Special 20 da biblioteca VCSL, identificadas no código como CC0, e transpõe essas amostras para outras alturas. Não são 20 gravações independentes correspondentes a cada posição soprada/aspirada. As gravações são carregadas de um endereço externo, então a primeira carga desses samples depende de conexão. A síntese de compatibilidade existente permanece disponível.

### 10. Service worker e cache

**Problema encontrado:** o service worker anterior podia excluir caches de outros aplicativos hospedados no mesmo domínio e devolver a página principal como fallback para qualquer recurso ausente.

**Mudança aplicada:** o cache usa prefixo exclusivo do Gaita Game; a ativação só remove versões antigas desse mesmo prefixo; a lista de arquivos do aplicativo é explícita; recursos ausentes offline retornam 503 e somente navegações recebem fallback para `index.html`.

### 11. Mascote e identidade visual

As imagens existentes do Bem-te-vi no pacote v13 foram mantidas sem alterações. A inspeção visual dos arquivos confirmou a faixa branca da testa completa na pose de repouso e na pose tocando, além da gaita junto ao personagem conforme a orientação definida. Não foi necessário redesenhar nem substituir os arquivos do mascote nesta atualização.

## O que já existe no projeto e foi preservado

- Afinador com mapa das 20 posições, ajustes gerais e individuais.
- Aulas teóricas e exercícios práticos.
- Formação organizada em diagnóstico e oito etapas.
- Sistema de músicas originais e importadas.
- Favoritos, histórico recente e exclusão de músicas importadas.
- Meta diária, rotina de estudo, XP, sequência e desafios.
- Boletim de progresso e avaliação de habilidades.
- Bem-te-vi com poses e reações interativas.
- Samples-âncora e mecanismo de síntese de compatibilidade.
- Backup/restauração e funcionamento local.

## O que não está concluído ou não pode ser ativado só com os arquivos atuais

1. **Sincronização em nuvem:** `cloud-config.example.js` contém apenas valores fictícios de exemplo. Não há credenciais reais, políticas de segurança ou conexão ativa com Supabase. Não inventei chaves nem habilitei uma integração insegura.
2. **Comunidade e ranking online:** não foi encontrada implementação de backend/autenticação para usuários e classificação entre aparelhos. Isso exige serviço remoto, regras de privacidade e infraestrutura.
3. **Professor de IA conectado:** não há integração de API/servidor de IA no pacote recebido. A experiência de ensino local existente foi preservada, mas não foi apresentada como professor de IA.
4. **Gravações completas de todas as posições:** a biblioteca atual possui amostras-âncora transpostas, não takes únicos para todas as posições. A ampliação exige gravações adequadas e verificação de licença/atribuição.
5. **Empacotamento APK:** não há projeto Android nativo no pacote. Para um APK separado, será necessário criar ou fornecer a configuração nativa (por exemplo, Capacitor/Android Studio), testar permissões e gerar uma assinatura.

## Testes executados nesta entrega

- Integridade do ZIP original antes da extração.
- `node --check` no JavaScript embutido em `index.html`.
- `node --check` em `gaita-architecture.js`.
- `node --check` em `sw.js`.
- Validação de `manifest.webmanifest` como JSON.
- Teste funcional isolado de `gaita-architecture.js`: migração, registro de tentativa e avaliação de ponto de partida.
- Teste do leitor MIDI com um arquivo mínimo válido (nota MIDI 60, duração de 1 tempo/segundo a 120 BPM) e rejeição de cabeçalho inválido.
- Análise estática dos IDs HTML referenciados pelo JavaScript; os IDs não encontrados no HTML estático são elementos criados dinamicamente durante a execução.
- Conferência dos arquivos locais referenciados pelo HTML.

## Validação ainda necessária no aparelho Android

A sessão de trabalho não conseguiu concluir uma execução visual confiável no Chromium headless e não teve acesso ao microfone físico. Por isso, **não estou declarando que os testes de Android foram aprovados**. Após publicar este pacote, verificar no aparelho:

1. Instalar/atualizar o PWA e confirmar que a versão v14 carregou.
2. Testar o botão Voltar do Android a partir de cada aba e de cada tela sobreposta.
3. Calibrar uma nota, recalibrá-la e confirmar que o valor não acumula.
4. Repetir a nota calibrada em uma atividade prática, incluindo o furo 4 aspirado e as demais posições problemáticas.
5. Testar microfone, ruído ambiente, notas longas, sopro e aspiração.
6. Exportar um backup, restaurá-lo e conferir rotina, calibração, favoritos, músicas e progresso.
7. Importar um MIDI e um áudio compatível, renomear/testar/excluir a música e verificar o histórico.
8. Fechar o aplicativo e abrir novamente para verificar persistência.

## Conclusão

A versão 14 é uma atualização de correção e estabilidade sobre o pacote v13, com melhorias de calibração, navegação, backup, importação, datas, acompanhamento de tentativas e cache. Ela não substitui a validação acústica em Android real nem implementa serviços online para os quais ainda faltam infraestrutura e credenciais.
