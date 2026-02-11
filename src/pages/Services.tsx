import React from 'react';
import PageHeader from '../components/PageHeader';
import { Shield, BookOpen, Users, Award, Check } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Shield size={48} />,
      title: "Cybersecurity Training",
      description: "Comprehensive training programs designed for all skill levels, from beginners to advanced practitioners.",
      features: ["Hands-on labs", "Industry-recognized curriculum", "Expert instructors", "Flexible learning paths"]
    },
    {
      icon: <BookOpen size={48} />,
      title: "Research & Advocacy",
      description: "Leading research initiatives to address emerging threats and advocating for effective cybersecurity policies.",
      features: ["Policy whitepapers", "Threat intelligence reports", "Academic collaborations", "Regulatory guidance"]
    },
    {
      icon: <Users size={48} />,
      title: "Consulting Services",
      description: "Expert advisory services to help organizations build robust security postures and compliance frameworks.",
      features: ["Security audits", "Risk assessment", "Compliance readiness", "Incident response planning"]
    },
    {
      icon: <Award size={48} />,
      title: "Awareness Programs",
      description: "Public outreach campaigns to educate individuals and businesses on digital safety best practices.",
      features: ["School workshops", "Corporate seminars", "Digital hygiene resources", "Community events"]
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Our Services" 
        subtitle="Empowering individuals and organizations with world-class cybersecurity solutions."
        backgroundImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 p-6 rounded-xl hover:bg-neutral transition-colors border border-gray-100 hover:border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {service.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <Check size={16} className="text-secondary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Need a Custom Solution?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to discuss how we can tailor our services to meet your specific organizational needs.
          </p>
          <button className="bg-secondary hover:bg-secondary-light text-primary font-bold py-3 px-8 rounded-full text-lg transition-colors">
            Request Consultation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;
