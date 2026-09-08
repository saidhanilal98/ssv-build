import Hero from "../services/Hero";
import PropManagementServices from "../services/PropManagementServices";
import Projects from "../home/Projects";
import Testimonials from "../home/Testimonials";
import { getServicesPageContent } from "../../../lib/payload/content/services-page";
import { getHomePageContent } from "../../../lib/payload/content/home";
import { getServices } from "../../../lib/payload/content/services";
import { getProjects } from "../../../lib/payload/content/projects";
import { getTestimonials } from "../../../lib/payload/content/testimonials";

export default async function Services() {
  const [content, homeContent, services, projects, testimonials] = await Promise.all([
    getServicesPageContent(),
    getHomePageContent(),
    getServices(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <main>
      <Hero {...content.hero} />
      <PropManagementServices {...content.servicesSection} services={services} />
      <Projects {...homeContent.projectsSection} projects={projects} />
      <Testimonials {...homeContent.testimonialsSection} testimonials={testimonials} />
    </main>


  );
}
