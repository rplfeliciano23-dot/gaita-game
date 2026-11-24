# Gaita Game 2.0 - estado honesto das funcionalidades

## Incluído no pacote
- Interface PWA, identidade visual e mascote Bem-te-vi.
- Navegação por abas e telas modais com histórico; retorno ao estado raiz agora aponta para Início (ainda falta validação em Android real).
- Aulas, exercícios, músicas e demonstrações.
- Importação de músicas e remoção de músicas importadas com confirmação.
- Favoritos, filtro de favoritas, recentes (limite 20) e backup/restauração do estado e configurações locais.
- Afinador com microfone, mapa de 20 posições (10 sopros e 10 aspirações), calibração individual e ajuda.
- Progresso/XP, rotina e desafios já presentes na aplicação.
- Fundação JavaScript para estrutura pedagógica versionada e migração não destrutiva.

## Preparado, mas não ativado
- Esquema SQL e configuração exemplo para Supabase. Não há projeto/credenciais configurados, nem sincronização ativa.
- Evolução para trilha adaptativa completa e domínio de competências precisa mapear cada aula e registrar evidências reais.

## Ainda depende de recursos externos ou desenvolvimento adicional
- Timbre de gaita autêntico: faltam gravações reais/licenciadas por nota e direção.
- Sincronização multiaparelho e contas: dependem de backend e autenticação configurados.
- Comunidade, ranking online e painel administrativo: dependem de backend, moderação e políticas de privacidade.
- Avaliação inteligente avançada: requer algoritmos e validação com gravações reais de diferentes gaitas/microfones.
- Treinamento auditivo avançado e comparação de gravações: precisam de fluxos dedicados e critérios pedagógicos.

A interface não deve apresentar como concluído nenhum item que esteja apenas preparado ou documentado.

## Limitações de plataforma e validação
- Este repositório entrega um PWA; não contém projeto Android nativo, APK, configuração Gradle ou testes de WebView.
- Nenhum teste com gaita/microfone reais nem em telefone Android foi executado neste ambiente.
- A calibração agora possui chave por furo/direção para novas correções. Dados antigos indexados por MIDI são preservados como fallback até uma calibração específica substituir a entrada para aquela posição.
- A comparação de oitavas é estrita por padrão; a opção permissiva exige ativação explícita.
- Backup foi ampliado para incluir o estado completo e a restauração exige confirmação; formatos antigos continuam aceitos.


## Áudio de demonstração com samples reais (em integração)
- Motor preparado para carregar notas-âncora da gaita Hohner Special 20 em Dó, da biblioteca VCSL (CC0), diretamente do repositório público.
- A demonstração tenta usar gravações reais transpostas para a altura de cada nota; se a rede, CORS ou o arquivo falhar, usa o sintetizador anterior como fallback.
- As gravações disponíveis não são 20 takes separados por furo e direção. Sopro/aspiração continuam indicados na tablatura, mas compartilham as notas-âncora disponíveis.
- Ainda depende de conexão para baixar os samples na primeira utilização. Não declarar áudio real offline ou samples incorporados no pacote.
- Não validado em aparelho Android/WebView real nesta etapa.


## Atualização visual: plano de fundo natureza
- Fundo ilustrado de bosque ensolarado aplicado à interface principal e às telas de prática.
- Cartões com superfície translúcida e desfoque discreto, preservando contraste e legibilidade.
- Cabeçalho e navegação inferior harmonizados em tons de verde-floresta.
- Tema escuro recebe sobreposição mais escura.
- Asset local `fundo-natureza.jpg` identificado pelo formato JPEG e incluído no cache do service worker v14.
- JavaScript e referências locais verificados estaticamente; aparência e desempenho ainda precisam de validação no Android real.

## Atualização visual
- Regulagem da intensidade do plano de fundo (0% a 100%), salva localmente e incluída no backup; padrão 70%.
- Imagem de fundo do bosque incluída localmente em `fundo-natureza.jpg` (não depende de URL externa).
