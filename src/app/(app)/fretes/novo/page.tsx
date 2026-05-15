import { FreteForm } from '@/components/fretes/FreteForm'

export const metadata = { title: 'Solicitar frete — BoiHub' }

export default function NovoFretePage() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="display-sm text-ink">Solicitar frete</h1>
        <p className="body-md text-mute mt-1">Preencha os dados do transporte</p>
      </div>
      <FreteForm />
    </div>
  )
}
