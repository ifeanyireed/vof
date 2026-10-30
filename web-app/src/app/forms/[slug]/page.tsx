import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import { ensureCustomFormsTables, mapFormRow } from '@/lib/customFormsDb';
import PublicDynamicFormClient from './PublicDynamicFormClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await ensureCustomFormsTables();

  try {
    const rows = await sql`
      SELECT * FROM custom_forms
      WHERE slug = ${slug} OR id = ${/^\d+$/.test(slug) ? Number(slug) : -1}
      LIMIT 1;
    `;
    if (rows.length > 0) {
      const form = mapFormRow(rows[0]);
      return {
        title: `${form.title} | Veronica Onyeneke Foundation`,
        description: form.description || 'Complete this official form to submit your application or inquiry to Veronica Onyeneke Foundation.',
        openGraph: {
          title: `${form.title} | Veronica Onyeneke Foundation`,
          description: form.description || 'Official intake form for Veronica Onyeneke Foundation.',
          url: `https://www.vonf.org/forms/${form.slug}`,
        },
      };
    }
  } catch {}

  return {
    title: 'Dynamic Form | Veronica Onyeneke Foundation',
  };
}

export default async function PublicFormPage({ params }: Props) {
  const { slug } = await params;
  await ensureCustomFormsTables();

  let form: any = null;
  try {
    const rows = await sql`
      SELECT * FROM custom_forms
      WHERE slug = ${slug} OR id = ${/^\d+$/.test(slug) ? Number(slug) : -1}
      LIMIT 1;
    `;
    if (rows.length > 0) {
      form = mapFormRow(rows[0]);
    }
  } catch (err) {
    console.error('Failed to load form for slug:', slug, err);
  }

  if (!form) {
    notFound();
  }

  return <PublicDynamicFormClient initialForm={form} />;
}
