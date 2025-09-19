
import { Workflow } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';

const Header = () => (
    <header className="bg-gray-100 border-b border-slate-200 sticky top-0 z-40">
        <nav className=" mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/jobs" className="flex items-center gap-2">
                <div className="bg-purple-900 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-lg"><Workflow className='p-0.5' /></div>
                <span className="text-2xl font-bold text-shadow-lg text-purple-900">TalentFlow</span>
            </Link>
            <div className="flex items-center gap-4">
                <Link to="/jobs" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Jobs</Link>
                <Link to="/candidates" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Candidates</Link>
            </div>
        </nav>
    </header>
);

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};