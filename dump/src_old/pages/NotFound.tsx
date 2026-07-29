import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Home as HomeIcon, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 text-center py-20 space-y-6">
        <Badge variant="cyan" className="mx-auto">
          ✦ 404 • SIGNAL LOST ✦
        </Badge>
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-display font-heading font-extrabold text-slate-100">
          404 Page Not Found
        </h1>
        <p className="text-body text-slate-400">
          The route or signal vector you requested does not exist in this domain structure.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button variant="primary" icon={<HomeIcon className="w-4 h-4" />}>
              Return to Home Base
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
