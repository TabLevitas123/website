import React, { memo, useState, useEffect } from 'react';
import { AlertCircle, Check, Filter, Download, Trash2 } from 'lucide-react';

const MutationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  BATCH: 'batch'
};

const MutationEntry = memo(({ mutation, onClick }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case MutationType.CREATE:
        return 'text-green-500';
      case MutationType.UPDATE:
        return 'text-yellow-500';
      case MutationType.DELETE:
        return 'text-red-500';
      case MutationType.BATCH:
        return 'text-purple-500';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case MutationType.CREATE:
        return <Check className="w-4 h-4 text-green-500" />;
      case MutationType.UPDATE:
        return <Filter className="w-4 h-4 text-yellow-500" />;
      case MutationType.DELETE:
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case MutationType.BATCH:
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          {getTypeIcon(mutation.type)}
          <span className={`text-sm font-medium ${getTypeColor(mutation.type)}`}>
            {mutation.type.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(mutation.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="text-sm text-gray-300 mb-1">
        {mutation.componentName}
      </div>
      <div className="text-xs text-gray-400 font-mono">
        {mutation.path.join(' → ')}
      </div>
    </div>
  );
});

MutationEntry.displayName = 'MutationEntry';

const StateMutationLogger = ({
  mutations = [],
  onMutationSelect,
  onClearMutations,
  onExportMutations
}) => {
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMutations = mutations.filter(mutation => {
    const matchesSearch = mutation.componentName.toLowerCase().includes(filter.toLowerCase()) ||
                         mutation.path.join(' ').toLowerCase().includes(filter.toLowerCase());
    const matchesType = typeFilter === 'all' || mutation.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getMutationStats = () => {
    return {
      total: mutations.length,
      create: mutations.filter(m => m.type === MutationType.CREATE).length,
      update: mutations.filter(m => m.type === MutationType.UPDATE).length,
      delete: mutations.filter(m => m.type === MutationType.DELETE).length,
      batch: mutations.filter(m => m.type === MutationType.BATCH).length,
    };
  };

  const stats = getMutationStats();

  return (
    <div className="h-full flex flex-col">
      {/* Header with filters */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter mutations..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white placeholder-gray-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
          >
            <option value="all">All Types</option>
            <option value={MutationType.CREATE}>Create</option>
            <option value={MutationType.UPDATE}>Update</option>
            <option value={MutationType.DELETE}>Delete</option>
            <option value={MutationType.BATCH}>Batch</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">Total</div>
            <div className="text-xl font-semibold text-white">{stats.total}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Create</div>
            <div className="text-xl font-semibold text-green-500">{stats.create}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Update</div>
            <div className="text-xl font-semibold text-yellow-500">{stats.update}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Delete</div>
            <div className="text-xl font-semibold text-red-500">{stats.delete}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Batch</div>
            <div className="text-xl font-semibold text-purple-500">{stats.batch}</div>
          </div>
        </div>
      </div>

      {/* Mutations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMutations.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No mutations found
          </div>
        ) : (
          filteredMutations.map((mutation) => (
            <MutationEntry
              key={mutation.id}
              mutation={mutation}
              onClick={() => onMutationSelect(mutation)}
            />
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800 flex justify-between">
        <button
          onClick={onClearMutations}
          className="text-sm text-gray-400 hover:text-white flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
        <button
          onClick={onExportMutations}
          className="text-sm text-gray-400 hover:text-white flex items-center space-x-1"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default memo(StateMutationLogger);