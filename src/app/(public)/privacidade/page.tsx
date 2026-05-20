import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — BoiHub',
  description: 'Política de Privacidade e tratamento de dados pessoais da BoiHub, em conformidade com a LGPD.',
}

export default function PrivacidadePage() {
  return (
    <article className="prose-boihub flex flex-col gap-6 text-ink">
      <header className="flex flex-col gap-2">
        <h1 className="display-md">Política de Privacidade</h1>
        <p className="text-sm text-mute">Última atualização: 20 de maio de 2026</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">1. Quem somos</h2>
        <p className="body-md">
          BoiHub é uma plataforma digital de intermediação entre produtores
          rurais e prestadores de serviços do setor pecuário. Esta Política
          descreve como tratamos seus dados pessoais, em conformidade com a
          Lei Geral de Proteção de Dados (Lei nº 13.709/2018, &quot;LGPD&quot;).
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">2. Dados que coletamos</h2>
        <p className="body-md">Coletamos apenas o estritamente necessário:</p>
        <ul className="list-disc pl-6 body-md flex flex-col gap-2">
          <li><strong>Identificação:</strong> nome completo, e-mail, senha (armazenada com hash);</li>
          <li><strong>Contato:</strong> WhatsApp, telefone;</li>
          <li><strong>Profissional:</strong> tipo de perfil (produtor, veterinário, motorista, revenda, fabricante), CRMV ou CNH quando aplicável;</li>
          <li><strong>Localização:</strong> cidade, estado (não usamos GPS contínuo);</li>
          <li><strong>Operacional:</strong> tamanho da propriedade, número de cabeças, fretes e consultas realizadas na Plataforma;</li>
          <li><strong>Foto:</strong> imagem de perfil enviada voluntariamente;</li>
          <li><strong>Pagamento:</strong> chave PIX ou dados bancários para recebimento (no caso de prestadores), tokenizados pelo gateway. Dados de cartão de crédito nunca passam pelos nossos servidores.</li>
          <li><strong>Técnico:</strong> endereço IP, tipo de dispositivo, páginas visitadas, para fins de segurança e analytics.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">3. Para que usamos seus dados</h2>
        <ul className="list-disc pl-6 body-md flex flex-col gap-2">
          <li><strong>Execução do contrato:</strong> permitir cadastro, login, contratação de serviços, cotação de frete, agendamento de consulta, processamento de pagamento;</li>
          <li><strong>Comunicação:</strong> enviar confirmações, lembretes, recuperação de senha, alertas operacionais (não enviamos marketing sem opt-in explícito);</li>
          <li><strong>Conformidade legal:</strong> emissão fiscal, prevenção a fraude, atendimento a ordens judiciais;</li>
          <li><strong>Melhoria do produto:</strong> análise estatística agregada e anonimizada do uso.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">4. Base legal (LGPD)</h2>
        <p className="body-md">
          Tratamos seus dados com base nas seguintes hipóteses do art. 7º
          da LGPD: <strong>execução de contrato</strong> (uso da Plataforma),
          <strong> cumprimento de obrigação legal</strong> (fiscal,
          regulatória), <strong>consentimento</strong> (foto de perfil,
          comunicação de marketing) e <strong>legítimo interesse</strong>{' '}
          (segurança, prevenção a fraude, melhoria do serviço, com
          observância dos seus direitos).
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">5. Compartilhamento</h2>
        <p className="body-md">
          Não vendemos seus dados. Compartilhamos apenas com:
        </p>
        <ul className="list-disc pl-6 body-md flex flex-col gap-2">
          <li><strong>Outros Usuários da Plataforma</strong> envolvidos na transação: nome, foto, cidade, WhatsApp e avaliação ficam visíveis ao prestador ou contratante de uma transação;</li>
          <li><strong>Operadores</strong> contratados (Supabase para banco de dados, Vercel para hospedagem, Mercado Pago para pagamento) sob contrato com cláusulas de proteção de dados;</li>
          <li><strong>Autoridades públicas</strong> em caso de ordem judicial ou requisição legal fundamentada.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">6. Onde seus dados ficam</h2>
        <p className="body-md">
          Os dados são armazenados em servidores do Supabase (banco de
          dados PostgreSQL) e Vercel (aplicação), com infraestrutura nos
          Estados Unidos. A transferência internacional é necessária para
          execução do contrato e ocorre sob cláusulas contratuais
          adequadas, conforme art. 33 da LGPD.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">7. Por quanto tempo guardamos</h2>
        <ul className="list-disc pl-6 body-md flex flex-col gap-2">
          <li><strong>Conta ativa:</strong> enquanto o cadastro estiver vigente;</li>
          <li><strong>Após encerramento da conta:</strong> dados pessoais identificáveis são apagados ou anonimizados em até 90 dias, salvo quando a retenção for obrigatória por lei (fiscal: 5 anos, prevenção a fraude: prazos legais aplicáveis);</li>
          <li><strong>Registros de pagamento:</strong> 5 anos a partir da transação, conforme legislação fiscal.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">8. Seus direitos (art. 18 da LGPD)</h2>
        <p className="body-md">Você pode, a qualquer momento, solicitar:</p>
        <ul className="list-disc pl-6 body-md flex flex-col gap-2">
          <li>Confirmação da existência de tratamento;</li>
          <li>Acesso aos seus dados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Portabilidade para outro fornecedor (sob requisição);</li>
          <li>Eliminação dos dados tratados com consentimento;</li>
          <li>Informação sobre compartilhamento;</li>
          <li>Revogação do consentimento.</li>
        </ul>
        <p className="body-md">
          Para exercer qualquer direito, envie um e-mail a{' '}
          <a className="font-semibold text-ink hover:text-primary" href="mailto:privacidade@boihub.com.br">privacidade@boihub.com.br</a>.
          Respondemos em até 15 dias.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">9. Segurança</h2>
        <p className="body-md">
          Adotamos medidas técnicas e administrativas para proteger seus
          dados: criptografia em trânsito (TLS), senha armazenada com
          hash, controle de acesso por Row Level Security no banco,
          logs de auditoria. Em caso de incidente de segurança que possa
          gerar risco aos titulares, comunicaremos a Autoridade Nacional
          de Proteção de Dados (ANPD) e os titulares afetados, na forma da lei.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">10. Cookies</h2>
        <p className="body-md">
          Usamos cookies essenciais (sessão de login) e cookies de
          analytics agregado (Vercel Analytics) para entender o uso da
          Plataforma. Não usamos cookies publicitários de terceiros nem
          tracking cross-site.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">11. Encarregado de dados (DPO)</h2>
        <p className="body-md">
          Carlos Mateo Wall Bruno é o Encarregado de Proteção de Dados da
          BoiHub. Contato:{' '}
          <a className="font-semibold text-ink hover:text-primary" href="mailto:privacidade@boihub.com.br">privacidade@boihub.com.br</a>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="display-xs">12. Alterações</h2>
        <p className="body-md">
          Esta Política pode ser atualizada. Mudanças relevantes serão
          comunicadas por e-mail e por aviso no aplicativo com 15 dias de
          antecedência. A versão vigente está sempre disponível em{' '}
          <span className="font-mono text-sm">boihub.com.br/privacidade</span>.
        </p>
      </section>
    </article>
  )
}
