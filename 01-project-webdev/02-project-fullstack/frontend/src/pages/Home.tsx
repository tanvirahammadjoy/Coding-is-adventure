import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to FullStack Boilerplate
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A modern, production-ready full-stack application template
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Modern Tech Stack',
                description: 'Built with React, TypeScript, Node.js, Express, and MongoDB',
              },
              {
                title: 'Authentication',
                description: 'Secure JWT-based authentication with bcrypt password hashing',
              },
              {
                title: 'Responsive Design',
                description: 'Beautiful UI with TailwindCSS, optimized for all devices',
              },
              {
                title: 'Type Safety',
                description: 'Full TypeScript support for better development experience',
              },
              {
                title: 'API Ready',
                description: 'RESTful API with proper validation and error handling',
              },
              {
                title: 'Easy to Customize',
                description: 'Clean code structure ready for your next project',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
