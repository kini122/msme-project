import { Company } from '@/types/company';

export function exportCompaniesToCSV(companies: Company[], filename: string = 'kerala-msme-units-export.csv') {
  if (!companies || companies.length === 0) return;

  const headers = [
    'Enterprise Name',
    'Udyam Number',
    'District',
    'State',
    'PIN Code',
    'National Industry Activity (NIC)',
    'Registration Date',
    'Registered Address',
    'Data Source'
  ];

  const rows = companies.map(c => [
    `"${(c.companyName || '').replace(/"/g, '""')}"`,
    `"${c.udyamNumber || ''}"`,
    `"${(c.district || '').replace(/"/g, '""')}"`,
    `"${(c.state || 'Kerala').replace(/"/g, '""')}"`,
    `"${c.pinCode || ''}"`,
    `"${(c.nicCode || c.sector || '').replace(/"/g, '""')}"`,
    `"${c.registrationDate || ''}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    `"${c.source || 'data.gov.in'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
