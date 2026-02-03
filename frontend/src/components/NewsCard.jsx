import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';

const NewsCard = ({ title, excerpt, date, source, imageUrl, link }) => {
    return (
        <div className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-pastel-pink/20 transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-silver-700 shadow-sm">
                    {source}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-silver-400 mb-3 font-medium uppercase tracking-wide">
                    <Calendar className="w-3 h-3" />
                    <span>{date}</span>
                </div>

                <h3 className="text-lg font-bold text-silver-800 mb-2 line-clamp-2 leading-tight group-hover:text-pastel-pinkDeep transition-colors">
                    {title}
                </h3>

                <p className="text-silver-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {excerpt}
                </p>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-silver-600 text-sm font-semibold hover:gap-2 transition-all group-hover:text-pastel-pinkDeep"
                >
                    Read Full Article <ExternalLink className="w-3 h-3 ml-1" />
                </a>
            </div>
        </div>
    );
};

export default NewsCard;
