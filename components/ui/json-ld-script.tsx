interface JsonLdScriptProps {
  data: object;
}

/** Renders a JSON-LD structured data <script> tag for search engine consumption. */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
