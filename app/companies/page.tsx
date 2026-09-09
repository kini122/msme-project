'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { CompanyFilters } from '@/components/companies/company-filters';
import { CompanyTable } from '@/components/companies/company-table';
import { exportCompaniesToCSV } from '@/lib/export/export-csv';
import { filterCompanies } from '@/lib/filters/company-filters';
import { useAppData } from '@/lib/store/app-data-context';
import { CompanyFilterState } from '@/types/company';

function CompanyListContent() {
  const searchParams = useSearchParams();
  const initialClassification = searchParams.get('classification') || 'ALL';

  const {
    companies,
    schemes,
    fetchLiveCompanyBatch,
    isFetchingLive,
    lastFetchMessage,
    clearNotification,
  } = useAppData();

  // Extract unique sectors and states dynamically from active registry
  const sectors = React.useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.sector) set.add(c.sector);
    });
    return Array.from(set).sort();
  }, [companies]);

  const states = React.useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.state) set.add(c.state);
    });
    return Array.from(set).sort();
  }, [companies]);

  const [filters, setFilters] = React.useState<CompanyFilterState>({
    search: '',
    classification: initialClassification,
    sector: 'ALL',
    state: 'ALL',
    district: 'ALL',
  });

  // Sync classification if query param changes
  React.useEffect(() => {
    if (initialClassification && initialClassification !== filters.classification) {
      setFilters((prev) => ({ ...prev, classification: initialClassification }));
    }
  }, [initialClassification]);

  const filteredCompanies = React.useMemo(() => {
    return filterCompanies(companies, filters);
  }, [companies, filters]);

  const handleExportCSV = () => {
    exportCompaniesToCSV(
      filteredCompanies,
      `msme-registry-${filters.classification.toLowerCase()}.csv`
    );
  };

  const handleLiveFetch = async () => {
    await fetchLiveCompanyBatch(filters, 12);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Master List"
        description="Comprehensive directory of registered MSMEs with financial turnover, investment in plant & machinery, and active scheme match telemetry."
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Company Master List' },
        ]}
        source="mock"
      />

      <CompanyFilters
        filters={filters}
        onFilterChange={setFilters}
        sectors={sectors}
        states={states}
        totalCount={companies.length}
        filteredCount={filteredCompanies.length}
        onExportCSV={handleExportCSV}
        onFetchLive={handleLiveFetch}
        isFetchingLive={isFetchingLive}
        notificationMessage={lastFetchMessage}
        onClearNotification={clearNotification}
      />

      <CompanyTable companies={filteredCompanies} schemes={schemes} />
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading company roster...</div>}>
      <CompanyListContent />
    </Suspense>
  );
}
