'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Company } from '@/types/company';
import { Scheme } from '@/types/scheme';
import { formatDate } from '@/lib/formatters/date';
import { matchCompanyToAllSchemes } from '@/lib/matching/match-company';
import { CompanyFormModal } from '@/components/companies/company-form-modal';
import { useAppData } from '@/lib/store/app-data-context';
import { useAuth } from '@/lib/auth/auth-context';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Building,
  Sparkles,
  Edit3,
  MapPin,
  FileText,
  Calendar,
} from 'lucide-react';

interface CompanyTableProps {
  companies: Company[];
  schemes: Scheme[];
  onEditCompany?: (company: Company) => void;
}

type SortField = 'companyName' | 'registrationDate' | 'district' | 'nicCode';
type SortOrder = 'asc' | 'desc';

export function CompanyTable({ companies, schemes, onEditCompany }: CompanyTableProps) {
  const { updateCompany } = useAppData();
  const { isAdmin } = useAuth();
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Edit Modal state
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handle Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleOpenEdit = (company: Company, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  const handleSaveCompany = (updated: Company) => {
    updateCompany(updated);
    if (onEditCompany) {
      onEditCompany(updated);
    }
    setIsEditModalOpen(false);
  };

  const sortedCompanies = React.useMemo(() => {
    return [...companies].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal as string);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      return 0;
    });
  }, [companies, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedCompanies.length / pageSize) || 1;
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Compute scheme matches ONLY for currently visible paginated companies for ultra-fast rendering
  const companyMatchesMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const company of paginatedCompanies) {
      const matches = matchCompanyToAllSchemes(company, schemes);
      const eligibleCount = matches.filter(
        (m) => m.status === 'strong_match' || m.status === 'possible_match'
      ).length;
      map.set(company.id, eligibleCount);
    }
    return map;
  }, [paginatedCompanies, schemes]);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[220px]">
                  <button
                    type="button"
                    onClick={() => handleSort('companyName')}
                    className="flex items-center gap-1.5 hover:text-slate-900 transition"
                  >
                    <span>Enterprise Name & URN</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 min-w-[140px]">
                  <button
                    type="button"
                    onClick={() => handleSort('district')}
                    className="flex items-center gap-1.5 hover:text-slate-900 transition"
                  >
                    <span>District & Location</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 min-w-[120px]">
                  <button
                    type="button"
                    onClick={() => handleSort('registrationDate')}
                    className="flex items-center gap-1.5 hover:text-slate-900 transition"
                  >
                    <span>Reg. Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 min-w-[240px]">
                  <button
                    type="button"
                    onClick={() => handleSort('nicCode')}
                    className="flex items-center gap-1.5 hover:text-slate-900 transition"
                  >
                    <span>National Industry Activity (NIC)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 min-w-[220px]">Registered Address</th>
                <th className="py-3 px-3 text-center min-w-[120px]">Scheme Matches</th>
                <th className="py-3 px-4 text-right min-w-[130px]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Building className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">No enterprises match current filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try relaxing search terms or select another Kerala district</p>
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((company) => {
                  const matchCount = companyMatchesMap.get(company.id) ?? 0;

                  return (
                    <tr
                      key={company.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name & URN */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/companies/${company.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition block leading-tight font-heading text-sm"
                        >
                          {company.companyName}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-500">
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                            {company.udyamNumber || 'URN Pending'}
                          </span>
                        </div>
                      </td>

                      {/* District & Location */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{company.district || 'Kerala'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {company.pinCode ? `PIN: ${company.pinCode}` : 'Kerala State'}
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {company.registrationDate ? formatDate(company.registrationDate) : '—'}
                          </span>
                        </div>
                      </td>

                      {/* NIC Industry & Activity Description */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800 leading-snug line-clamp-2" title={company.nicCode}>
                          {company.nicCode || company.sector || 'Commercial MSME Unit'}
                        </div>
                      </td>

                      {/* Registered Address */}
                      <td className="py-3.5 px-3">
                        <div
                          className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 max-w-xs"
                          title={company.address}
                        >
                          {company.address || `${company.district || 'Ernakulam'}, Kerala`}
                        </div>
                      </td>

                      {/* Potential Scheme Matches */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <Link
                          href={`/companies/${company.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{matchCount} Potential</span>
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(company, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
                            title="Edit enterprise details and custom KPIs"
                          >
                            <Edit3 className="w-3 h-3 text-blue-600" />
                            <span>Edit</span>
                          </button>
                        )}

                        <Link
                          href={`/companies/${company.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs transition"
                        >
                          <span>Profile &rarr;</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-400 pl-2">
              Page {currentPage} of {totalPages} ({sortedCompanies.length} total)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {editingCompany && (
        <CompanyFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCompany(null);
          }}
          onSave={handleSaveCompany}
          initialCompany={editingCompany}
          mode="edit"
        />
      )}
    </>
  );
}
