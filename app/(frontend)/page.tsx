import FadeIn from "./home/FadeIn";
import Hero from "./home/Hero";
import Statistics from "./home/Statistics";
import Services from "./home/Services";
import Projects from "./home/Projects";
import Testimonials from "./home/Testimonials";
import Methods from "./home/Methods";
import { getHomePageContent } from "../../lib/payload/content/home";
import { getServices } from "../../lib/payload/content/services";
import { getProjects } from "../../lib/payload/content/projects";
import { getTestimonials } from "../../lib/payload/content/testimonials";

export default async function Home() {
  const [content, services, projects, testimonials] = await Promise.all([
    getHomePageContent(),
    getServices(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <main>
      <FadeIn>
        <Hero {...content.hero} />
      </FadeIn>
      <Statistics statistics={content.statistics} />
      <Services {...content.servicesSection} services={services.filter((service) => service.showOnHomePage)} />
      <Projects {...content.projectsSection} projects={projects} />
      <Testimonials {...content.testimonialsSection} testimonials={testimonials} />
      <Methods {...content.methodsSection} />
    </main>


  );
}
