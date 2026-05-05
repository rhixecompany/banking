import type { NavigationSection } from "@/components/shadcn-studio/blocks/menu-navigation";

import Header from "@/components/shadcn-studio/blocks/hero-section-41/header";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41";

const navigationData: NavigationSection[] = [
  {
    href: "#",
    title: "About Us",
  },
  {
    href: "#",
    title: "Testimonials",
  },
  {
    href: "#",
    title: "Contact us",
  },
  {
    href: "#",
    title: "Offers",
  },
];

const menudata = [
  {
    id: 1,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-18.png",
    imgAlt: "plate-1",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-56.png",
    userComment:
      "The ambiance is perfect and the food is absolutely delicious. Highly recommended!",
  },
  {
    id: 2,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-19.png",
    imgAlt: "plate-2",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-46.png",
    userComment:
      "Best dining experience in town. The staff is friendly and the menu is exceptional.",
  },
  {
    id: 3,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png",
    imgAlt: "plate-3",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png",
    userComment:
      "Every dish is crafted with care. This place never disappoints!",
  },
  {
    id: 4,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-05.png",
    imgAlt: "plate-4",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-58.png",
    userComment:
      "Great atmosphere and incredible flavors. A must-visit restaurant!",
  },
  {
    id: 5,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png",
    imgAlt: "plate-3",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png",
    userComment:
      "Every dish is crafted with care. This place never disappoints!",
  },
];

const HeroSectionPage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Header Section */}
      <Header navigationData={navigationData} />

      {/* Main Content */}
      <main className="flex flex-col pt-17.5">
        <HeroSection menudata={menudata} />
      </main>
    </div>
  );
};

export default HeroSectionPage;
