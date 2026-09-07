import FadeIn from "./home/FadeIn";
import Hero from "./home/Hero";
import Statistics from "./home/Statistics";
import Services from "./home/Services";
import Projects from "./home/Projects";
import Testimonials from "./home/Testimonials";
import Methods from "./home/Methods";



export default function Home() {
  return (
    <main>
      <FadeIn>
        <Hero />
      </FadeIn>
      <Statistics />
      <Services />
      <Projects />
      <Testimonials />
      <Methods />
    </main>


  );
}