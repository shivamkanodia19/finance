import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db/client'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        coins ( name ),
        committee_outputs ( role, summary )
      `)
      .order('signal_score', { ascending: false })
      .limit(20)

    if (error) throw error

    // Flatten and sort: actionable first, then watch, reject
    const STATUS_ORDER: Record<string, number> = { actionable: 0, watch: 1, reject: 2 }
    const alerts = (data ?? []).map((row: Record<string, unknown>): Record<string, unknown> => {
      const outputs = (row.committee_outputs as Array<{ role: string; summary: string }>) ?? []
      return {
        ...row,
        name: (row.coins as { name: string } | null)?.name ?? '',
        thesisSummary: outputs.find(o => o.role === 'judge')?.summary ?? null,
        mainBearObjection: outputs.find(o => o.role === 'bear')?.summary ?? null,
        committee_outputs: undefined,
        coins: undefined,
      }
    }).sort((a, b) => (STATUS_ORDER[a['status'] as string] ?? 3) - (STATUS_ORDER[b['status'] as string] ?? 3))

    return NextResponse.json(alerts)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
