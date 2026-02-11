import React, { useState, useEffect } from 'react';
import { executiveService, ExecutiveMember } from '../services/executiveService';

interface ExecutiveMembersProps {
  limit?: number;
}

const ExecutiveMembers: React.FC<ExecutiveMembersProps> = ({ limit }) => {
  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const data = await executiveService.getExecutives();
        // Only show active executives and sort by order
        const activeExecutives = data.filter(ex => ex.isActive).sort((a, b) => a.order - b.order);
        setExecutives(limit ? activeExecutives.slice(0, limit) : activeExecutives);
      } catch (err) {
        setError('Failed to load executive members');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutives();
  }, [limit]);

  if (loading) {
    return <div className="text-center py-8">Loading executive members...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (executives.length === 0) {
    return <div className="text-center py-8">No executive members found.</div>;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {executives.map((executive) => (
            <div 
              key={executive._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative">
                <img 
                  src={executive.imageUrl} 
                  alt={executive.name}
                  className="w-32 h-32 rounded-full mx-auto mt-6 border-4 border-secondary object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary">{executive.name}</h3>
                <p className="text-secondary font-medium mb-3">{executive.position}</p>
                <p className="text-gray-600 text-sm">{executive.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveMembers;