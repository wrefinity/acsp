import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Shield, BookOpen, Users, Award } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const { data: announcements, loading: announcementsLoading, error: announcementsError } = useApi(contentAPI.getAnnouncements);
  const { data: events, loading: eventsLoading, error: eventsError } = useApi(contentAPI.getEvents);

  return (
    <div className="flex flex-col">
      <HeroCarousel />

      {/* Announcements Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Latest Announcements</h2>
              <div className="h-1 w-20 bg-secondary"></div>
            </div>
            <Link to="/announcements" className="text-primary hover:text-secondary flex items-center font-medium">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {announcementsLoading && (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner />
            </div>
          )}

          {announcementsError && (
            <div className="text-center py-10 text-red-500">
              <p>Error loading announcements: {announcementsError}</p>
            </div>
          )}

          {!announcementsLoading && !announcementsError && announcements && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.slice(0, 3).map((item: any) => (
                <div key={item._id || item.id} className="bg-neutral p-6 rounded-lg border-l-4 border-secondary hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-semibold">{item.category}</span>
                    <span className="text-gray-500 text-sm">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Link to={`/announcements/${item._id || item.id}`} className="text-secondary hover:text-secondary-light font-medium text-sm">Read More</Link>
                </div>
              ))}
            </div>
          )}

          {!announcementsLoading && !announcementsError && (!announcements || announcements.length === 0) && (
            <div className="text-center py-10 text-gray-500">
              <p>No announcements available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">About ACSP</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The Association of Cybersecurity Practitioners (ACSP) is the premier professional body dedicated to advancing the field of cybersecurity. We bring together experts, researchers, and practitioners to foster innovation, establish standards, and promote a secure digital future.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Users className="text-secondary h-8 w-8" />
                  <div>
                    <span className="block text-2xl font-bold">5000+</span>
                    <span className="text-sm text-gray-400">Members</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="text-secondary h-8 w-8" />
                  <div>
                    <span className="block text-2xl font-bold">50+</span>
                    <span className="text-sm text-gray-400">Certifications</span>
                  </div>
                </div>
              </div>
              <Link to="/about" className="bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary font-bold py-3 px-8 rounded-full transition-colors">
                Learn More About Us
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute -inset-4 bg-secondary/20 rounded-lg transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Cybersecurity Professionals" 
                className="relative rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Upcoming Events</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Join our conferences, workshops, and seminars to stay ahead in the rapidly evolving world of cybersecurity.</p>
          </div>

          {eventsLoading && (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner />
            </div>
          )}

          {eventsError && (
            <div className="text-center py-10 text-red-500">
              <p>Error loading events: {eventsError}</p>
            </div>
          )}

          {!eventsLoading && !eventsError && events && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.slice(0, 2).map((event: any) => (
                <div key={event._id || event.id} className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row">
                  <div className="bg-primary text-white p-6 flex flex-col justify-center items-center md:w-1/3 text-center">
                    <Calendar size={32} className="mb-2 text-secondary" />
                    <span className="text-sm font-bold opacity-80">{event.type}</span>
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-1 font-medium">{event.date}</p>
                    <p className="text-gray-500 text-sm mb-4">{event.venue}</p>
                    <Link to="/events" className="text-secondary font-bold hover:underline">Register Now</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!eventsLoading && !eventsError && (!events || events.length === 0) && (
            <div className="text-center py-10 text-gray-500">
              <p>No events available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link to="/events" className="inline-flex items-center text-primary font-bold hover:text-secondary transition-colors">
              View All Events <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Our Services</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield size={40} />, title: "Training", desc: "Professional cybersecurity training and certification programs." },
              { icon: <BookOpen size={40} />, title: "Research", desc: "Cutting-edge research and policy advocacy for digital security." },
              { icon: <Users size={40} />, title: "Consulting", desc: "Expert security consulting for organizations and governments." },
              { icon: <Award size={40} />, title: "Awareness", desc: "Public awareness campaigns on digital safety and hygiene." }
            ].map((service, idx) => (
              <div key={idx} className="text-center p-6 rounded-lg hover:bg-neutral transition-colors group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/5 text-primary mb-6 group-hover:bg-primary group-hover:text-secondary transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Community?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Become a member of ACSP today and gain access to exclusive resources, networking opportunities, and professional development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-secondary hover:bg-secondary-light text-primary font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
              Become a Member
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white font-bold py-3 px-8 rounded-full text-lg transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
