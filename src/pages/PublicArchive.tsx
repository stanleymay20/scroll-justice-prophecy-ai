
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, FileText, Calendar, Globe, Filter } from 'lucide-react';

const PublicArchive = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  useEffect(() => {
    fetchPublicCases();
  }, []);

  const fetchPublicCases = async () => {
    try {
      const { data, error } = await supabase
        .from('scroll_petitions')
        .select('*')
        .eq('is_public', true)
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching public cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || case_.country === countryFilter;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'in_review': return 'bg-blue-500';
      case 'verdict_delivered': return 'bg-green-500';
      case 'sealed': return 'bg-purple-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const uniqueCountries = [...new Set(cases.map(case_ => case_.country))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-justice-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <Globe className="inline mr-3 h-8 w-8" />
            ScrollCourt Public Archive
          </h1>
          <p className="text-justice-light/80">
            Browse publicly available legal cases and AI-generated verdicts from around the world
          </p>
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>Public Archive Notice:</strong> All cases shown here have been made public by their petitioners. 
              All verdicts are AI-generated and provided for educational purposes only.
            </p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-justice-light/50" />
                <Input
                  placeholder="Search cases by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-justice-primary/30 text-white"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-black/30 border-justice-primary/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="verdict_delivered">Verdict Delivered</SelectItem>
                <SelectItem value="sealed">Sealed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-48 bg-black/30 border-justice-primary/30 text-white">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Results Summary */}
        <div className="flex items-center gap-4 mb-6 text-justice-light/70">
          <Filter className="h-4 w-4" />
          <span>Showing {filteredCases.length} of {cases.length} public cases</span>
        </div>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <FileText className="h-16 w-16 text-justice-light/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Cases Found</h3>
            <p className="text-justice-light/70">
              {searchTerm || statusFilter !== 'all' || countryFilter !== 'all' 
                ? 'Try adjusting your search criteria.' 
                : 'No public cases are currently available.'}
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {filteredCases.map((case_) => (
              <GlassCard key={case_.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {case_.title}
                    </h3>
                    <p className="text-justice-light/70 line-clamp-3">
                      {case_.description}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(case_.status)} text-white ml-4`}>
                    {case_.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-justice-light/60 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(case_.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {case_.country}
                  </div>
                  <span>Case #{case_.id.substring(0, 8)}</span>
                </div>

                {case_.verdict && (
                  <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                    <h4 className="text-green-400 font-medium mb-2">AI-Generated Verdict</h4>
                    <p className="text-green-300 text-sm line-clamp-3">{case_.verdict}</p>
                    <p className="text-green-400/70 text-xs mt-2">
                      ⚠️ This verdict is AI-generated and for educational purposes only
                    </p>
                  </div>
                )}

                {case_.verdict_reasoning && (
                  <details className="mt-4">
                    <summary className="text-justice-primary cursor-pointer hover:text-justice-tertiary">
                      View Legal Reasoning
                    </summary>
                    <div className="mt-2 p-4 bg-justice-dark/30 rounded-lg">
                      <p className="text-justice-light text-sm">{case_.verdict_reasoning}</p>
                    </div>
                  </details>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicArchive;
