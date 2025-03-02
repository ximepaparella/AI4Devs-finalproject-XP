import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon?: ReactNode;
  onClick?: () => void;
}

export default function StatCard({ title, value, icon, onClick }: StatCardProps) {
  return (
    <div
      className={`bg-white overflow-hidden shadow rounded-lg ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 