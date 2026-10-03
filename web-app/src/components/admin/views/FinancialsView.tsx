'use client';

import React from 'react';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function FinancialsView() {
  const {
    finSummary,
    accounts,
    transactions,
    setIsTxModalOpen,
    setTxFormData,
    formatMoney,
  } = useAdmin();

  return (
            <div className="space-y-6">
              {/* Top Financial Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NGN Balance</p>
                  <p className="text-2xl font-black text-emerald-800 mt-1">
                    {formatMoney(finSummary?.totalNGNBalance || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Domestic Operations & VOIE</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">USD Balance</p>
                  <p className="text-2xl font-black text-blue-800 mt-1">
                    {formatMoney(finSummary?.totalUSDBalance || 0, 'USD')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Chase International Domiciliary</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Inflow (NGN)</p>
                  <p className="text-2xl font-black text-gray-900 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                    {formatMoney(finSummary?.totalNGNInflow || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Donations & corporate grants</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Outflow (NGN)</p>
                  <p className="text-2xl font-black text-gray-900 mt-1 flex items-center gap-1">
                    <ArrowDownRight className="w-5 h-5 text-rose-600" />
                    {formatMoney(finSummary?.totalNGNOutflow || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Projects, equipment & relief</p>
                </div>
              </div>

              {/* Bank Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {accounts.map((acc) => (
                  <div key={acc.id} className="bg-gradient-to-br from-[#0c1a05] to-[#1a3310] text-white p-5 rounded-2xl shadow relative">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#a1e25e]">
                        {acc.bankName}
                      </span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono uppercase">
                        {acc.currency}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mt-2 truncate">{acc.accountName}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">Acc: {acc.accountNumber}</p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-[11px] text-gray-300">Balance:</span>
                      <span className="text-lg font-black text-white">{formatMoney(acc.balance, acc.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions Ledger */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm space-y-4 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">Financial Audit & Transactions Ledger</h3>
                    <p className="text-xs text-gray-500">Every inflow & disbursement logged directly in Neon Postgres.</p>
                  </div>
                  <button
                    onClick={() => setIsTxModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Record Transaction
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                        <th className="p-3">Date</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Account</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Reference</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50/70 transition">
                          <td className="p-3 font-mono text-gray-600">{tx.transactionDate}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] inline-flex items-center gap-1 ${
                                tx.transactionType === 'inflow'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {tx.transactionType === 'inflow' ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {tx.transactionType}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-gray-900">{tx.accountName}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium text-[11px]">
                              {tx.category}
                            </span>
                          </td>
                          <td className="p-3 max-w-sm">
                            <p className="text-gray-900 font-medium">{tx.description}</p>
                          </td>
                          <td className="p-3 font-mono text-gray-500 text-[11px]">{tx.reference || '-'}</td>
                          <td className="p-3 text-right font-black text-sm">
                            <span
                              className={
                                tx.transactionType === 'inflow' ? 'text-emerald-700' : 'text-rose-700'
                              }
                            >
                              {tx.transactionType === 'inflow' ? '+' : '-'}
                              {formatMoney(tx.amount, tx.currency)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
}
