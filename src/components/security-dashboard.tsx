'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Shield, CheckCircle, XCircle, Clock, User, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: string;
  level: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  path: string;
  method: string;
  success: boolean;
  reason?: string;
  metadata?: any;
}

interface SecurityStats {
  totalEvents: number;
  failedAttempts: number;
  successfulAttempts: number;
  criticalEvents: number;
  recentSuspiciousActivity: number;
}

export default function SecurityDashboard() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    eventType: '',
    level: '',
    success: '',
    limit: '50'
  });

  const fetchLogs = async (page: number = currentPage) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filters only if they have values
      if (filters.eventType) {
        queryParams.set('eventType', filters.eventType);
        console.log('[SecurityDashboard] Filtering by eventType:', filters.eventType);
      }
      if (filters.level) {
        queryParams.set('level', filters.level);
        console.log('[SecurityDashboard] Filtering by level:', filters.level);
      }
      if (filters.success) {
        queryParams.set('success', filters.success);
        console.log('[SecurityDashboard] Filtering by success:', filters.success);
      }
      queryParams.set('page', page.toString());
      queryParams.set('limit', filters.limit);
      
      // Add cache-busting parameter to ensure fresh data
      queryParams.set('_t', Date.now().toString());
      
      const url = `/api/admin/security-logs?${queryParams.toString()}`;
      console.log('[SecurityDashboard] Fetching from:', url);
      
      const response = await fetch(url, {
        cache: 'no-store', // Disable browser caching
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch security logs');
      }
      
      const data = await response.json();
      console.log('[SecurityDashboard] Received data:', {
        logsCount: data.logs?.length || 0,
        total: data.pagination?.total || 0,
        filters: { eventType: filters.eventType, level: filters.level, success: filters.success }
      });
      
      setLogs(data.logs || []);
      setStats(data.stats);
      if (data.pagination) {
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('[SecurityDashboard] Error fetching security logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track previous filter values to detect changes
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    // Check if any filter has changed
    const filtersChanged = 
      prevFiltersRef.current.eventType !== filters.eventType ||
      prevFiltersRef.current.level !== filters.level ||
      prevFiltersRef.current.success !== filters.success ||
      prevFiltersRef.current.limit !== filters.limit;

    if (filtersChanged) {
      // Update ref and reset to page 1
      prevFiltersRef.current = filters;
      setCurrentPage(1);
    }
  }, [filters.eventType, filters.level, filters.success, filters.limit]);

  useEffect(() => {
    // Always fetch when page or filters change
    // Use the current filters state (which is always up-to-date)
    fetchLogs(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.eventType, filters.level, filters.success, filters.limit]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'destructive';
      case 'ERROR': return 'destructive';
      case 'WARN': return 'secondary';
      case 'INFO': return 'default';
      default: return 'outline';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'ADMIN_ACCESS_GRANTED':
      case 'API_ACCESS_GRANTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ADMIN_ACCESS_DENIED':
      case 'API_ACCESS_DENIED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'SUSPICIOUS_ACTIVITY':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const cleanupOldLogs = async () => {
    try {
      const response = await fetch('/api/admin/security-logs?daysToKeep=30', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Cleaned up ${data.deletedCount} old logs`);
        fetchLogs();
      }
    } catch (error) {
      console.error('Error cleaning up logs:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading security logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Security Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Monitor security events and access attempts</p>
        </div>
        <Button onClick={cleanupOldLogs} variant="outline" className="w-full sm:w-auto">
          Cleanup Old Logs
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Events</CardTitle>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Failed Attempts</CardTitle>
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-500">{stats.failedAttempts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-500">{stats.successfulAttempts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Critical Events</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-500">{stats.criticalEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Suspicious (24h)</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-orange-500">{stats.recentSuspiciousActivity}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Event Type</label>
              <select
                value={filters.eventType}
                onChange={(e) => setFilters({...filters, eventType: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">All Events</option>
                <option value="ADMIN_ACCESS_GRANTED">Admin Access Granted</option>
                <option value="ADMIN_ACCESS_DENIED">Admin Access Denied</option>
                <option value="API_ACCESS_GRANTED">API Access Granted</option>
                <option value="API_ACCESS_DENIED">API Access Denied</option>
                <option value="INVALID_TOKEN">Invalid Token</option>
                <option value="TOKEN_EXPIRED">Token Expired</option>
                <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Level</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">All Levels</option>
                <option value="CRITICAL">Critical</option>
                <option value="ERROR">Error</option>
                <option value="WARN">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Success</label>
              <select
                value={filters.success}
                onChange={(e) => setFilters({...filters, success: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">All</option>
                <option value="true">Success</option>
                <option value="false">Failed</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Limit</label>
              <select
                value={filters.limit}
                onChange={(e) => setFilters({...filters, limit: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Security Logs</CardTitle>
          <CardDescription>
            Recent security events and access attempts
            {total > 0 && (
              <span className="ml-1">
                (Page {currentPage} of {totalPages}, {total} total)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {getEventIcon(log.eventType)}
                    <span className="font-medium text-sm sm:text-base break-words">{log.eventType.replace(/_/g, ' ')}</span>
                    <Badge variant={getLevelColor(log.level) as any} className="text-xs">
                      {log.level}
                    </Badge>
                    <Badge variant={log.success ? 'default' : 'destructive'} className="text-xs">
                      {log.success ? 'SUCCESS' : 'FAILED'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium">Path:</span> {log.path}
                  </div>
                  <div>
                    <span className="font-medium">Method:</span> {log.method}
                  </div>
                  <div>
                    <span className="font-medium">IP:</span> {log.ipAddress || 'Unknown'}
                    {log.ipAddress === '::1' && (
                      <span className="text-xs text-muted-foreground ml-1">(localhost IPv6)</span>
                    )}
                    {log.ipAddress === '127.0.0.1' && (
                      <span className="text-xs text-muted-foreground ml-1">(localhost IPv4)</span>
                    )}
                  </div>
                  {log.userEmail && (
                    <div>
                      <span className="font-medium">User:</span> {log.userEmail}
                    </div>
                  )}
                  {log.reason && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <span className="font-medium">Reason:</span> <span className="break-words">{log.reason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {logs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No security logs found
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * parseInt(filters.limit)) + 1} to {Math.min(currentPage * parseInt(filters.limit), total)} of {total} logs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className="min-w-[2.5rem]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
