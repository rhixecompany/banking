"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

import BistroLogo from "@/assets/svg/bistro-logo";

const menuItems = [
  { title: "Menu", href: "#menu" },
  { title: "Locations", href: "#locations" },
  { title: "About", href: "#about" },
  { title: "Contact", href: "#contact" },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Food Blogger",
    image: "/placeholder-user.jpg",
    content:
      "The best dining experience I've had in years. The atmosphere is incredible and the food is outstanding.",
  },
  {
    name: "James K.",
    role: "Regular Customer",
    image: "/placeholder-user.jpg",
    content:
      "Bistro has become my go-to place for special occasions. The service is impeccable and the menu is diverse.",
  },
  {
    name: "Emily R.",
    role: "Local Resident",
    image: "/placeholder-user.jpg",
    content:
      "Love the weekend brunch here! Fresh ingredients and creative dishes every time.",
  },
];

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Locations", href: "#locations" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function HeroSection() {
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BistroLogo className="size-8" />
            <span className="text-xl font-bold">Bistro</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
            <Button size="sm">Order Now</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16">
        <div className="relative h-[600px] w-full overflow-hidden">
          <Image
            src="/placeholder-hero.jpg"
            alt="Restaurant interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 container pb-12 pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Experience Culinary Excellence
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Discover flavors that inspire. Our chefs craft each dish with
                passion and the finest ingredients.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">View Menu</Button>
                <Button size="lg" variant="outline">
                  Reserve a Table
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            What Our Guests Say
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Hear from our satisfied customers
          </p>

          <div className="mt-12">
            <Carousel
              className="mx-auto max-w-4xl"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col items-center text-center px-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <blockquote className="mt-6 max-w-xl text-lg">
                        &ldquo;{testimonial.content}&rdquo;
                      </blockquote>
                      <div className="mt-4">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      <Separator />

      {/* Footer */}
      <footer className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <BistroLogo className="size-8" />
                <span className="text-xl font-bold">Bistro</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Elevating dining experiences since 2010.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#menu" className="hover:text-foreground">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="#locations" className="hover:text-foreground">
                    Locations
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>123 Gourmet Street</li>
                <li>New York, NY 10001</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Hours</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Mon - Thu: 11am - 10pm</li>
                <li>Fri - Sat: 11am - 11pm</li>
                <li>Sunday: 10am - 9pm</li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <p className="text-center text-sm text-muted-foreground">
            © 2024 Bistro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HeroSection;
