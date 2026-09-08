import Hero from "../contact/Hero";
import ContactDetails from "../contact/ContactDetails";
import { getContactPageContent } from "../../../lib/payload/content/contact";

export default async function Home() {
    const content = await getContactPageContent();

    return (
        <main>
            <Hero {...content.hero} />
            <ContactDetails {...content.details} />
        </main>

    );
}