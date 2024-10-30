import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { FaGithub } from "react-icons/fa";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import Globe from "@/components/ui/globe";
import HyperText from "@/components/ui/hyper-text";

export default function Home() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-32 gap-4">
      <Globe className="absolute inset-0 z-0 opacity-45 dark:opacity-25" />
      <HyperText
        className="relative text-8xl font-bold text-black dark:text-white z-10"
        duration={2000}
        text="LinkBin"
      />
      <div className="inline-block text-center justify-center z-10">
        <span className={title()}>Simplify&nbsp;</span>
        <span className={title({ color: "violet" })}>your links&nbsp;</span>
        <br />
        <span className={title()}>and text sharing.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Effortlessly create shortened URLs and share text content with ease.
        </div>
      </div>
      <Button as={Link} color="secondary" href={siteConfig.links.github}>
        <FaGithub className="w-5 h-5" /> View on GitHub
      </Button>
    </section>
  );
}
