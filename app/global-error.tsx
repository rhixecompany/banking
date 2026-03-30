"use client";

import NextError from "next/error";
/**
 * Description placeholder
 *
 * @export
 * @returns {*}
 */

export default function GlobalError(): JSX.Element {
  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
