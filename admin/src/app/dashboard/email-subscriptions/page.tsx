"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { apiGet, apiDelete } from "@/lib/apiClient";
import { getApiBaseUrl } from "@/lib/api";
import { Download, RefreshCw, ChevronDown, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-public-sans" });

interface Subscription {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function EmailSubscriptionsPage() {
  const [data, setData] = useState<Subscription[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const allSelected = selected.length > 0 && selected.length === data.length;
  const [downloadOpen, setDownloadOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const visiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const loadData = async () => {
    setLoading(true);
    const url = `${getApiBaseUrl()}/newsletter/subscriptions?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    const res = await apiGet<Subscription[]>(url);
    if (res.success) {
      setData(res.data || []);
      setTotal(res.pagination?.total ?? ((res.data || []).length));
    } else {
      setData([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, limit]);

  const handleExport = async (format: "csv" | "xlsx" | "pdf") => {
    const url = `${getApiBaseUrl()}/newsletter/subscriptions/export?format=${format}`;
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('adminToken')) : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(url, { credentials: "include", headers });
    const blob = await res.blob();
    const a = document.createElement("a");
    const href = URL.createObjectURL(blob);
    a.href = href;
    a.download = `newsletter-subscriptions.${format === "xlsx" ? "xlsx" : format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(data.map(d => d.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this subscription?');
    if (!ok) return;
    const url = `${getApiBaseUrl()}/newsletter/subscriptions/${id}`;
    const res = await apiDelete<void>(url);
    if (res.success) {
      setSelected(prev => prev.filter(x => x !== id));
      loadData();
    }
  };

  return (
    <DashboardLayout title="Email Subscriptions">
      <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${publicSans.className}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 relative">
          <div className="flex items-center gap-3">
            <h2 className="custom-font text-xl text-gray-900">Email Subscription</h2>
          </div>
          <div />
        </div>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email"
              className="w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
            />
            <button
              onClick={() => { setPage(1); loadData(); }}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 flex items-center gap-2"
            >
              Search
            </button>
            <button
              onClick={loadData}
              className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page</span>
              <select value={limit} onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }} className="border rounded-lg px-2 py-1 text-sm">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="relative">
              <button onClick={() => setDownloadOpen(v => !v)} className="px-4 py-2 rounded-lg border text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
                <ChevronDown className="w-4 h-4" />
              </button>
              {downloadOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button onClick={() => { handleExport("csv"); setDownloadOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">CSV</button>
                  <button onClick={() => { handleExport("xlsx"); setDownloadOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Excel (.xlsx)</button>
                  <button onClick={() => { handleExport("pdf"); setDownloadOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {downloadOpen && (
          <div className="fixed inset-0" onClick={() => setDownloadOpen(false)}></div>
        )}

        <div className="px-6 py-4">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="rounded" />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Active</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Created At</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr><td className="px-4 py-6 text-center text-sm" colSpan={4}>Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td className="px-4 py-6 text-center text-sm" colSpan={4}>No subscriptions</td></tr>
                ) : (
                  data.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleRow(item.id)} className="rounded" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.email}</td>
                      <td className="px-4 py-3 text-sm">{item.isActive ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded-lg border hover:bg-red-50 text-red-600 flex items-center gap-1">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
          </table>
          </div>

          <div className="flex items-center justify-between mt-6 border-t border-gray-200 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="text-sm text-black hover:text-gray-900 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {visiblePages().map((p, idx) => (
                typeof p === 'string' ? (
                  <span key={`ellipsis-bottom-${idx}`} className="px-2 text-sm text-gray-500">{p}</span>
                ) : (
                  <button
                    key={`page-bottom-${p}`}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded-lg text-sm ${p === page ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    {p}
                  </button>
                )
              ))}
            </div>
            <button
              disabled={page >= Math.max(1, Math.ceil(total / limit))}
              onClick={() => setPage(p => p + 1)}
              className="text-sm text-black hover:text-gray-900 flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
