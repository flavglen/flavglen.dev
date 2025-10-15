'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Shield, CheckCircle, XCircle, Clock, User, Globe } from 'lucide-react';

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
  const [filters, setFilters] = useState({
    eventType: '',
    level: '',
    success: '',
    limit: '50'
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.eventType) queryParams.set('eventType', filters.eventType);
      if (filters.level) queryParams.set('level', filters.level);
      if (filters.success) queryParams.set('success', filters.success);
      
      const response = await fetch(`/api/admin/security-logs?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch security logs');
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching security logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor security events and access attempts</p>
        </div>
        <Button onClick={cleanupOldLogs} variant="outline">
          Cleanup Old Logs
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.failedAttempts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.successfulAttempts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.criticalEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspicious (24h)</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.recentSuspiciousActivity}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            Recent security events and access attempts ({logs.length} logs)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getEventIcon(log.eventType)}
                    <span className="font-medium">{log.eventType.replace(/_/g, ' ')}</span>
                    <Badge variant={getLevelColor(log.level) as any}>
                      {log.level}
                    </Badge>
                    <Badge variant={log.success ? 'default' : 'destructive'}>
                      {log.success ? 'SUCCESS' : 'FAILED'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    <div className="md:col-span-2">
                      <span className="font-medium">Reason:</span> {log.reason}
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
        </CardContent>
      </Card>
    </div>
  );
}
