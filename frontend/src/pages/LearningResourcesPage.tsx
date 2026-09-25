import React from 'react';
import { BookOpen, ExternalLink, Clock, Award, Layers } from 'lucide-react';

export const LearningResourcesPage: React.FC = () => {
  const resources = [
    {
      skill: 'REST API',
      title: 'REST API Fundamentals & Design Architecture',
      provider: 'FreeCodeCamp',
      url: 'https://freecodecamp.org/learn/rest-api',
      difficulty: 'Intermediate',
      hours: 12,
      desc: 'Master HTTP methods, status codes, OpenAPI specs, request routing, and payload serialization.'
    },
    {
      skill: 'REST API',
      title: 'Building Production REST APIs with Django REST Framework',
      provider: 'Udemy',
      url: 'https://udemy.com/course/django-rest-api',
      difficulty: 'Advanced',
      hours: 18,
      desc: 'Comprehensive hands-on guide for Serializers, ViewSets, JWT Authentication, and pagination.'
    },
    {
      skill: 'Django',
      title: 'Django Web Development Mastery',
      provider: 'Coursera',
      url: 'https://coursera.org/learn/django-web',
      difficulty: 'Intermediate',
      hours: 20,
      desc: 'Build full backend web applications with ORM models, migration management, and admin interfaces.'
    },
    {
      skill: 'SQL',
      title: 'SQL for Software Developers & Database Schema Design',
      provider: 'Codecademy',
      url: 'https://codecademy.com/learn/sql',
      difficulty: 'Beginner',
      hours: 10,
      desc: 'Queries, indexing, JOINs, transactions, aggregate analysis, and database normalization.'
    },
    {
      skill: 'Git',
      title: 'Git & GitHub Version Control Guide',
      provider: 'YouTube Tech',
      url: 'https://youtube.com/git-tutorial',
      difficulty: 'Beginner',
      hours: 6,
      desc: 'Branching strategies, pull requests, merge conflict resolution, and open-source contribution workflow.'
    },
    {
      skill: 'Docker',
      title: 'Docker & Containerization for Backend Developers',
      provider: 'Docker Docs',
      url: 'https://docs.docker.com/get-started',
      difficulty: 'Intermediate',
      hours: 14,
      desc: 'Dockerfile creation, docker-compose multi-container orchestration, and container networking.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Curated Learning Resources</h1>
            <p className="text-xs text-slate-400">High-impact learning modules mapped directly to identified skill gaps</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  Skill: {res.skill}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {res.hours} Hours
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-white mt-1">{res.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{res.desc}</p>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>Provider: <strong className="text-slate-100">{res.provider}</strong></span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{res.difficulty}</span>
              </div>
            </div>

            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Access Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
