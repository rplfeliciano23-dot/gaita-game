# Gaita Game | arquitetura e plano de implementação

## Decisões confirmadas
- Objetivo pedagógico: formar gaitistas completos, da primeira nota à percepção musical, improvisação e performance.
- Progressão: híbrida, com trilha comum, diagnóstico de nivelamento e reforço individual.
- Avaliação: exercícios e questionários + microfone + autoavaliação.
- Persistência: nuvem agora; contas tradicionais e sincronização entre aparelhos em fase posterior.

## O que esta entrega prepara
- `gaita-architecture.js`: funções puras versionadas para migração não destrutiva, nivelamento, domínio de competências, revisão espaçada e pré-requisitos.
- `supabase-schema.sql`: tabela de progresso e políticas RLS para que cada identidade anônima só leia/escreva seu próprio progresso.
- `cloud-config.example.js`: modelo de configuração pública do Supabase.
- `index.html`: inclui o módulo pedagógico sem substituir as funções existentes nem alterar o objeto legado `S`.
- `sw.js`: inclui os novos arquivos na estratégia de cache e incrementa a versão.

## Importante sobre a nuvem
O projeto ainda não possui URL/chave Supabase fornecidas. Portanto, a aplicação continua funcionando localmente e não tenta enviar dados para lugar nenhum até a configuração. A nuvem fica preparada, mas não está ativa nesta entrega. Para ativá-la, é necessário criar um projeto Supabase, executar `supabase-schema.sql`, copiar `cloud-config.example.js` para `cloud-config.js` e preencher URL/chave pública. Não use `service_role` no navegador.

A decisão de não criar contas agora será atendida por identidade anônima do Supabase na fase de integração cloud. Mais tarde, essa identidade poderá ser vinculada a e-mail/provedor, preservando o progresso. A sincronização entre dispositivos só será ligada quando o fluxo de vinculação e recuperação de conta estiver implementado e testado.

## Etapas de implementação

### Fase 1 - Fundação segura (incluída nesta entrega)
- Preservar `S`, `localStorage['gaita']`, XP, músicas, importações, afinador, microfone, desafios e diário.
- Adicionar versão de esquema e estrutura `learning` sem apagar campos antigos.
- Introduzir funções isoladas para diagnóstico, competências, desbloqueio e revisão.
- Preparar esquema cloud com RLS.

### Fase 2 - Nivelamento e trilha híbrida
- Mapear cada aula/atividade existente para competência e pré-requisitos.
- Substituir o desbloqueio amplo da Teoria por regras de trilha, mantendo conteúdos já concluídos acessíveis.
- Diagnóstico inicial deve recomendar ponto de entrada, nunca apagar etapas ou recompensas antigas.
- Permitir teste de dispensa por competência, com evidências práticas e teóricas.

### Fase 3 - Avaliação musical
- Registrar tentativas com nota-alvo, frequência detectada, tolerância, duração e tempo esperado.
- Separar avaliação de altura/afinação da avaliação rítmica.
- Não inferir sopro versus aspiração apenas pela frequência.
- Usar autoavaliação para itens que o microfone não consegue observar (postura, tensão, embocadura).
- Validar ruído, microfone indisponível e permissões negadas sem bloquear o curso.

### Fase 4 - Orientador e revisão espaçada
- Gerar recomendações a partir de erros recorrentes e competências ainda não dominadas.
- Programar revisões com intervalos adaptados ao desempenho.
- Exibir motivo da recomendação e permitir dispensar/adiar sem penalidade.

### Fase 5 - Nuvem e identidade
- Ativar Supabase com autenticação anônima e salvamento do snapshot versionado.
- Resolver conflitos de primeira migração com comparação e mesclagem auditável, nunca sobrescrever silenciosamente progresso local.
- Depois, implementar vinculação de conta e sincronização entre aparelhos.

### Fase 6 - Repertório, ouvido e performance
- Trilhas de músicas por dificuldade, prática por trechos, memorização e execução integral.
- Treinos de reconhecimento auditivo, transcrição e improvisação com critérios adequados.
- Certificados por competências demonstradas, sem prometer certificação profissional oficial.

## Critérios de segurança e qualidade
- Backup do progresso antes de qualquer migração.
- Migrações idempotentes e testadas com estados antigos e vazios.
- Não remover nem renomear IDs existentes de aulas, atividades ou músicas sem migração explícita.
- XP e estrelas são recompensas; não são prova isolada de domínio.
- Nenhuma sincronização cloud ativa antes de configurar credenciais e testar RLS.
