"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial as testimonials } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
import { motion } from "framer-motion";

// Reusable scroll-triggered wrapper
function AnimatedSection({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Powerful Features for Your Career Growth
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="h-full border-2 border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 p-4 rounded-lg group">
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "50+", label: "Industries Covered" },
              { value: "1000+", label: "Interview Questions" },
              { value: "95%", label: "Success Rate" },
              { value: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-xl bg-background shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Four simple steps to accelerate your career growth
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 transition-all duration-300 hover:ring-primary/60 hover:bg-primary/20 hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <Card className="h-full bg-background hover:shadow-md transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            width={40}
                            height={40}
                            src={item.image}
                            alt={item.author}
                            className="rounded-full object-cover border-2 border-primary/20"
                            priority={index < 3}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{item.author}</p>
                          <p className="text-sm text-muted-foreground">{item.role}</p>
                          <p className="text-sm text-primary">{item.company}</p>
                        </div>
                      </div>
                      <blockquote>
                        <p className="text-muted-foreground italic relative">
                          <span className="text-3xl text-primary absolute -top-4 -left-2">&quot;</span>
                          {item.quote}
                          <span className="text-3xl text-primary absolute -bottom-4">&quot;</span>
                        </p>
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our platform
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <AnimatedSection>
          <div className="mx-auto py-24 gradient rounded-lg">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter text-black sm:text-4xl md:text-5xl">
                Ready to Accelerate Your Career?
              </h2>
              <p className="mx-auto max-w-[600px] md:text-xl text-black/80">
                Join thousands of professionals who are advancing their careers
                with AI-powered guidance.
              </p>
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  className="h-11 mt-5 bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Start Your Journey Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
