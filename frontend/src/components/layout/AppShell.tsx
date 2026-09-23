import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { DemoBanner } from './DemoBanner';
import { DesktopSidebar } from './DesktopSidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { Modal } from '@/components/ui/Modal';
import { mockStore } from '@/services/mock/mockStore';
import { Search, User, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const AppShell: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { permissions, assignedBranches } = useAuth();
  const organizationAccess = permissions.includes('organization.view');
  const inScope = (branchId: string) => organizationAccess || assignedBranches.includes(branchId);

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const state = mockStore.getState();
  const q = searchQuery.toLowerCase().trim();

  const matchingPatients = q && permissions.includes('patient.view')
    ? state.patients.filter(
        (p) =>
          inScope(p.branchId) &&
          p.name.toLowerCase().includes(q) ||
          p.patientNumber.toLowerCase().includes(q) ||
          p.phone.includes(q)
      )
    : [];

  const matchingAppointments = q && permissions.includes('appointment.view')
    ? state.appointments.filter(
        (a) =>
          inScope(a.branchId) &&
          a.patientName.toLowerCase().includes(q) ||
          a.appointmentNumber.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q)
      )
    : [];

  const matchingComplaints = q && permissions.includes('complaint.view')
    ? state.complaints.filter(
        (c) =>
          inScope(c.branchId) &&
          c.subject.toLowerCase().includes(q) ||
          c.ticketNumber.toLowerCase().includes(q) ||
          c.complainantName.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      {/* Top Demo Disclaimer Banner */}
      <DemoBanner />

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav onMenuToggle={() => setMobileMenuOpen(true)} onSearchOpen={() => setSearchOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
            <Outlet />
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
        </div>
      </div>

      {/* Global Quick Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
        title="Quick Search"
        description="Search across patients, appointments, and complaints"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, ID, phone number or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3">
            {q.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-secondary">
                Type a keyword to quickly locate hospital records across branches.
              </div>
            ) : (
              <>
                {matchingPatients.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase text-text-muted mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Patients ({matchingPatients.length})</span>
                    </div>
                    <div className="space-y-1">
                      {matchingPatients.slice(0, 4).map((p) => (
                        <button
                          key={p._id}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(`/patients/${p._id}`);
                          }}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-gray-100 flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-text-main">
                              {p.name} <span className="text-text-muted">({p.patientNumber})</span>
                            </div>
                            <div className="text-[11px] text-text-secondary">
                              {p.branchName} • {p.phone} • {p.status}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchingAppointments.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                      <span>Appointments ({matchingAppointments.length})</span>
                    </div>
                    <div className="space-y-1">
                      {matchingAppointments.slice(0, 3).map((a) => (
                        <button
                          key={a._id}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate('/appointments');
                          }}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-gray-100 flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-text-main">
                              {a.patientName} with {a.doctorName}
                            </div>
                            <div className="text-[11px] text-text-secondary">
                              {a.appointmentNumber} • {a.status}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchingComplaints.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase text-text-muted mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>Complaints ({matchingComplaints.length})</span>
                    </div>
                    <div className="space-y-1">
                      {matchingComplaints.slice(0, 3).map((c) => (
                        <button
                          key={c._id}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate('/complaints');
                          }}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-gray-100 flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-text-main">
                              {c.ticketNumber} — {c.subject}
                            </div>
                            <div className="text-[11px] text-text-secondary">
                              {c.branchName} • Status: {c.status}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchingPatients.length === 0 &&
                  matchingAppointments.length === 0 &&
                  matchingComplaints.length === 0 && (
                    <div className="py-6 text-center text-xs text-text-secondary">
                      No matching records found for "{searchQuery}".
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
