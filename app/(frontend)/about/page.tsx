import Hero from "./Hero";
import VisionMission from "./VisionMission";
import Timeline from "./Timeline";
import Certifications from "./Certfications";
import Methods from "../home/Methods";
import { getAboutPageContent } from "../../../lib/payload/content/about";
import { getHomePageContent } from "../../../lib/payload/content/home";
import { getCertifications } from "../../../lib/payload/content/certifications";

export default async function About() {
    const [content, homeContent, certifications] = await Promise.all([
        getAboutPageContent(),
        getHomePageContent(),
        getCertifications(),
    ]);

    return (
        <main>

            <Hero {...content.hero} />
            <VisionMission {...content.visionMission} />
            <Timeline {...content.timeline} />
            <Certifications {...content.certificationsIntro} certifications={certifications} />
            <Methods {...homeContent.methodsSection} />

        </main>


    );
}
