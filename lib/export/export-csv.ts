import { Company } from '@/types/company';

export function exportCompaniesToCSV(companies: Company[], filename: string = 'msme-companies-export.csv') {
  if (!companies || companies.length === 0) return;

  const headers = [
    'Company Name',
    'Udyam Number',
    'Classification',
    'Sector',
    'State',
    'District',
    'Investment (INR)',
    'Turnover (INR)',
    'NIC Code',
    'Registration Date',
    'Data Source'
  ];

  const rows = companies.map(c => [
    `"${(c.companyName || '').replace(/"/g, '""')}"`,
    `"${c.udyamNumber || ''}"`,
    `"${c.classification || ''}"`,
    `"${(c.sector || '').replace(/"/g, '""')}"`,
    `"${(c.state || '').replace(/"/g, '""')}"`,
    `"${(c.district || '').replace(/"/g, '""')}"`,
    c.investment ?? '',
    c.turnover ?? '',
    `"${(c.nicCode || '').replace(/"/g, '""')}"`,
    `"${c.registrationDate || ''}"`,
    `"${c.source}"`
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
