# Gaita Game 2.0 - estado honesto das funcionalidades

## Incluído no pacote
- Interface PWA, identidade visual e mascote Bem-te-vi.
- Navegação por abas e tratamento de voltar via histórico.
- Aulas, exercícios, músicas e demonstrações.
- Importação de músicas e remoção de músicas importadas com confirmação.
- Favoritos, filtro de favoritas, recentes e backup/restauração dos dados compatíveis.
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


## Áudio de demonstração com samples reais (em integração)
- Motor preparado para carregar notas-âncora da gaita Hohner Special 20 em Dó, da biblioteca VCSL (CC0), diretamente do repositório público.
- A demonstração tenta usar gravações reais transpostas para a altura de cada nota; se a rede, CORS ou o arquivo falhar, usa o sintetizador anterior como fallback.
- As gravações disponíveis não são 20 takes separados por furo e direção. Sopro/aspiração continuam indicados na tablatura, mas compartilham as notas-âncora disponíveis.
- Ainda depende de conexão para baixar os samples na primeira utilização. Não declarar áudio real offline ou samples incorporados no pacote.
- Não validado em aparelho Android/WebView real nesta etapa.
