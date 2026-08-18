import FadeIn from "./Home/FadeIn";
import Hero from "./Home/Hero";
import Statistics from "./Home/Statistics";
import Services from "./Home/Services";
import Projects from "./Home/Projects";
import Testimonials from "./Home/Testimonials";
import Methods from "./Home/Methods";



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