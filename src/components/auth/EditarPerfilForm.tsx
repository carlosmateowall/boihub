'use client'

import { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, Camera, User as UserIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { resizeImage } from '@/lib/image'
import type { Profile } from '@/types/database'

interface Props { profile: Profile }

const PROFILE_BUCKET = 'profile-photos'

export function EditarPerfilForm({ profile }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(profile.foto_url)
  const [removerFoto, setRemoverFoto] = useState(false)

  const [fields, setFields] = useState({
    nome: profile.nome,
    fazenda: profile.fazenda ?? '',
    cidade: profile.cidade ?? '',
    estado: profile.estado,
    cabecas: String(profile.cabecas),
    hectares: String(profile.hectares),
    whatsapp: profile.whatsapp ?? '',
  })

  function set(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  function handleSelectFoto(e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Selecione uma imagem (JPG, PNG ou WebP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande (limite 5 MB). Tente uma menor.')
      return
    }
    setFotoFile(file)
    setRemoverFoto(false)
    setFotoPreview(URL.createObjectURL(file))
  }

  function handleRemoverFoto() {
    setFotoFile(null)
    setFotoPreview(null)
    setRemoverFoto(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadAvatar(file: File): Promise<string> {
    const blob = await resizeImage(file, 512, 0.85)
    const path = `${profile.id}/avatar.jpg`
    const { error: upError } = await supabase.storage
      .from(PROFILE_BUCKET)
      .upload(path, blob, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '3600',
      })
    if (upError) throw upError
    const { data } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path)
    // cache-bust para o browser não servir versão anterior
    return `${data.publicUrl}?v=${Date.now()}`
  }

  async function deleteAvatar() {
    const path = `${profile.id}/avatar.jpg`
    await supabase.storage.from(PROFILE_BUCKET).remove([path])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let foto_url = profile.foto_url
      if (fotoFile) {
        foto_url = await uploadAvatar(fotoFile)
      } else if (removerFoto) {
        await deleteAvatar()
        foto_url = null
      }

      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          nome: fields.nome,
          fazenda: fields.fazenda || null,
          cidade: fields.cidade || null,
          estado: fields.estado,
          cabecas: parseInt(fields.cabecas) || 0,
          hectares: parseInt(fields.hectares) || 0,
          whatsapp: fields.whatsapp || null,
          foto_url,
        })
        .eq('id', profile.id)
      if (dbError) throw dbError

      router.push('/perfil')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-canvas rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-canvas-soft flex items-center justify-center border border-ink/10">
          {fotoPreview ? (
            <Image
              src={fotoPreview}
              alt="Foto de perfil"
              width={80}
              height={80}
              className="h-20 w-20 object-cover"
              unoptimized
            />
          ) : (
            <UserIcon className="h-8 w-8 text-mute" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSelectFoto}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" /> {fotoPreview ? 'Trocar foto' : 'Adicionar foto'}
          </Button>
          {fotoPreview && (
            <button
              type="button"
              onClick={handleRemoverFoto}
              className="text-xs text-mute hover:text-negative flex items-center gap-1 w-fit"
            >
              <Trash2 className="h-3 w-3" /> Remover foto
            </button>
          )}
        </div>
      </div>

      <Input label="Nome completo" value={fields.nome} onChange={e => set('nome', e.target.value)} required />
      <Input label="WhatsApp" value={fields.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="(34) 99999-0000" />

      {profile.perfil === 'produtor' && (
        <>
          <Input label="Nome da fazenda" value={fields.fazenda} onChange={e => set('fazenda', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cidade" value={fields.cidade} onChange={e => set('cidade', e.target.value)} />
            <Input label="Estado (sigla)" value={fields.estado} onChange={e => set('estado', e.target.value)} maxLength={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cabeças" type="number" value={fields.cabecas} onChange={e => set('cabecas', e.target.value)} />
            <Input label="Hectares" type="number" value={fields.hectares} onChange={e => set('hectares', e.target.value)} />
          </div>
        </>
      )}

      {profile.perfil !== 'produtor' && (
        <div className="grid grid-cols-2 gap-4">
          <Input label="Cidade" value={fields.cidade} onChange={e => set('cidade', e.target.value)} />
          <Input label="Estado (sigla)" value={fields.estado} onChange={e => set('estado', e.target.value)} maxLength={2} />
        </div>
      )}

      {error && <p className="text-sm text-negative">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" size="md" className="flex-1" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md" className="flex-1" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
