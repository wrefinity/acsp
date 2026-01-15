import React from 'react';
import PageHeader from '../components/PageHeader';
import { CheckCircle, Users, Target, History } from 'lucide-react';

const About = () => {
  return (
    <div>
      <PageHeader 
        title="About Us" 
        subtitle="Leading the way in cybersecurity excellence and professional development."
        backgroundImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Who We Are</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The Association of Cybersecurity Practitioners (ACSP) is a non-profit professional organization dedicated to the advancement of the cybersecurity profession. Established in 2020, we serve as a hub for security professionals, researchers, and policymakers to collaborate, share knowledge, and drive innovation.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our members represent a diverse community of experts from government, industry, and academia, all united by a common goal: to secure the digital world.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-secondary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary">Professional Standards</h4>
                    <p className="text-sm text-gray-500">Establishing and maintaining high ethical and technical standards.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-secondary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary">Knowledge Sharing</h4>
                    <p className="text-sm text-gray-500">Facilitating the exchange of ideas and best practices.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-secondary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary">Capacity Building</h4>
                    <p className="text-sm text-gray-500">Training the next generation of cybersecurity leaders.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Meeting" className="rounded-lg shadow-lg w-full h-64 object-cover" />
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Conference" className="rounded-lg shadow-lg w-full h-64 object-cover mt-8" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Our Mission & Vision</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-gray-600">To empower cybersecurity professionals through education, certification, and networking, fostering a secure digital ecosystem for all.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-gray-600">To be the global authority in cybersecurity practice, setting the benchmark for excellence and integrity in the profession.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <History size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Our History</h3>
              <p className="text-gray-600">Founded in 2020 by a group of visionary security experts, ACSP has grown from a small working group to a national organization.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
