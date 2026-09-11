'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { CompanyFilters } from '@/components/companies/company-filters';
import { CompanyTable } from '@/components/companies/company-table';
import { CompanyFormModal } from '@/components/companies/company-form-modal';
import { exportCompaniesToCSV } from '@/lib/export/export-csv';
import { filterCompanies } from '@/lib/filters/company-filters';
import { useAppData } from '@/lib/store/app-data-context';
import { useAuth } from '@/lib/auth/auth-context';
import { Company, CompanyFilterState } from '@/types/company';
import { Plus, Sparkles } from 'lucide-react';

function CompanyListContent() {
  const searchParams = useSearchParams();
  const initialClassification = searchParams.get('classification') || 'ALL';
  const { isAdmin } = useAuth();

  const {
    companies,
    schemes,
    createCompany,
    fetchLiveCompanyBatch,
    isFetchingLive,
    lastFetchMessage,
    clearNotification,
  } = useAppData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    state: 'Kerala',
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
      `kerala-msme-registry-${filters.classification.toLowerCase()}.csv`
    );
  };

  const handleLiveFetch = async () => {
    await fetchLiveCompanyBatch(filters, 12);
  };

  const handleCreateCompany = (newComp: Company) => {
    createCompany(newComp);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kerala Company Master List"
        description="Comprehensive statutory directory of registered Kerala MSMEs with financial scale, industrial district jurisdiction, and active ministerial scheme matches."
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Company Master List' },
        ]}
        source="mock"
        actions={
          isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Enterprise</span>
              </button>
            </div>
          ) : undefined
        }
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

      {/* Register New Company Modal */}
      <CompanyFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCompany}
        mode="create"
      />
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
