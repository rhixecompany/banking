import BlogComponent01 from "@/components/shadcn-studio/blocks/blog-component-01/blog-component-01";

/**
 * Server wrapper for the Blog Component 01 shadcn-studio block.
 *
 * @export
 * @returns {JSX.Element}
 */
export function BlogComponent01ServerWrapper(): JSX.Element {
  return (
    <BlogComponent01
      blogCards={[
        {
          alt: "Banking trends",
          blogLink: "/blog/banking-trends",
          description: "Discover the latest trends shaping modern banking.",
          img: "/images/blog/banking-trends.jpg",
          title: "Banking Trends 2025",
        },
        {
          alt: "Personal finance tips",
          blogLink: "/blog/personal-finance",
          description:
            "Practical tips to manage and grow your personal finances.",
          img: "/images/blog/personal-finance.jpg",
          title: "Personal Finance Tips",
        },
        {
          alt: "Digital payments",
          blogLink: "/blog/digital-payments",
          description:
            "How digital payments are transforming everyday transactions.",
          img: "/images/blog/digital-payments.jpg",
          title: "Digital Payments Overview",
        },
      ]}
    />
  );
}
