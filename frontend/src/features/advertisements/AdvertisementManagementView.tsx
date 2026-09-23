import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Building2,
  Grid,
  Share2,
  Tag,
  Link as LinkIcon,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { mockStore } from '@/services/mock/mockStore';
import { SuperDAdvertisement, SuperDAdPlatform, SuperDAdStatus } from '@/types';

export const AdvertisementManagementView: React.FC = () => {
  const { currentRole } = useAuth();
  const { branches, selectedBranch } = useBranch();

  // State subscriptions from mockStore
  const [ads, setAds] = useState<SuperDAdvertisement[]>(mockStore.getState().superDAds);

  // Filter states
  const [branchFilter, setBranchFilter] = useState<string>(
    currentRole === 'Staff' ? 'branch-try' : 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [platformFilters, setPlatformFilters] = useState<Record<string, boolean>>({
    'Google Ads': false,
    'YouTube': false,
    'Meta Ads': false,
    'Other': false,
  });
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    'Running': false,
    'Scheduled': false,
    'Completed': false,
    'Draft': false,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting
  const [sortField, setSortField] = useState<keyof SuperDAdvertisement>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  // Modals
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [viewAd, setViewAd] = useState<SuperDAdvertisement | null>(null);
  const [editingAd, setEditingAd] = useState<SuperDAdvertisement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    branchId: 'branch-try',
    category: 'Health Awareness',
    platform: 'Google Ads' as SuperDAdPlatform,
    title: '',
    startDate: '08-09-2026',
    endDate: '30-09-2026',
    runningAdsBy: 'Google Ads',
    handledBy: 'Dr. Anand Kumar',
    leads: 0,
    enquiry: 0,
    spentAmount: 0,
    sourceName: 'Search Ads',
    url: 'https://ads.google.com/campaign/demo',
    status: 'Running' as SuperDAdStatus,
  });

  const togglePlatform = (p: string) => {
    setPlatformFilters((prev) => ({ ...prev, [p]: !prev[p] }));
  };

  const toggleStatus = (s: string) => {
    setStatusFilters((prev) => ({ ...prev, [s]: !prev[s] }));
  };

  const resetFilters = () => {
    setBranchFilter(currentRole === 'Staff' ? 'branch-try' : 'all');
    setCategoryFilter('all');
    setPlatformFilters({
      'Google Ads': false,
      'YouTube': false,
      'Meta Ads': false,
      'Other': false,
    });
    setStatusFilters({
      'Running': false,
      'Scheduled': false,
      'Completed': false,
      'Draft': false,
    });
    setSearchQuery('');
  };

  // Filtered and sorted dataset
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      // Branch filter
      if (branchFilter !== 'all' && ad.branchId !== branchFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && ad.category !== categoryFilter) {
        return false;
      }
      // Platform checkboxes (if any are checked)
      const selectedPlatforms = Object.entries(platformFilters)
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(ad.platform)) {
        return false;
      }
      // Status checkboxes (if any are checked)
      const selectedStatuses = Object.entries(statusFilters)
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(ad.status)) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ad.title.toLowerCase().includes(q) ||
          ad.category.toLowerCase().includes(q) ||
          ad.platform.toLowerCase().includes(q) ||
          ad.sourceName.toLowerCase().includes(q) ||
          ad.handledBy.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [ads, branchFilter, categoryFilter, platformFilters, statusFilters, searchQuery]);

  const sortedAds = useMemo(() => {
    return [...filteredAds].sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredAds, sortField, sortAsc]);

  // Paginated ads
  const paginatedAds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAds.slice(start, start + pageSize);
  }, [sortedAds, currentPage]);

  const totalPages = Math.max(1, Math.ceil(sortedAds.length / pageSize));

  const handleSort = (field: keyof SuperDAdvertisement) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleOpenAdd = () => {
    setEditingAd(null);
    setFormData({
      branchId: 'branch-try',
      category: 'Health Awareness',
      platform: 'Google Ads',
      title: 'Diabetes Awareness Campaign',
      startDate: '08-09-2026',
      endDate: '30-09-2026',
      runningAdsBy: 'Google Ads',
      handledBy: 'Dr. Anand Kumar',
      leads: 48,
      enquiry: 12,
      spentAmount: 2500,
      sourceName: 'Search Ads',
      url: 'https://ads.google.com/campaign/abcd',
      status: 'Running',
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (ad: SuperDAdvertisement) => {
    setEditingAd(ad);
    setFormData({
      branchId: ad.branchId,
      category: ad.category,
      platform: ad.platform,
      title: ad.title,
      startDate: ad.startDate || '08-09-2026',
      endDate: ad.endDate || '30-09-2026',
      runningAdsBy: ad.runningAdsBy,
      handledBy: ad.handledBy,
      leads: ad.leads,
      enquiry: ad.enquiry,
      spentAmount: ad.spentAmount,
      sourceName: ad.sourceName,
      url: ad.url,
      status: ad.status,
    });
    setAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const branchName =
      branches.find((b) => b._id === formData.branchId)?.name || 'Trichy Main Hospital';

    if (editingAd) {
      mockStore.updateAdvertisement(editingAd._id, {
        ...formData,
        branchName,
      });
    } else {
      mockStore.addAdvertisement({
        ...formData,
        date: '08 Sep 2026',
        branchName,
        clicks: formData.leads * 25,
      });
    }
    setAds([...mockStore.getState().superDAds]);
    setAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement record?')) {
      mockStore.deleteAdvertisement(id);
      setAds([...mockStore.getState().superDAds]);
    }
  };

  const renderStatusBadge = (status: SuperDAdStatus, clicks: number = 0, leads: number = 0) => {
    switch (status) {
      case 'Running':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              Running <span className="text-slate-400 font-normal">({clicks} / {leads})</span>
            </span>
          </div>
        );
      case 'Completed':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0d6efd]">
            <span className="w-2 h-2 rounded-full bg-[#0d6efd] shrink-0" />
            <span>
              Completed <span className="text-slate-400 font-normal">({clicks} / {leads})</span>
            </span>
          </div>
        );
      case 'Scheduled':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>
              Scheduled <span className="text-slate-400 font-normal">(0 / 0)</span>
            </span>
          </div>
        );
      case 'Draft':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
            <span>
              Draft <span className="text-slate-400 font-normal">(0 / 0)</span>
            </span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Advertisement Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'Staff'
              ? 'Create, manage and track advertisements for your branch.'
              : 'Create, manage and track advertisements across all branches'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all duration-150 active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Advertisement</span>
        </button>
      </div>

      {/* 4 Filter Cards Grid (Exact screenshot reproduction) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Select Branch */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
            <Building2 className="w-4 h-4 text-[#0d6efd]" />
            <span>Select Branch</span>
          </div>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            disabled={currentRole === 'Staff'}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30 text-slate-700"
          >
            <option value="all">All Branches</option>
            <option value="branch-try">Trichy</option>
            <option value="branch-chn">Chennai</option>
            <option value="branch-mdu">Madurai</option>
            <option value="branch-pdk">Pudukkottai</option>
          </select>
        </div>

        {/* Card 2: Category */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
            <Grid className="w-4 h-4 text-[#0d6efd]" />
            <span>Category</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30 text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="Search Ads">Search Ads</option>
            <option value="Facebook Campaign">Facebook Campaign</option>
            <option value="Video Promotion">Video Promotion</option>
            <option value="Instagram Campaign">Instagram Campaign</option>
            <option value="Display Ads">Display Ads</option>
            <option value="Lead Generation">Lead Generation</option>
            <option value="Awareness Video">Awareness Video</option>
            <option value="Health Awareness">Health Awareness</option>
          </select>
        </div>

        {/* Card 3: Platform / Channel (2x2 Checkbox Matrix) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2.5">
            <Share2 className="w-4 h-4 text-[#0d6efd]" />
            <span>Platform / Channel</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['Google Ads', 'YouTube', 'Meta Ads', 'Other'] as const).map((platform) => (
              <label
                key={platform}
                className="flex items-center gap-2 text-slate-600 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={platformFilters[platform]}
                  onChange={() => togglePlatform(platform)}
                  className="w-3.5 h-3.5 rounded text-[#0d6efd] focus:ring-[#0d6efd]"
                />
                <span className="truncate">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Card 4: Status (2x2 Checkbox Matrix) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2.5">
            <Tag className="w-4 h-4 text-[#0d6efd]" />
            <span>Status</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['Running', 'Scheduled', 'Completed', 'Draft'] as const).map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 text-slate-600 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={statusFilters[status]}
                  onChange={() => toggleStatus(status)}
                  className="w-3.5 h-3.5 rounded text-[#0d6efd] focus:ring-[#0d6efd]"
                />
                <span className="truncate">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Bar with Search */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-[#0d6efd]" />
            <h3 className="font-bold text-base text-slate-900">Advertisement List</h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, category or platform..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30 text-slate-700"
              />
            </div>
            {(branchFilter !== 'all' ||
              categoryFilter !== 'all' ||
              searchQuery ||
              Object.values(platformFilters).some(Boolean) ||
              Object.values(statusFilters).some(Boolean)) && (
              <button
                type="button"
                onClick={resetFilters}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dense Responsive Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-bold select-none">
              <tr>
                <th
                  onClick={() => handleSort('date')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('runningAdsBy')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Running Ads By</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                {currentRole === 'Staff' && (
                  <th
                    onClick={() => handleSort('handledBy')}
                    className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Ad Handled By</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}
                <th
                  onClick={() => handleSort('leads')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>No. of Leads</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('enquiry')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Enquiry</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('spentAmount')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Spent Amount (₹)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Ad Status (Click / Lead)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sourceName')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Source Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap text-center">URL</th>
                <th className="px-4 py-3.5 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAds.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                    No advertisements match your selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedAds.map((ad) => (
                  <tr key={ad._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                      {ad.date}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{ad.runningAdsBy}</td>
                    {currentRole === 'Staff' && (
                      <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-800">
                        {ad.handledBy}
                      </td>
                    )}
                    <td className="px-4 py-3.5 whitespace-nowrap">{ad.leads}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{ad.enquiry}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      {ad.spentAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {renderStatusBadge(ad.status, ad.clicks, ad.leads)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{ad.sourceName}</td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <a
                        href={ad.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex p-1.5 rounded-lg text-[#0d6efd] hover:bg-blue-50 transition-colors"
                        title={ad.url}
                      >
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewAd(ad)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0d6efd] hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[#0d6efd]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ad)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Edit Campaign"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ad._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {paginatedAds.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedAds.length)} of {sortedAds.length} advertisements
          </span>

          <div className="flex items-center gap-1.5 self-center">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#0d6efd] text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Advertisement Modal Form (Pixel replica of screenshot) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingAd ? 'Edit Advertisement' : 'Add Advertisement'}
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Row 1: Branch, Category, Platform, Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Branch <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0d6efd]/30"
                  >
                    <option value="branch-try">Trichy</option>
                    <option value="branch-chn">Chennai</option>
                    <option value="branch-mdu">Madurai</option>
                    <option value="branch-pdk">Pudukkottai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0d6efd]/30"
                  >
                    <option value="Health Awareness">Health Awareness</option>
                    <option value="Search Ads">Search Ads</option>
                    <option value="Facebook Campaign">Facebook Campaign</option>
                    <option value="Video Promotion">Video Promotion</option>
                    <option value="Instagram Campaign">Instagram Campaign</option>
                    <option value="Display Ads">Display Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Platform / Channel <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        platform: e.target.value as SuperDAdPlatform,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0d6efd]/30"
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ad Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Diabetes Campaign"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>
              </div>

              {/* Row 2: Dates, Running Ads By, Handled By */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Running Ads By <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.runningAdsBy}
                    onChange={(e) => setFormData({ ...formData, runningAdsBy: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ad Handled By <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.handledBy}
                    onChange={(e) => setFormData({ ...formData, handledBy: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>
              </div>

              {/* Row 3: Metrics, Source, URL */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    No. of Leads
                  </label>
                  <input
                    type="number"
                    value={formData.leads}
                    onChange={(e) => setFormData({ ...formData, leads: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Enquiry
                  </label>
                  <input
                    type="number"
                    value={formData.enquiry}
                    onChange={(e) => setFormData({ ...formData, enquiry: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Spent Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.spentAmount}
                    onChange={(e) => setFormData({ ...formData, spentAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Source Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sourceName}
                    onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>
              </div>

              {/* Row 4: URL & Ad Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Landing URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0d6efd]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ad Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as SuperDAdStatus,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0d6efd]/30"
                  >
                    <option value="Running">Running</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d6efd] hover:bg-[#0b5ed7] text-xs font-bold text-white shadow-md shadow-blue-500/20"
                >
                  Save Advertisement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Campaign Details</h3>
              <button
                type="button"
                onClick={() => setViewAd(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Campaign Title:</span>
                <span className="font-bold text-slate-900">{viewAd.title}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Hospital Branch:</span>
                <span className="font-medium text-slate-800">{viewAd.branchName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Platform:</span>
                <span className="font-medium text-slate-800">{viewAd.platform}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Ad Handled By:</span>
                <span className="font-medium text-slate-800">{viewAd.handledBy}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span>{renderStatusBadge(viewAd.status, viewAd.clicks, viewAd.leads)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Leads Received:</span>
                <span className="font-bold text-[#0d6efd]">{viewAd.leads}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Enquiries:</span>
                <span className="font-bold text-slate-900">{viewAd.enquiry}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Spent Amount:</span>
                <span className="font-bold text-emerald-600">
                  ₹ {viewAd.spentAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">URL:</span>
                <a
                  href={viewAd.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0d6efd] hover:underline truncate max-w-[200px]"
                >
                  {viewAd.url}
                </a>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewAd(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
