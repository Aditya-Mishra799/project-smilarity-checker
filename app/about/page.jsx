import React from 'react';
import { BookOpen, Brain, FileSearch, Settings, Share2, Shield } from 'lucide-react';
import Image from 'next/image';
import HeroImage from "@/public/hero-about.svg";

const AboutPage = () => {
  const workingSteps = [
    {
      icon: <FileSearch className="w-8 h-8 text-indigo-600" />,
      title: "Project Submission",
      description: "Users submit their project proposals including title and abstract through our intuitive interface."
    },
    {
      icon: <Brain className="w-8 h-8 text-indigo-600" />,
      title: "NLP Processing",
      description: "Our system uses advanced Natural Language Processing to analyze the content and generate semantic embeddings."
    },
    {
      icon: <Share2 className="w-8 h-8 text-indigo-600" />,
      title: "Similarity Analysis",
      description: "The system compares the new proposal with existing projects using cosine similarity algorithms."
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Automated Decision",
      description: "Based on configurable similarity thresholds, the system automatically accepts or flags potential duplicates."
    }
  ];

  const features = [
    {
      title: "Customizable Thresholds",
      description: "Set specific similarity thresholds based on your institution's requirements."
    },
    {
      title: "Bulk Processing",
      description: "Upload and analyze multiple projects simultaneously for efficient processing."
    },
    {
      title: "Detailed Reports",
      description: "Get comprehensive similarity reports with percentage matches and source references."
    },
    {
      title: "Real-time Results",
      description: "Instant feedback on project similarity with existing submissions."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900">
              How Our Project Similarity Checker Works
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Using advanced AI and NLP technology to ensure project originality and maintain academic integrity
            </p>
            <Image
              src={HeroImage}
              alt="Project Analysis"
              width={600}
              height={400}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Working Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Our Working Process
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workingSteps.map((step, index) => (
              <div
                key={index}
                className="relative p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {index < workingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                    <Settings className="w-6 h-6 animate-spin" />
                  </div>
                )}
                <div className="mb-4">{step.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
              Technical Implementation
            </h2>
            <div className="p-6 bg-indigo-50 rounded-lg space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-indigo-900">Text Processing</h3>
                <p className="text-indigo-800">
                  Projects are processed using advanced NLP techniques to extract meaningful features from titles and abstracts.
                  The text is tokenized, cleaned, and converted into vector representations using state-of-the-art embedding models.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-indigo-900">Similarity Computation</h3>
                <p className="text-indigo-800">
                  We use cosine similarity metrics to compare project vectors, providing a similarity score between 0 and 1.
                  This allows for accurate detection of similar projects while accounting for semantic meaning.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-indigo-900">Automated Decision Making</h3>
                <p className="text-indigo-800">
                  Configurable thresholds determine automatic acceptance or rejection. Projects exceeding the similarity threshold
                  are flagged for review, ensuring thorough verification of potential duplicates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;