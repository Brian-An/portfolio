"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as motion from "motion/react-client";
import { socialLinks } from "@/constants/socials";

export default function Socials() {
  return (
    <div className="flex gap-2">
      {socialLinks.map((social, index) => (
        <motion.div
          key={social.href}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.4 + index * 0.1,
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button asChild variant="outline">
            <Link href={social.href} target="_blank">
              <social.icon />
            </Link>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
