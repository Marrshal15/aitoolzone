import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { styles } from '../../theme';
import { Pagination } from '../../components/Pagination';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ExternalLink,
  Save,
  X,
} from 'lucide-react';
import type { Submission } from '../../types';

// Static data for demo
const initialSubmissions: Submission[] = [
  {
    id: 'sub_1',
    name: 'John Smith',
    email: 'john@example.com',
    tool_name: 'Vision API',
    description: 'Advanced computer vision API for image analysis and object detection',
    api_link: 'https://api.example.com/vision',
    status: 'pending',
    admin_notes: '',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'sub_2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    tool_name: 'NLP Toolkit',
    description: 'Comprehensive natural language processing toolkit with multiple endpoints',
    api_link: 'https://api.example.com/nlp',
    status: 'approved',
    admin_notes: 'Great documentation and API design',
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  },
  {
    id: 'sub_3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    tool_name: 'Speech API',
    description: 'Real-time speech recognition and transcription API',
    api_link: 'https://api.example.com/speech',
    status: 'rejected',
    admin_notes: 'API documentation incomplete',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle
};

const statusButtonStyles = {
  pending: {
    active: 'bg-yellow-500 text-white hover:bg-yellow-600',
    inactive: styles.button.secondary
  },
  approved: {
    active: 'bg-green-500 text-white hover:bg-green-600',
    inactive: styles.button.secondary
  },
  rejected: {
    active: 'bg-red-500 text-white hover:bg-red-600',
    inactive: styles.button.secondary
  }
};

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStatusChange = (submissionId: string, newStatus: Submission['status']) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId ? { 
        ...sub, 
        status: newStatus,
        updated_at: new Date().toISOString()
      } : sub
    ));
  };

  const handleSaveNotes = (submissionId: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId ? { 
        ...sub, 
        admin_notes: noteText,
        updated_at: new Date().toISOString()
      } : sub
    ));
    setEditingNotes(null);
    setNoteText('');
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !searchQuery || 
      submission.tool_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || submission.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="px-4 sm:px-0">
          <h1 className={`${styles.heading.h1} text-gray-900 mb-2`}>
            Submissions
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Review and manage API submissions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(prev => e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedStatus(null)}
                className={`${styles.button.base} ${styles.button.sizes.sm}
                  ${!selectedStatus ? styles.button.primary : styles.button.secondary}`}
              >
                All
              </button>
              {(['pending', 'approved', 'rejected'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`${styles.button.base} ${styles.button.sizes.sm}
                    ${selectedStatus === status ? styles.button.primary : styles.button.secondary}
                    flex items-center gap-1`}
                >
                  {React.createElement(statusIcons[status], { className: 'w-4 h-4' })}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
          {paginatedSubmissions.map((submission) => {
            const StatusIcon = statusIcons[submission.status];
            return (
              <div key={submission.id} className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Submission Content */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <StatusIcon className={`w-5 h-5 ${statusColors[submission.status].split(' ')[1]} flex-shrink-0`} />
                      <h3 className="font-medium text-gray-900 truncate">
                        {submission.tool_name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                     ${statusColors[submission.status]}`}>
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-500 mb-3">
                      <span className="truncate">{submission.name}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{submission.email}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 mb-4 sm:mb-6">
                      {submission.description}
                    </p>

                    {/* Documentation Link */}
                    <div className="mb-4 sm:mb-8">
                      <a
                        href={submission.api_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 px-2 py-1 -ml-2 rounded-md hover:bg-gray-100"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View API Documentation
                      </a>
                    </div>

                    {/* Admin Notes */}
                    {editingNotes === submission.id ? (
                      <div className="mt-4 sm:mt-6">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add admin notes..."
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm
                                   focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                          rows={2}
                        />
                        <div className="mt-2 flex flex-col sm:flex-row justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingNotes(null);
                              setNoteText('');
                            }}
                            className={`${styles.button.base} ${styles.button.secondary} ${styles.button.sizes.sm} w-full sm:w-auto`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(submission.id)}
                            className={`${styles.button.base} ${styles.button.primary} ${styles.button.sizes.sm}
                                      flex items-center justify-center gap-2 w-full sm:w-auto`}
                          >
                            <Save className="w-4 h-4" />
                            Save Notes
                          </button>
                        </div>
                      </div>
                    ) : submission.admin_notes ? (
                      <div className="mt-4 sm:mt-6 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">Admin Notes</h4>
                          <button
                            onClick={() => {
                              setEditingNotes(submission.id);
                              setNoteText(submission.admin_notes || '');
                            }}
                            className="text-sm text-primary-600 hover:text-primary-700 px-2 py-1 rounded-md hover:bg-gray-100"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{submission.admin_notes}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingNotes(submission.id);
                          setNoteText('');
                        }}
                        className="mt-4 sm:mt-6 text-sm text-primary-600 hover:text-primary-700 px-2 py-1 -ml-2 rounded-md hover:bg-gray-100"
                      >
                        Add Notes
                      </button>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex sm:flex-col gap-2 flex-wrap sm:flex-nowrap">
                    {(['approved', 'rejected', 'pending'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(submission.id, status)}
                        className={`${styles.button.base} ${styles.button.sizes.sm}
                                  ${submission.status === status 
                                    ? statusButtonStyles[status].active 
                                    : statusButtonStyles[status].inactive}
                                  flex items-center gap-1`}
                      >
                        {React.createElement(statusIcons[status], { className: 'w-4 h-4' })}
                        {status === 'pending' ? 'Mark Pending' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
