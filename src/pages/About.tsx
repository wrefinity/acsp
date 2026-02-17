import React from 'react';
import PageHeader from '../components/PageHeader';
import ExecutiveMembers from '../components/ExecutiveMembers';
import { CheckCircle, Users, Target, History, Award, Shield, Globe, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <div>
      <PageHeader 
        title="About Us" 
        subtitle="Leading the way in cybersecurity excellence and professional development across Africa."
        backgroundImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />
      
      {/* Who We Are Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Who We Are</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The Association of Cybersecurity Practitioners (ACSP) is a voluntary, non-profit professional association dedicated to advancing cybersecurity practice across Africa. Born from an urgent mission to fortify Africa's digital defenses amid surging cyber threats and exploding digital adoption, ACSP unites academics, industry practitioners, and professionals in a dynamic fusion of theory, hands-on skills, and real-world threat response.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our members represent a diverse community of experts from government, industry, and academia across Nigeria and neighboring African nations, all united by a common goal: to secure the digital world through collaboration, advocacy, and innovation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-secondary mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-primary">Professional Standards</h4>
                    <p className="text-sm text-gray-500">Establishing and maintaining high ethical and technical standards across the continent.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-secondary mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-primary">Knowledge Sharing</h4>
                    <p className="text-sm text-gray-500">Facilitating the exchange of ideas and best practices through monthly seminars and publications.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-secondary mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-primary">Capacity Building</h4>
                    <p className="text-sm text-gray-500">Training the next generation of cybersecurity leaders through intensive practical programs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Cybersecurity professionals in meeting" 
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Cybersecurity conference" 
                className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our History Section - New */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Our History</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <History className="text-secondary mr-3" size={32} />
                <h3 className="text-2xl font-bold text-primary">The ACSP Story</h3>
              </div>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-primary">The Association of Cybersecurity Practitioners (ACSP)</span> was born from an urgent mission to fortify Africa's digital defenses amid surging cyber threats and exploding digital adoption.
                </p>
                
                <p>
                  In 2025, the Virtual Institute for Capacity Building in Higher Education (VICBHE) – a groundbreaking initiative – delivered an intensive 11-week practical cybersecurity training program. Led by experts including <span className="font-semibold">Professor Emeritus Peter Okebukola</span>, this high-impact course attracted over <span className="font-bold text-secondary">4,000 participants</span> from diverse fields across Nigeria and neighboring African nations. It united academics, industry practitioners, and professionals in a dynamic fusion of theory, hands-on skills, and real-world threat response.
                </p>
                
                <p>
                  Inspired by the program's success and the powerful community it forged, participants and facilitators united to create ACSP – a voluntary, non-profit association dedicated to sustaining momentum, elevating professional standards, and tackling Africa's unique cybersecurity challenges through collaboration, advocacy, and innovation.
                </p>
                
                <p>
                  Under the founding leadership of <span className="font-semibold">Professor Emeritus Peter Okebukola</span> and guided by <span className="font-semibold">Professor Isaac Odesola</span> as President, ACSP quickly took shape with a robust executive comprising the President and thirteen other dedicated officers. The association launched monthly seminars, published insightful newsletters, elected visionary executives, and sparked national conversations – from redirecting digital talent toward positive cybersecurity roles to strengthening continental defenses.
                </p>
                
                <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-secondary">
                  <p className="italic text-gray-700">
                    "From a single transformative training cohort to a thriving, continent-spanning network, ACSP empowers practitioners to protect and innovate in cyberspace. Join us in securing Africa's digital tomorrow – one resilient step at a time."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Our Mission & Vision</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral p-6 rounded-xl shadow-md text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Our Mission</h3>
              <p className="text-gray-600 text-sm">To empower cybersecurity professionals through education, certification, and networking, fostering a secure digital ecosystem for all.</p>
            </div>
            
            <div className="bg-neutral p-6 rounded-xl shadow-md text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Our Vision</h3>
              <p className="text-gray-600 text-sm">To be the global authority in cybersecurity practice, setting the benchmark for excellence and integrity in the profession.</p>
            </div>

            <div className="bg-neutral p-6 rounded-xl shadow-md text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Our Values</h3>
              <p className="text-gray-600 text-sm">Integrity, collaboration, innovation, and excellence in everything we do to secure Africa's digital future.</p>
            </div>

            <div className="bg-neutral p-6 rounded-xl shadow-md text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Our Impact</h3>
              <p className="text-gray-600 text-sm">From 4,000+ trained professionals to continent-wide partnerships, building resilient cybersecurity capacity across Africa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Milestones Section */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Key Milestones</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20 hidden md:block"></div>
              
              <div className="space-y-8">
                {/* Milestone 1 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-primary mb-2">2025</h3>
                      <p className="text-gray-600">VICBHE delivers intensive 11-week practical cybersecurity training with over 4,000 participants across Nigeria and neighboring African nations.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold z-10 my-4 md:my-0">1</div>
                  <div className="md:w-1/2 md:pl-8"></div>
                </div>

                {/* Milestone 2 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-8"></div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold z-10 my-4 md:my-0">2</div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-primary mb-2">2025</h3>
                      <p className="text-gray-600">ACSP founded by program participants and facilitators, led by Professor Emeritus Peter Okebukola and President Professor Isaac Odesola.</p>
                    </div>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-primary mb-2">2025</h3>
                      <p className="text-gray-600">Robust executive formed with President and thirteen dedicated officers. Monthly seminars and newsletters launched.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold z-10 my-4 md:my-0">3</div>
                  <div className="md:w-1/2 md:pl-8"></div>
                </div>

                {/* Milestone 4 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-8"></div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold z-10 my-4 md:my-0">4</div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-primary mb-2">Present</h3>
                      <p className="text-gray-600">Thriving continent-spanning network empowering practitioners to protect and innovate in cyberspace across Africa.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Leadership Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Founding Leadership</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-neutral p-8 rounded-xl shadow-lg text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Professor Emeritus Peter Okebukola</h3>
              <p className="text-secondary font-semibold mb-4">Founding Leader</p>
              <p className="text-gray-600 text-sm">Distinguished professor and pioneer in cybersecurity education, leading the transformative VICBHE training program that inspired ACSP's formation.</p>
            </div>

            <div className="bg-neutral p-8 rounded-xl shadow-lg text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Professor Isaac Odesola</h3>
              <p className="text-secondary font-semibold mb-4">President</p>
              <p className="text-gray-600 text-sm">Visionary leader guiding ACSP's mission to elevate professional standards and tackle Africa's unique cybersecurity challenges through collaboration and innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Members Section */}
      <ExecutiveMembers />

    </div>
  );
};

export default About;