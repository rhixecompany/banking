import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Description placeholder
 *
 * @typedef {BlogCard}
 */
type BlogCard = {
  img: string;
  alt: string;
  title: string;
  description: string;
  blogLink: string;
}[];

/**
 * Description placeholder
 *
 * @param {{ blogCards: BlogCard }} param0
 * @param {{}} param0.blogCards
 * @returns {*}
 */
const Blog = ({ blogCards }: { blogCards: BlogCard }): JSX.Element => {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <p className="text-sm font-medium text-primary uppercase">
            Blog list
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Plan your upcoming journey.
          </h2>
          <p className="text-xl text-muted-foreground">
            Explore new destinations, indulge in local cuisines, and immerse
            yourself in diverse cultures.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogCards.map((item, index) => (
            <Card
              className="pt-0 shadow-none max-lg:last:col-span-full"
              key={index}
            >
              <CardContent className="px-0">
                <Image
                  src={item.img}
                  alt={item.alt}
                  width={640}
                  height={360}
                  className="aspect-video h-60 w-full rounded-t-xl object-cover"
                />
              </CardContent>
              <CardHeader className="mb-2 gap-3">
                <CardTitle className="text-xl">
                  <a href={item.blogLink}>{item.title}</a>
                </CardTitle>
                <CardDescription className="text-base">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  className="group rounded-lg text-base has-[>svg]:px-6"
                  size="lg"
                  asChild
                >
                  <a href={item.blogLink}>
                    Read More
                    <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
