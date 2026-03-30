import Blog from "@/components/shadcn-studio/blocks/blog-component-01/blog-component-01";

const blogCards = [
  {
    alt: "Modern house",
    blogLink: "#",
    description:
      "Experience the charm of this lovely and cozy apartment, featuring warm decor and inviting spaces, perfect for relaxation and comfort, ideal for your next getaway.",
    img: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-1.png",
    title: "Laws of Transfer of Immovable Property",
  },
  {
    alt: "Traditional house",
    blogLink: "#",
    description:
      "Discover a unique nook in the heart of the city, offering convenience and access to attractions. Stylishly designed, it provides a comfortable retreat.",
    img: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-2.png",
    title: "Thane Development Plan 2026 & Master Plan",
  },
  {
    alt: "Modern house with pool",
    blogLink: "#",
    description:
      "Welcome to this charming independent house bedroom, featuring a spacious layout and cozy furnishings. Enjoy abundant natural light and peaceful.",
    img: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-3.png",
    title: "What is a Property Sale Agreement?",
  },
];

const BlogPage = (): JSX.Element => {
  return <Blog blogCards={blogCards} />;
};

export default BlogPage;
