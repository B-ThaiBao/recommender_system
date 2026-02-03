import React from 'react';
import NewsCard from '../components/NewsCard';

const Home = () => {
    // Mock Data for News Feed
    const newsItems = [
        {
            id: 1,
            title: 'Top Universities for Computer Science in 2024',
            excerpt: 'Discover the leading institutions offering cutting-edge CS programs and research opportunities for aspiring tech leaders.',
            date: 'Oct 15, 2024',
            source: 'EduStats',
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            link: '#'
        },
        {
            id: 2,
            title: 'New Scholarship Opportunities for Engineering Students',
            excerpt: 'The Ministry of Education announces new funding grants for high-achieving students pursuing engineering degrees.',
            date: 'Oct 12, 2024',
            source: 'Ministry of Education',
            imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            link: '#'
        },
        {
            id: 3,
            title: 'Career Trends: Why Data Science is Booming',
            excerpt: 'An in-depth analysis of the job market showing a 40% growth in demand for data professionals over the next 5 years.',
            date: 'Oct 10, 2024',
            source: 'TechWeekly',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            link: '#'
        },
        {
            id: 4,
            title: 'Tips for Acing Your University Entrance Exams',
            excerpt: 'Expert advice and study schedules to help you maximize your score and get into your dream school.',
            date: 'Oct 08, 2024',
            source: 'StudySmart',
            imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            link: '#'
        }
    ];

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-silver-900">Latest News & Admissions</h1>
                <p className="text-silver-500 mt-2">Stay updated with the latest university news, career trends, and admission announcements.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newsItems.map(item => (
                    <NewsCard key={item.id} {...item} />
                ))}
            </div>

            <div className="bg-silver-100 border border-silver-200 rounded-2xl p-8 text-center mt-12 relative overflow-hidden">
                <div className="relative z-10 w-full flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-silver-900 mb-2">Not sure where to start?</h2>
                    <p className="text-silver-600 mb-6 max-w-2xl mx-auto">Take our AI-powered personality quiz to discover career paths and universities that match your unique profile.</p>
                    <button className="bg-silver-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-silver-900 transition-colors shadow-lg">
                        Take the Quiz Now
                    </button>
                </div>
                {/* Decorative pastel blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-pink rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pastel-blue rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
};

export default Home;
