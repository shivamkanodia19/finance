import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db/client'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { data: alert, error } = await supabase
      .from('alerts')
      .select(`*, coins ( name, category, tier )`)
      .eq('id', id)
      .single()

    if (error || !alert) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { data: verdicts } = await supabase
      .from('committee_outputs')
      .select('role, verdict, summary')
      .eq('alert_id', id)
      .order('id', { ascending: true })

    const flatAlert = {
      ...alert,
      name: (alert.coins as { name: string; category: string; tier: string } | null)?.name ?? '',
      category: (alert.coins as { name: string; category: string; tier: string } | null)?.category ?? '',
      tier: (alert.coins as { name: string; category: string; tier: string } | null)?.tier ?? '',
      coins: undefined,
      verdicts: verdicts ?? [],
    }

    return NextResponse.json(flatAlert)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
