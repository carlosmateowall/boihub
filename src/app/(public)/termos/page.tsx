import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso — BoiHub',
  description: 'Termos de Uso da plataforma BoiHub.',
}

export default function TermosPage() {
  return (
    <article className="prose-boihub flex flex-col gap-6 text-ink">
      <header className="flex flex-col gap-2">
        <h1 className="display-md">Termos de Uso</h1>
        <p className="text-sm text-mute">
          Última atualização: 20 de maio de 2026
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">1. Aceitação</h2>
        <p className="body-md">
          Ao criar uma conta ou utilizar a plataforma BoiHub (&quot;BoiHub&quot;,
          &quot;Plataforma&quot;, &quot;nós&quot;), você (&quot;Usuário&quot;)
          declara ter lido, entendido e aceitado integralmente estes Termos de
          Uso, bem como a Política de Privacidade. Caso não concorde, não
          utilize a Plataforma.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">2. Descrição do serviço</h2>
        <p className="body-md">
          A BoiHub é uma plataforma digital de intermediação que conecta
          produtores rurais a veterinários, motoristas de frete de gado,
          revendas e fabricantes de insumos agropecuários. A BoiHub não presta
          diretamente serviços veterinários, de transporte ou de venda de
          produtos: atua exclusivamente como facilitador de comunicação,
          contratação e pagamento entre as partes.
        </p>
        <p className="body-md">
          Eventuais relações comerciais, contratos, prestação de serviço,
          entrega de produto e pós-venda ocorrem diretamente entre Usuário
          contratante e Usuário prestador. A BoiHub não responde por
          obrigações assumidas entre Usuários, salvo no que se refere ao
          processamento de pagamentos contratados pela própria Plataforma.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">3. Cadastro e elegibilidade</h2>
        <p className="body-md">
          Para usar a Plataforma o Usuário deve ter, no mínimo, 18 anos e
          capacidade civil plena. O cadastro exige informações verdadeiras,
          atualizadas e completas. O Usuário é integralmente responsável pelos
          dados informados e pela guarda da senha de acesso.
        </p>
        <p className="body-md">
          Profissionais e empresas (veterinários, motoristas, revendas,
          fabricantes) podem ter seus dados verificados (CRMV, CNH, CNPJ).
          Documentação falsa ou inconsistente é causa de suspensão imediata.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">4. Obrigações do Usuário</h2>
        <p className="body-md">O Usuário se compromete a:</p>
        <ul className="list-disc pl-6 body-md flex flex-col gap-2">
          <li>Utilizar a Plataforma de boa-fé e em conformidade com a lei brasileira;</li>
          <li>Não publicar conteúdo ofensivo, discriminatório, ilegal ou que infrinja direitos de terceiros;</li>
          <li>Não usar a Plataforma para atividades ilegais (lavagem, fraude, evasão fiscal, transporte irregular de animais, etc.);</li>
          <li>Honrar acordos firmados com outros Usuários por meio da Plataforma;</li>
          <li>Manter dados de contato atualizados, especialmente WhatsApp e endereço.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">5. Pagamentos e comissão</h2>
        <p className="body-md">
          Quando o pagamento de um serviço (frete, teleconsulta) ocorre
          dentro da Plataforma, a BoiHub processa o valor por meio de gateway
          (Mercado Pago, PIX, cartão de crédito) e retém uma comissão
          informada antes da contratação (atualmente até 10% sobre o valor
          bruto). O valor líquido é repassado ao prestador na conta de
          recebimento cadastrada.
        </p>
        <p className="body-md">
          Estornos, cancelamentos e reembolsos seguem a política do gateway
          escolhido e as regras de cada modalidade contratada. Disputas
          entre Usuário contratante e prestador devem ser resolvidas
          primariamente entre as partes; a BoiHub pode mediar mas não
          assume obrigação de arbitragem.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">6. Propriedade intelectual</h2>
        <p className="body-md">
          A marca BoiHub, o nome de domínio, logotipo, design,
          ilustrações, código-fonte, textos e demais elementos visuais
          são de propriedade exclusiva da BoiHub. O Usuário recebe
          licença de uso pessoal, intransferível e revogável apenas para
          fins de utilização da Plataforma.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">7. Limitação de responsabilidade</h2>
        <p className="body-md">
          A BoiHub não garante disponibilidade ininterrupta da Plataforma e
          não responde por danos indiretos, lucros cessantes ou
          consequências de decisões tomadas pelo Usuário com base em
          informações apresentadas por outros Usuários. Conselhos
          veterinários e cotações de frete exibidos na Plataforma são
          informativos: não substituem a avaliação presencial nem
          configuram prescrição médica oficial sem documento físico ou
          digital assinado pelo profissional habilitado.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">8. Suspensão e encerramento</h2>
        <p className="body-md">
          A BoiHub pode suspender ou encerrar a conta do Usuário a
          qualquer momento em caso de violação destes Termos, de denúncia
          fundamentada de outro Usuário, ou por exigência legal. O Usuário
          também pode encerrar sua conta a qualquer momento, mediante
          solicitação. Encerrada a conta, os dados pessoais seguem o
          tratamento descrito na Política de Privacidade.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">9. Alterações</h2>
        <p className="body-md">
          Estes Termos podem ser atualizados periodicamente. Mudanças
          relevantes serão comunicadas por e-mail e por aviso no aplicativo
          com, no mínimo, 15 dias de antecedência. O uso continuado da
          Plataforma após a vigência implica aceitação da nova versão.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">10. Lei aplicável e foro</h2>
        <p className="body-md">
          Estes Termos são regidos pelas leis da República Federativa do
          Brasil. Fica eleito o foro da comarca de Brasília, DF, para
          dirimir quaisquer controvérsias decorrentes destes Termos, com
          renúncia a qualquer outro, por mais privilegiado que seja.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">11. Contato</h2>
        <p className="body-md">
          Dúvidas, sugestões ou reclamações: <a className="font-semibold text-ink hover:text-primary" href="mailto:contato@boihub.com.br">contato@boihub.com.br</a>.
        </p>
      </section>
    </article>
  )
}
