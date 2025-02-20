import React from 'react';
import { ArrowRight, BookOpen, Brain, CheckCircle, FileSearch, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import HeroImage from "@/public/home-hero.svg";

const features = [
  {
    icon: <Brain className="w-6 h-6 text-indigo-600" />,
    title: "AI-Powered Analysis",
    description: "Advanced NLP algorithms analyze project proposals to detect similarities with existing submissions."
  },
  {
    icon: <Shield className="w-6 h-6 text-indigo-600" />,
    title: "Plagiarism Prevention",
    description: "Automatically identifies and prevents duplicate project submissions to maintain academic integrity."
  },
  {
    icon: <FileSearch className="w-6 h-6 text-indigo-600" />,
    title: "Smart Search",
    description: "Find similar projects and ideas to inspire innovation while avoiding duplication."
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-indigo-600" />,
    title: "Automated Verification",
    description: "Streamlined verification process with customizable similarity thresholds."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4 mb-16 md:w-1/2 md:mb-0">
              <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Ensure Project Originality with AI-Powered Similarity Detection
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                Maintain academic integrity and foster innovation with our advanced project similarity checker. 
                Perfect for educational institutions, research organizations, and innovation hubs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/session"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2">
              <div className="relative">
                <Image
                  src={HeroImage}
                  alt="AI Analysis"
                  width={600}
                  height={400}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Powerful Features for Project Verification
            </h2>
            <p className="text-lg text-gray-600">
              Our comprehensive solution helps maintain academic integrity while fostering innovation
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to Ensure Project Originality?
          </h2>
          <p className="mb-8 text-lg text-indigo-100">
            Join institutions worldwide in maintaining academic integrity
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-600 bg-white border border-transparent rounded-md shadow-sm hover:bg-indigo-50"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}