import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  TrendingUp,
  Target,
  Eye,
  Heart,
  Share2,
  Video,
  Instagram,
  Facebook,
  Youtube,
  Search,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Campaign, DigitalContent, Lead } from '@/types';
import { marketingService, MarketingMetrics } from '@/services/mock/marketingService';
import { useBranch } from '@/app/providers/BranchProvider';
import { mockStore } from '@/services/mock/mockStore';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/tables/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatINR, formatDate } from '@/lib/utils';

export const MarketingDashboardView: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [digitalContent, setDigitalContent] = useState<DigitalContent[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<MarketingMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      marketingService.getCampaigns(selectedBranchId),
      marketingService.getDigitalContent(selectedBranchId),
      marketingService.getLeads(selectedBranchId),
      marketingService.getMarketingMetrics(selectedBranchId),
    ]).then(([cmps, content, lds, mtrs]) => {
      if (isMounted) {
        setCampaigns(cmps);
        setDigitalContent(content);
        setLeads(lds);
        setMetrics(mtrs);
        setLoading(false);
      }
    });

    const unsubscribe = mockStore.subscribe(() => {
      marketingService.getCampaigns(selectedBranchId).then((cmps) => {
        if (isMounted) setCampaigns(cmps);
      });
      marketingService.getMarketingMetrics(selectedBranchId).then((mtrs) => {
        if (isMounted) setMetrics(mtrs);
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedBranchId]);

  if (loading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const campaignColumns: Column<Campaign>[] = [
    {
      key: 'name',
      header: 'Campaign Name',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-bold text-text-main text-xs">{c.name}</div>
          <div className="text-[11px] text-text-muted">{c.targetAudience}</div>
        </div>
      ),
    },
    {
      key: 'platform',
      header: 'Platform',
      sortable: true,
      render: (c) => (
        <Badge
          variant={
            c.platform === 'Google Ads'
              ? 'info'
              : c.platform === 'Instagram'
              ? 'teal'
              : 'navy'
          }
          size="sm"
        >
          {c.platform}
        </Badge>
      ),
    },
    {
      key: 'spend',
      header: 'Spend / Budget',
      sortable: true,
      render: (c) => (
        <div className="text-xs">
          <span className="font-bold text-text-main">{formatINR(c.spend)}</span>
          <span className="text-text-muted text-[11px] block">Budget: {formatINR(c.budget)}</span>
        </div>
      ),
    },
    {
      key: 'leadsCount',
      header: 'Leads & Enquiries',
      sortable: true,
      render: (c) => (
        <div className="text-xs">
          <span className="font-semibold text-text-main">{c.leadsCount} Leads</span>
          <span className="text-text-muted text-[11px] block">{c.enquiriesCount} Enquiries</span>
        </div>
      ),
    },
    {
      key: 'costPerLead',
      header: 'CPL (₹)',
      sortable: true,
      render: (c) => (
        <span className="font-bold text-text-main text-xs">
          ₹{Math.round(c.costPerLead)}
        </span>
      ),
    },
    {
      key: 'conversionRate',
      header: 'Conv. Rate',
      sortable: true,
      render: (c) => (
        <span className="font-semibold text-emerald-600 text-xs">
          {c.conversionRate}%
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (c) => (
        <Badge variant={c.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm" dot>
          {c.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Marketing & Campaign Analytics (Spec MKT-001–005)
            </h1>
            <Badge variant="navy" size="sm">
              {selectedBranch ? selectedBranch.name : 'Consolidated'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Ad spend efficiency, customer acquisition cost per lead (CPL), and digital video reach.
          </p>
        </div>
      </div>

      {/* Row 1: Marketing Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Ad Spend"
          value={formatINR(metrics.totalSpend)}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle={`Allocated Budget: ${formatINR(metrics.totalBudget)}`}
          accentColor="blue"
        />
        <KPICard
          title="Leads Generated"
          value={metrics.totalLeads}
          icon={<Target className="w-5 h-5" />}
          subtitle={`${metrics.totalEnquiries} Converted Enquiries`}
          accentColor="teal"
        />
        <KPICard
          title="Average Cost Per Lead"
          value={`₹${metrics.averageCostPerLead}`}
          icon={<Megaphone className="w-5 h-5" />}
          subtitle="Spend / Total Leads formula"
          accentColor="navy"
        />
        <KPICard
          title="Lead Conversion Rate"
          value={`${metrics.averageConversionRate}%`}
          icon={<Eye className="w-5 h-5" />}
          subtitle="Enquiries / Qualified Leads"
          accentColor="green"
        />
      </div>

      {/* Row 2: Campaigns Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-base">Active Marketing Campaigns (Spec MKT-001)</CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">
              Performance breakdown across Google Ads, Meta (Instagram & Facebook)
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={campaignColumns}
            data={campaigns}
            keyExtractor={(c) => c._id}
            pageSize={5}
            emptyTitle="No campaigns found"
            emptyDescription="No active advertising campaigns match this branch scope."
          />
        </CardContent>
      </Card>

      {/* Row 3: Digital Marketing Content Grid (Spec DGM-001–003) */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-text-main">
            Digital Video Content & Social Reach (Spec DGM-001)
          </h3>
          <p className="text-xs text-text-secondary">
            Performance metrics for Instagram Reels, YouTube Shorts, and doctor counseling videos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {digitalContent.map((content) => (
            <Card key={content._id} className="p-4 flex flex-col justify-between hoverEffect">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    variant={
                      content.platform === 'Instagram'
                        ? 'teal'
                        : content.platform === 'YouTube'
                        ? 'critical'
                        : 'info'
                    }
                    size="sm"
                  >
                    {content.platform} • {content.contentType}
                  </Badge>
                  <span className="text-[11px] text-text-muted">{formatDate(content.publishDate)}</span>
                </div>

                <h4 className="font-bold text-xs text-text-main leading-snug line-clamp-2 mb-3">
                  {content.title}
                </h4>

                <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-text-muted block">Views</span>
                    <span className="font-bold text-text-main">
                      {(content.views / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Likes</span>
                    <span className="font-bold text-rose-600">{content.likes}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Shares</span>
                    <span className="font-bold text-text-main">{content.shares}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-text-muted">
                <span>{content.branchName}</span>
                <span className="text-brand-blue font-semibold flex items-center gap-1 hover:underline">
                  Preview <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
