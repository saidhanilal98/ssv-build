import Hero from "../services/Hero";
import PropManagementServices from "../services/PropManagementServices";
import Projects from "../home/Projects";
import Testimonials from "../home/Testimonials";



export default function Services() {
  return (
    <main>
      <Hero />
      <PropManagementServices />
      <Projects />
      <Testimonials />
    </main>


  );
}