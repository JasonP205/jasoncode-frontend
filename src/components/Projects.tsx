"use client";
import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from '@heroui/react';
import { motion, Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const Projects = () => {
  const featuredProjects = projects.slice(0, 3);

  return (
    <section id="projects" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8"
        >
          <motion.div variants={itemVariants} className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-serif mb-4 sm:mb-6">Dự án tiêu biểu</h2>
            <p className="text-[#6F6F6F] text-base sm:text-lg">
              Tuyển tập những sản phẩm tâm huyết mà tôi đã tham gia thiết kế và phát triển.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link 
              href="/du-an" 
              className="group flex items-center gap-2 text-black font-medium border-b-2 border-black pb-1 hover:opacity-70 transition-all text-sm sm:text-base"
            >
              Xem tất cả dự án <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="group hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Link href={`/du-an/${project.id}`} className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="text-white w-8 h-8" />
                  </Link>
                </div>
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="group-hover:text-black transition-colors">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-4 flex-grow">
                  <CardDescription className="text-[#6F6F6F] leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="px-8 pb-8">
                  <Link href={`/du-an/${project.id}`}>
                    <Button className="px-0">
                      Xem chi tiết dự án
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
