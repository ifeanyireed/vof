function parseJsonField<T>(field: any, defaultValue: T): T {
  if (field === null || field === undefined) return defaultValue;
  if (typeof field === 'object') return field as T;
  if (typeof field === 'string' && field.trim()) {
    try {
      return JSON.parse(field) as T;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

export function mapOutreachRow(row: any) {
  return {
    id: row.id,
    slug: row.slug || '',
    title: row.title || '',
    theme: row.theme || '',
    eventDate: row.event_date || '',
    year: Number(row.year) || new Date().getFullYear(),
    venue: row.venue || '',
    location: row.location || '',
    category: row.category || 'Community Relief',
    summary: row.summary || '',
    objectives: parseJsonField<string[]>(row.objectives, []),
    keyActivities: parseJsonField<string[]>(row.key_activities, []),
    complianceAndObservations: parseJsonField<string[]>(row.compliance_observations, []),
    nextSteps: parseJsonField<string[]>(row.next_steps, []),
    impactMetrics: parseJsonField<{ label: string; count: string }[]>(row.impact_metrics, []),
    financials: parseJsonField<any>(row.financials, null),
    delegationAndVolunteers: parseJsonField<{ name: string; role: string }[]>(row.delegation_volunteers, []),
    signedBy: parseJsonField<{ name: string; title: string }>(row.signed_by, { name: '', title: '' }),
    documents: parseJsonField<{ title: string; image: string; type: string }[]>(row.documents, []),
    showFinancials: row.show_financials !== false,
    showDocuments: row.show_documents !== false,
    featured: Boolean(row.featured),
    orderIndex: Number(row.order_index) || 0,
    status: row.status || 'published',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}
