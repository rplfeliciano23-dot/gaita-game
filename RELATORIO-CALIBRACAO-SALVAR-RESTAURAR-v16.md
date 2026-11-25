# Gaita Game 2.0 | Salvamento da calibração v16

## Escopo

O pedido foi adicionar um botão para salvar o conjunto completo da calibração no afinador. O afinador existente e sua lógica de detecção/calibração foram preservados.

## Implementação

- Botão `tSaveCal`: cria uma cópia versionada contendo o tom da gaita (`key`), ajuste geral (`g`), calibrações individuais (`cals`) e data de salvamento.
- A cópia é persistida em `localStorage` sob a chave independente `gaita.calibration.saved.v1`.
- A separação da chave protege a cópia contra o comando do aplicativo que remove somente `localStorage['gaita']` para zerar o progresso geral. O comando “Zerar todas” também zera apenas a calibração ativa, não a cópia de segurança.
- Botão `tRestoreCal`: valida, pede confirmação e restaura o tom, ajuste geral e todas as calibrações individuais da cópia.
- A interface mostra data, tom, quantidade de notas calibradas e indica quando a calibração ativa diverge da última cópia salva.
- O salvamento automático existente da calibração ativa foi mantido. O novo botão cria uma segunda cópia recuperável, não substitui o funcionamento anterior.
- Service worker atualizado para o cache v16.

## Segurança e limites

- A restauração só aceita cópias com identificador e versão reconhecidos, tom suportado e valores numéricos dentro dos limites de calibração.
- A restauração confirma antes de substituir os valores ativos.
- A cópia fica local ao navegador/domínio e não é sincronizada com nuvem. Apagar todos os dados do site/navegador ou o armazenamento do aparelho pode removê-la. Para segurança externa, usar também o backup geral do aplicativo e guardar o código em local seguro.

## Testes executados

- Testes de regressão da sincronização afinador → atividades.
- Testes de sanitização da cópia: formato, tom válido, cents e faixa MIDI.
- Teste de assinatura: alteração da data não indica alteração na calibração; mudança de cents indica.
- Verificação da presença dos controles e da persistência local independente.
- Verificação sintática do JavaScript embutido, `gaita-architecture.js` e `sw.js`.
- Validação do manifesto e integridade do ZIP.

## Limitação

A interação acústica deve continuar sendo confirmada no Android real. O recurso novo de salvar/restaurar utiliza armazenamento local do navegador e pode ser exercitado funcionalmente, mas não foi possível testar a instalação em um aparelho físico nesta execução.
