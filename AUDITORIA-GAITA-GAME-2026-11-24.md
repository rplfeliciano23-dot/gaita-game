# Auditoria do Gaita Game 2.0

**Data:** 2026-11-24  
**Escopo:** arquivos versionados na raiz do repositório, com foco no PWA executado por `index.html`. Esta auditoria foi registrada antes de alterações no aplicativo.

## Resumo executivo

O repositório contém um aplicativo web de página única (HTML, CSS e JavaScript) distribuído como PWA. Há recursos substanciais já implementados: aulas, exercícios, biblioteca musical, importação, favoritos, recentes, afinador com microfone, preferências locais, backup/restauração, mascote, service worker e uma estrutura pedagógica inicial.

O repositório **não contém um projeto Android nativo** (Gradle, `AndroidManifest.xml`, Capacitor ou equivalente), testes automatizados, dependências de desenvolvimento ou configuração de CI. Portanto, a existência de uma interface PWA não comprova instalação, permissões, desempenho ou funcionamento em Android/WebView real.

As prioridades encontradas são: tornar a calibração realmente específica por posição física; corrigir a volta pelo histórico do Android; preservar no backup as configurações usadas no aprendizado; e validar em dispositivo real o detector acústico, importação e arte.

## Arquitetura e tecnologia identificadas

- `index.html`: interface, dados de aulas/músicas, navegação, lógica de exercícios, afinador, persistência e importação em um arquivo monolítico.
- `gaita-architecture.js`: funções pedagógicas aditivas; ainda não integradas à progressão principal.
- `sw.js` e `manifest.webmanifest`: instalação/cache de PWA.
- Persistência local em `localStorage['gaita']`; sem serviço de nuvem ativo.
- Microfone e áudio por Web Audio API; detector de frequência implementado no próprio HTML.
- Samples de demonstração são baixados de um repositório externo e transpostos; há síntese como fallback. Não são 20 gravações independentes por furo/direção.
- Configuração e esquema Supabase são exemplos/documentação, não integração executável.

## Funcionalidades já presentes

- Cinco abas principais e telas para prática, teoria, afinador, etapas, rotina e progresso.
- Exercícios de sopro, aspiração, melodias, ritmo, bends e modos de ouvido.
- Afinador com mapa de 20 posições, microfone, ajuste geral e calibração individual armazenada.
- Biblioteca original; importação MIDI/áudio; exclusão confirmada de importadas; favoritos; recentes limitados a 20 itens.
- XP, estrelas, sequência, etapas, rotina e autoavaliação.
- Backup codificado, restauração, mascote animado com orientações/contexto parcial e cache PWA.
- Imagens de mascote com canal alfa e versões de repouso/tocando incluídas.

## Achados e defeitos

### Prioridade crítica

1. **Calibração não é por furo/direção** (`index.html`, `detectF`, `selectTunerNote`, botões de calibração). O estado efetivo usa `S.cals[MIDI]`, apesar de `ATUALIZACAO-CALIBRACAO-COMPARTILHADA.md` afirmar que usa `S.holeCals` por posição. Posições que compartilham a mesma nota MIDI compartilham a correção; a tela e as atividades não podem manter calibrações independentes. As atividades recebem correção por meio do detector comum, mas a chave é frequência/nota arredondada, não a posição-alvo. Deve-se migrar os dados de forma compatível e confirmar o furo aspirado 4 em gaita real.
2. **Oitava permissiva por padrão** (`index.html`, inicialização de `S.oct` e `matches`). Quando ainda não há preferência salva, `S.oct !== false` é verdadeiro e a atividade aceita a mesma classe de nota em qualquer oitava. Isso pode marcar uma oitava incorreta como certa.
3. **Voltar até a raiz deixa a aba visual incorreta** (`index.html`, listener `popstate`). A tela é sincronizada apenas quando o estado retornado é uma aba; ao voltar ao estado `root`, a aba atual não é restaurada para Início. `tabTrail`/`navBusy` são declarados, mas não participam da solução.
4. **Falhas de persistência são silenciosas** (`index.html`, `save` e leitura inicial de localStorage). Se o armazenamento falhar/estiver cheio, a interface não avisa que os dados não foram gravados.

### Prioridade alta

5. **Backup incompleto** (`index.html`, `bkOut`/`bkIn`). O arquivo exportado inclui calibrações `cals` e ajuste geral `g`, mas não inclui várias preferências: sensibilidade, tolerância, preferência de oitava, meta diária, efeitos, visualização e dados de rotina/tempo. A restauração aplica o objeto sem confirmação e não sincroniza todos os controles da interface.
6. **Importação de áudio potencialmente pesada** (`index.html`, `parseAudio`). A análise de áudio é feita em JavaScript no thread principal, com correlações repetidas em janelas por até 90 segundos. Pode congelar ou consumir muita CPU em celulares modestos. MP3/WAV/M4A/OGG constam no seletor, mas não há testes por formato.
7. **Registros órfãos na exclusão/importação** (`index.html`, lista de músicas). Ao excluir uma importada, favoritos e recentes são removidos, mas resultados em `S.best` podem permanecer. Títulos coincidentes entre música importada e original compartilham a chave de favorito/progresso.
8. **Conteúdo sem proteção contra nomes de arquivo** (`index.html`, renderização da biblioteca). O nome do arquivo importado é inserido em `innerHTML`; títulos fornecidos pelo usuário devem ser renderizados como texto, não interpretados como HTML.
9. **Ativo de fundo com extensão incompatível**. `fundo-natureza.webp` é identificado como JPEG, apesar da extensão `.webp`; a compatibilidade depende do servidor/navegador e precisa ser corrigida ou comprovada.

### Funcionalidades parciais ou não ativadas

- **Áudio real:** há poucas notas-âncora remotas com transposição e fallback sintetizado. Não cobre 20 posições/técnicas como gravações autênticas e depende de rede na primeira execução. A origem/licença está mencionada em comentário, mas não há inventário de arquivos, atribuição completa ou cópias incorporadas.
- **Mascote:** há animação e mensagens de incentivo/feedback em regras locais; não é um professor adaptativo. A validação de recorte/arte no Android não foi feita. Há um segundo HTML (`Gaita-Game-afinador-calibracao-ajustada.html`) divergente do `index.html`, criando risco de publicar o arquivo errado.
- **Aprendizagem/professor:** conteúdo e progressão estão presentes, porém o módulo `gaita-architecture.js` não dirige a trilha. Parte da conclusão das etapas depende de autoavaliação; não há acompanhamento avançado validado de competências.
- **Nuvem, autenticação, recuperação e sincronização:** inexistentes em execução. Supabase está apenas preparado por exemplo/esquema.
- **Comunidade e ranking:** não implementados; requerem backend, autenticação, moderação, proteção contra fraude e políticas de privacidade.
- **Distribuição Android:** PWA é o único alvo encontrado; não há pacote Android de instalação/build nesta árvore.

## Validações executadas antes das correções

- `node --check` no JavaScript embutido de `index.html`: passou.
- `node --check gaita-architecture.js`: passou.
- JSON de `manifest.webmanifest`: válido.
- Inventário confirmou ausência de manifests Android, pacote de testes e configuração de build.
- Os arquivos de mascote foram identificados como PNG RGBA. Isso confirma transparência presente, mas não valida recorte/contraste em dispositivos Android.
- Nenhum teste com microfone/gaita reais, Android físico, backup/restauração interativos ou formatos de áudio foi possível neste ambiente.

## Plano de correção seguro

1. Migrar calibrações legadas por MIDI para a posição física, sem descartar dados.
2. Usar a posição esperada da atividade ao avaliar correção individual; manter ajuste geral e compatibilidade de backup.
3. Fazer o estado de navegação restaurar corretamente todas as abas, inclusive a raiz.
4. Tornar a comparação de oitava estrita por padrão, preservando a preferência explícita já armazenada.
5. Completar e validar backup/restauração de preferências sem sobrescrever dados silenciosamente.
6. Tratar títulos importados como texto, sanear exclusão e corrigir a extensão/conteúdo do fundo.
7. Adicionar testes reproduzíveis para as regras puras. A validação acústica e Android continuará marcada como pendente até haver hardware e um pacote/dispositivo acessíveis.

## Itens que permanecem pendentes após correções locais

Teste físico dos 10 furos soprados/aspirados, em particular 4 aspirado, intensidade e ruído; validação de permissões e lifecycle no Android; importação e reprodução em dispositivos; validação visual do mascote no Android; gravações licenciadas suficientes e registro de proveniência; backend real para cloud/ranking; e decisões de publicação/assinatura de APK. Nenhum desses itens pode ser declarado concluído por uma verificação estática ou sintética.

## Correções aplicadas após o registro inicial

- Calibrações novas usam `holeCals` por posição; atividades com posição-alvo e afinador selecionado usam esse ajuste. Os valores antigos `cals` por MIDI continuam preservados como fallback para não descartar configuração legada.
- A correspondência de oitava é estrita por padrão. A preferência antiga explícita `oct: true` continua respeitada.
- O listener de histórico restaura Início ao retornar ao estado raiz.
- Backup passou a incluir o estado completo, aceita o formato antigo, valida o formato básico, pede confirmação e atualiza os controles de preferências após a restauração. O salvamento informa falhas em vez de aparentar sucesso.
- Títulos importados e anotações são escapados na renderização; novos nomes de importação coincidentes com a biblioteca original recebem o sufixo “(importada)”. A exclusão limpa progresso órfão sem remover dados da música original.
- O JPEG do bosque foi renomeado para `fundo-natureza.jpg`, com referências atualizadas; o cache foi elevado para v14.
- Foram adicionados testes das regras de calibração, compatibilidade legada, migração e comparação de oitavas em `tests/gaita-architecture.test.js`.

## Verificação após correções

- 4 testes automatizados passaram.
- JavaScript embutido, `gaita-architecture.js` e `sw.js` passaram por verificação sintática; `manifest.webmanifest` passou por parse JSON.
- Verificação estática confirmou 148 IDs estáticos únicos e todos os caminhos locais do HTML, CSS e cache do service worker existentes.
- `git diff --check` passou.
- Os testes cobrem regras de decisão; não simulam áudio físico, microfone, interação visual ou Android. As pendências de hardware listadas acima permanecem abertas.
