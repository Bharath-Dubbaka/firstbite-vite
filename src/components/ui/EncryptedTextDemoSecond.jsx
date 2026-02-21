import { EncryptedText } from "./encrypted-text";
import React from "react";

export function EncryptedTextDemoSecond() {
   return (
      <p className="mx-auto max-w-lg py-10 text-left">
         <EncryptedText
            text="LOVE AT FIRSTBYTE."
            encryptedClassName="text-neutral-500"
            revealedClassName="dark:text-white text-black"
            revealDelayMs={50}
         />
      </p>
   );
}
