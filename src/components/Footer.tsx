import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold">ACSP</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              The official digital presence of the Association of Cybersecurity Practitioners. 
              Promoting security, innovation, and professional growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-secondary"><Facebook size={20} /></a>
              <a href="#" className="text-gray-300 hover:text-secondary"><Twitter size={20} /></a>
              <a href="#" className="text-gray-300 hover:text-secondary"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-300 hover:text-secondary"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-secondary inline-block pb-1">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-secondary">About Us</Link></li>
              <li><Link to="/events" className="hover:text-secondary">Events & Conferences</Link></li>
              <li><Link to="/forums" className="hover:text-secondary">Forums</Link></li>
              <li><Link to="/blogs" className="hover:text-secondary">Blogs</Link></li>
              <li><Link to="/contact" className="hover:text-secondary">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-secondary inline-block pb-1">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/services" className="hover:text-secondary">Cybersecurity Training</Link></li>
              <li><Link to="/services" className="hover:text-secondary">Research & Advocacy</Link></li>
              <li><Link to="/services" className="hover:text-secondary">Consulting</Link></li>
              <li><Link to="/services" className="hover:text-secondary">Awareness Programs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-secondary inline-block pb-1">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-secondary mt-0.5" />
                <span>University of Uyo,  Nwaniba Road, Uyo, Akwa Ibom State, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-secondary" />
                <span>+234 8060325776</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-secondary" />
                <span>acsp@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ACSP. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
