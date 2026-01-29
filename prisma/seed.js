// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create Admin User
  console.log('Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.admin.upsert({
    where: { email: 'admin@alimswrite.com' },
    update: {},
    create: {
      email: 'admin@alimswrite.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('Admin user created: admin@alimswrite.com / admin123')

  // Create Site Settings
  console.log('Creating site settings...')
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: 'AlimsWrite',
      tagline: 'Your Academic Writing Partner',
      whatsappNumber: '09039611238',
      email: 'contact@alimswrite.com',
      metaTitle: 'AlimsWrite - Professional Academic Writing Services in Nigeria',
      metaDescription: 'Get quality project writing, thesis, dissertation, data analysis, and research services. Trusted by students across Nigerian universities.',
      primaryColor: '#1E3A8A',
      secondaryColor: '#F59E0B',
      chatEnabled: true,
      popupEnabled: true,
      chatTimeout: 60,
    },
  })

  // Create Faculties
  console.log('Creating faculties...')
  const facultiesData = [
    { name: 'Agriculture & Life Sciences', slug: 'agriculture-life-sciences', order: 1 },
    { name: 'Arts & Humanities', slug: 'arts-humanities', order: 2 },
    { name: 'Education', slug: 'education', order: 3 },
    { name: 'Engineering & Technology', slug: 'engineering-technology', order: 4 },
    { name: 'Environmental Sciences', slug: 'environmental-sciences', order: 5 },
    { name: 'Law', slug: 'law', order: 6 },
    { name: 'Management Sciences', slug: 'management-sciences', order: 7 },
    { name: 'Medicine & Health Sciences', slug: 'medicine-health-sciences', order: 8 },
    { name: 'Pure & Applied Sciences', slug: 'pure-applied-sciences', order: 9 },
    { name: 'Social Sciences', slug: 'social-sciences', order: 10 },
  ]

  const faculties = {}
  for (const faculty of facultiesData) {
    const created = await prisma.faculty.upsert({
      where: { slug: faculty.slug },
      update: {},
      create: faculty,
    })
    faculties[faculty.slug] = created.id
  }

  // Create Departments
  console.log('Creating departments...')
  const departmentsData = [
    // Agriculture & Life Sciences
    { name: 'Agriculture', slug: 'agriculture', faculty: 'agriculture-life-sciences', aliases: ['agricultural science', 'general agriculture', 'agric'] },
    { name: 'Agricultural Economics', slug: 'agricultural-economics', faculty: 'agriculture-life-sciences', aliases: ['agric economics', 'agricultural econs'] },
    { name: 'Agricultural Engineering', slug: 'agricultural-engineering', faculty: 'agriculture-life-sciences', aliases: ['agric engineering'] },
    { name: 'Agricultural Extension', slug: 'agricultural-extension', faculty: 'agriculture-life-sciences', aliases: ['agric extension'] },
    { name: 'Animal Science', slug: 'animal-science', faculty: 'agriculture-life-sciences', aliases: ['animal production', 'animal husbandry'] },
    { name: 'Crop Science', slug: 'crop-science', faculty: 'agriculture-life-sciences', aliases: ['crop production', 'agronomy'] },
    { name: 'Fisheries', slug: 'fisheries', faculty: 'agriculture-life-sciences', aliases: ['fisheries and aquaculture', 'aquaculture'] },
    { name: 'Food Science & Technology', slug: 'food-science-technology', faculty: 'agriculture-life-sciences', aliases: ['food tech', 'food science'] },
    { name: 'Forestry', slug: 'forestry', faculty: 'agriculture-life-sciences', aliases: ['forestry and wildlife', 'forest management'] },
    { name: 'Soil Science', slug: 'soil-science', faculty: 'agriculture-life-sciences', aliases: ['soil science and land management'] },

    // Arts & Humanities
    { name: 'English Language', slug: 'english-language', faculty: 'arts-humanities', aliases: ['english', 'english studies', 'english and literary studies'] },
    { name: 'History', slug: 'history', faculty: 'arts-humanities', aliases: ['history and diplomatic studies', 'historical studies'] },
    { name: 'Philosophy', slug: 'philosophy', faculty: 'arts-humanities', aliases: ['philosophy studies'] },
    { name: 'Religious Studies', slug: 'religious-studies', faculty: 'arts-humanities', aliases: ['religion', 'christian religious studies', 'islamic studies'] },
    { name: 'Linguistics', slug: 'linguistics', faculty: 'arts-humanities', aliases: ['linguistics and african languages'] },
    { name: 'Theatre Arts', slug: 'theatre-arts', faculty: 'arts-humanities', aliases: ['dramatic arts', 'performing arts', 'theatre and film studies'] },
    { name: 'Music', slug: 'music', faculty: 'arts-humanities', aliases: ['music studies', 'musicology'] },
    { name: 'Fine Arts', slug: 'fine-arts', faculty: 'arts-humanities', aliases: ['fine and applied arts', 'creative arts'] },
    { name: 'French', slug: 'french', faculty: 'arts-humanities', aliases: ['french studies', 'french language'] },
    { name: 'Mass Communication', slug: 'mass-communication', faculty: 'arts-humanities', aliases: ['journalism', 'media studies', 'communication studies'] },

    // Education
    { name: 'Educational Administration', slug: 'educational-administration', faculty: 'education', aliases: ['educational management', 'education admin'] },
    { name: 'Guidance and Counseling', slug: 'guidance-counseling', faculty: 'education', aliases: ['counseling psychology', 'educational guidance'] },
    { name: 'Physical Education', slug: 'physical-education', faculty: 'education', aliases: ['physical and health education', 'human kinetics'] },
    { name: 'Science Education', slug: 'science-education', faculty: 'education', aliases: ['integrated science education'] },
    { name: 'Computer Education', slug: 'computer-education', faculty: 'education', aliases: ['computer science education'] },
    { name: 'Adult Education', slug: 'adult-education', faculty: 'education', aliases: ['adult and continuing education'] },
    { name: 'Early Childhood Education', slug: 'early-childhood-education', faculty: 'education', aliases: ['nursery education', 'primary education'] },
    { name: 'Library Science', slug: 'library-science', faculty: 'education', aliases: ['library and information science', 'librarianship'] },
    { name: 'Technical Education', slug: 'technical-education', faculty: 'education', aliases: ['vocational education', 'technology education'] },

    // Engineering & Technology
    { name: 'Civil Engineering', slug: 'civil-engineering', faculty: 'engineering-technology', aliases: ['civil eng', 'structural engineering'] },
    { name: 'Mechanical Engineering', slug: 'mechanical-engineering', faculty: 'engineering-technology', aliases: ['mechanical eng', 'mech eng'] },
    { name: 'Electrical Engineering', slug: 'electrical-engineering', faculty: 'engineering-technology', aliases: ['electrical eng', 'electrical electronics', 'electronics engineering'] },
    { name: 'Computer Engineering', slug: 'computer-engineering', faculty: 'engineering-technology', aliases: ['computer eng', 'comp eng'] },
    { name: 'Chemical Engineering', slug: 'chemical-engineering', faculty: 'engineering-technology', aliases: ['chemical eng', 'chem eng'] },
    { name: 'Petroleum Engineering', slug: 'petroleum-engineering', faculty: 'engineering-technology', aliases: ['petroleum eng', 'oil and gas engineering'] },
    { name: 'Mechatronics Engineering', slug: 'mechatronics-engineering', faculty: 'engineering-technology', aliases: ['mechatronics'] },
    { name: 'Industrial Engineering', slug: 'industrial-engineering', faculty: 'engineering-technology', aliases: ['industrial production engineering'] },
    { name: 'Metallurgical Engineering', slug: 'metallurgical-engineering', faculty: 'engineering-technology', aliases: ['materials engineering'] },

    // Environmental Sciences
    { name: 'Architecture', slug: 'architecture', faculty: 'environmental-sciences', aliases: ['architectural design'] },
    { name: 'Building Technology', slug: 'building-technology', faculty: 'environmental-sciences', aliases: ['building', 'construction technology'] },
    { name: 'Estate Management', slug: 'estate-management', faculty: 'environmental-sciences', aliases: ['real estate management', 'property management'] },
    { name: 'Geography', slug: 'geography', faculty: 'environmental-sciences', aliases: ['geography and planning'] },
    { name: 'Quantity Surveying', slug: 'quantity-surveying', faculty: 'environmental-sciences', aliases: ['qs', 'cost engineering'] },
    { name: 'Surveying', slug: 'surveying', faculty: 'environmental-sciences', aliases: ['surveying and geoinformatics', 'geomatics'] },
    { name: 'Urban Planning', slug: 'urban-planning', faculty: 'environmental-sciences', aliases: ['urban and regional planning', 'town planning'] },
    { name: 'Environmental Management', slug: 'environmental-management', faculty: 'environmental-sciences', aliases: ['environmental science'] },

    // Law
    { name: 'Law', slug: 'law', faculty: 'law', aliases: ['common law', 'legal studies', 'llb'] },
    { name: 'Private Law', slug: 'private-law', faculty: 'law', aliases: ['private and property law'] },
    { name: 'Public Law', slug: 'public-law', faculty: 'law', aliases: ['public and international law'] },
    { name: 'Commercial Law', slug: 'commercial-law', faculty: 'law', aliases: ['business law'] },

    // Management Sciences
    { name: 'Accounting', slug: 'accounting', faculty: 'management-sciences', aliases: ['accountancy', 'acct', 'accounting science'] },
    { name: 'Banking and Finance', slug: 'banking-finance', faculty: 'management-sciences', aliases: ['banking', 'finance', 'financial studies'] },
    { name: 'Business Administration', slug: 'business-administration', faculty: 'management-sciences', aliases: ['business admin', 'business management', 'bba', 'management'] },
    { name: 'Marketing', slug: 'marketing', faculty: 'management-sciences', aliases: ['marketing management'] },
    { name: 'Public Administration', slug: 'public-administration', faculty: 'management-sciences', aliases: ['public admin', 'public management'] },
    { name: 'Entrepreneurship', slug: 'entrepreneurship', faculty: 'management-sciences', aliases: ['entrepreneurship studies'] },
    { name: 'Insurance', slug: 'insurance', faculty: 'management-sciences', aliases: ['insurance and risk management'] },
    { name: 'Hospitality Management', slug: 'hospitality-management', faculty: 'management-sciences', aliases: ['hotel management', 'tourism management', 'hospitality and tourism'] },
    { name: 'Human Resource Management', slug: 'human-resource-management', faculty: 'management-sciences', aliases: ['hrm', 'personnel management'] },
    { name: 'Office Technology', slug: 'office-technology', faculty: 'management-sciences', aliases: ['office technology and management', 'secretarial studies'] },

    // Medicine & Health Sciences
    { name: 'Medicine and Surgery', slug: 'medicine-surgery', faculty: 'medicine-health-sciences', aliases: ['mbbs', 'medicine', 'medical doctor'] },
    { name: 'Nursing', slug: 'nursing', faculty: 'medicine-health-sciences', aliases: ['nursing science', 'registered nurse'] },
    { name: 'Pharmacy', slug: 'pharmacy', faculty: 'medicine-health-sciences', aliases: ['pharmaceutical sciences', 'pharmacology'] },
    { name: 'Medical Laboratory Science', slug: 'medical-laboratory-science', faculty: 'medicine-health-sciences', aliases: ['med lab', 'mls', 'medical lab'] },
    { name: 'Physiotherapy', slug: 'physiotherapy', faculty: 'medicine-health-sciences', aliases: ['physical therapy', 'physio'] },
    { name: 'Anatomy', slug: 'anatomy', faculty: 'medicine-health-sciences', aliases: ['human anatomy', 'anatomical sciences'] },
    { name: 'Physiology', slug: 'physiology', faculty: 'medicine-health-sciences', aliases: ['human physiology'] },
    { name: 'Public Health', slug: 'public-health', faculty: 'medicine-health-sciences', aliases: ['community health', 'health education'] },
    { name: 'Radiography', slug: 'radiography', faculty: 'medicine-health-sciences', aliases: ['radiology', 'medical imaging'] },
    { name: 'Dentistry', slug: 'dentistry', faculty: 'medicine-health-sciences', aliases: ['dental surgery', 'bds'] },
    { name: 'Optometry', slug: 'optometry', faculty: 'medicine-health-sciences', aliases: ['optometry and vision science'] },

    // Pure & Applied Sciences
    { name: 'Computer Science', slug: 'computer-science', faculty: 'pure-applied-sciences', aliases: ['comp sci', 'cs', 'computing', 'computer studies'] },
    { name: 'Mathematics', slug: 'mathematics', faculty: 'pure-applied-sciences', aliases: ['maths', 'mathematical sciences', 'statistics'] },
    { name: 'Physics', slug: 'physics', faculty: 'pure-applied-sciences', aliases: ['applied physics', 'physics with electronics'] },
    { name: 'Chemistry', slug: 'chemistry', faculty: 'pure-applied-sciences', aliases: ['chemical sciences', 'industrial chemistry'] },
    { name: 'Biology', slug: 'biology', faculty: 'pure-applied-sciences', aliases: ['biological sciences', 'cell biology'] },
    { name: 'Biochemistry', slug: 'biochemistry', faculty: 'pure-applied-sciences', aliases: ['biochem'] },
    { name: 'Microbiology', slug: 'microbiology', faculty: 'pure-applied-sciences', aliases: ['micro', 'applied microbiology'] },
    { name: 'Biotechnology', slug: 'biotechnology', faculty: 'pure-applied-sciences', aliases: ['biotech'] },
    { name: 'Geology', slug: 'geology', faculty: 'pure-applied-sciences', aliases: ['geological sciences', 'earth sciences'] },
    { name: 'Statistics', slug: 'statistics', faculty: 'pure-applied-sciences', aliases: ['statistical sciences'] },
    { name: 'Information Technology', slug: 'information-technology', faculty: 'pure-applied-sciences', aliases: ['it', 'info tech'] },
    { name: 'Software Engineering', slug: 'software-engineering', faculty: 'pure-applied-sciences', aliases: ['software development'] },
    { name: 'Cyber Security', slug: 'cyber-security', faculty: 'pure-applied-sciences', aliases: ['cybersecurity', 'information security'] },
    { name: 'Data Science', slug: 'data-science', faculty: 'pure-applied-sciences', aliases: ['data analytics'] },

    // Social Sciences
    { name: 'Economics', slug: 'economics', faculty: 'social-sciences', aliases: ['economic studies', 'econs'] },
    { name: 'Political Science', slug: 'political-science', faculty: 'social-sciences', aliases: ['politics', 'political studies', 'government'] },
    { name: 'Sociology', slug: 'sociology', faculty: 'social-sciences', aliases: ['sociological studies'] },
    { name: 'Psychology', slug: 'psychology', faculty: 'social-sciences', aliases: ['applied psychology'] },
    { name: 'Social Work', slug: 'social-work', faculty: 'social-sciences', aliases: ['social welfare'] },
    { name: 'Criminology', slug: 'criminology', faculty: 'social-sciences', aliases: ['criminology and security studies'] },
    { name: 'International Relations', slug: 'international-relations', faculty: 'social-sciences', aliases: ['international studies', 'diplomacy'] },
    { name: 'Peace Studies', slug: 'peace-studies', faculty: 'social-sciences', aliases: ['peace and conflict studies', 'conflict resolution'] },
    { name: 'Demography', slug: 'demography', faculty: 'social-sciences', aliases: ['population studies'] },
  ]

  for (const dept of departmentsData) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: {
        name: dept.name,
        slug: dept.slug,
        facultyId: faculties[dept.faculty],
        aliases: dept.aliases || [],
      },
    })
  }
  console.log(`Created ${departmentsData.length} departments`)

  // Create Blog Categories
  console.log('Creating blog categories...')
  const blogCategories = [
    { name: 'Project Writing Tips', slug: 'project-writing-tips', order: 1 },
    { name: 'Research Guides', slug: 'research-guides', order: 2 },
    { name: 'Project Topics', slug: 'project-topics', order: 3 },
    { name: 'Data Analysis', slug: 'data-analysis', order: 4 },
    { name: 'Student Resources', slug: 'student-resources', order: 5 },
  ]

  for (const category of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create Sample Topics
  console.log('Creating sample topics...')
  const computerScienceDept = await prisma.department.findUnique({
    where: { slug: 'computer-science' },
  })

  const businessAdminDept = await prisma.department.findUnique({
    where: { slug: 'business-administration' },
  })

  const accountingDept = await prisma.department.findUnique({
    where: { slug: 'accounting' },
  })

  if (computerScienceDept) {
    const csTopics = [
      {
        title: 'Design and Implementation of an Online Voting System',
        slug: 'design-implementation-online-voting-system',
        description: 'This project focuses on developing a secure and efficient online voting system using web technologies.',
        abstract: 'Electoral processes require secure and efficient systems. This project presents the design and implementation of an online voting system...',
        objectives: [
          'To design a secure voting platform',
          'To implement user authentication mechanisms',
          'To develop real-time vote counting',
          'To create an admin module for election management',
        ],
        keywords: ['online voting', 'web application', 'security', 'PHP', 'MySQL'],
        level: 'BSc',
        year: 2024,
        chapters: 5,
        pages: 75,
      },
      {
        title: 'Machine Learning Approach to Fraud Detection in Banking',
        slug: 'machine-learning-fraud-detection-banking',
        description: 'This research applies machine learning algorithms to detect fraudulent transactions in banking systems.',
        level: 'MSc',
        year: 2024,
        chapters: 5,
        pages: 95,
        keywords: ['machine learning', 'fraud detection', 'banking', 'Python'],
      },
      {
        title: 'Development of a Hospital Management Information System',
        slug: 'hospital-management-information-system',
        description: 'A comprehensive system for managing hospital operations including patient records, appointments, and billing.',
        level: 'BSc',
        year: 2024,
        chapters: 5,
        pages: 80,
        keywords: ['hospital management', 'healthcare IT', 'database', 'web application'],
      },
    ]

    for (const topic of csTopics) {
      await prisma.topic.upsert({
        where: { slug: topic.slug },
        update: {},
        create: {
          ...topic,
          departmentId: computerScienceDept.id,
          objectives: topic.objectives || [],
          keywords: topic.keywords || [],
        },
      })
    }
  }

  if (businessAdminDept) {
    const baTopics = [
      {
        title: 'Impact of Social Media Marketing on Consumer Behavior',
        slug: 'social-media-marketing-consumer-behavior',
        description: 'This study examines how social media marketing strategies influence consumer purchasing decisions.',
        level: 'BSc',
        year: 2024,
        chapters: 5,
        pages: 70,
        keywords: ['social media', 'marketing', 'consumer behavior', 'digital marketing'],
      },
      {
        title: 'Effects of Employee Motivation on Organizational Productivity',
        slug: 'employee-motivation-organizational-productivity',
        description: 'An analysis of various motivation strategies and their impact on employee performance.',
        level: 'MSc',
        year: 2024,
        chapters: 5,
        pages: 85,
        keywords: ['motivation', 'productivity', 'HRM', 'organizational behavior'],
      },
    ]

    for (const topic of baTopics) {
      await prisma.topic.upsert({
        where: { slug: topic.slug },
        update: {},
        create: {
          ...topic,
          departmentId: businessAdminDept.id,
          keywords: topic.keywords || [],
        },
      })
    }
  }

  // Create Sample Blog Post
  console.log('Creating sample blog post...')
  const projectWritingCategory = await prisma.blogCategory.findUnique({
    where: { slug: 'project-writing-tips' },
  })

  if (projectWritingCategory) {
    await prisma.blogPost.upsert({
      where: { slug: 'how-to-write-chapter-one' },
      update: {},
      create: {
        title: 'How to Write Chapter One of Your Research Project',
        slug: 'how-to-write-chapter-one',
        excerpt: 'A comprehensive guide to writing a compelling introduction chapter that sets the foundation for your entire research project.',
        content: `
          <h2>Introduction</h2>
          <p>Chapter One of your research project is crucial as it sets the stage for your entire study. This chapter introduces your research topic, states the problem, and outlines your objectives.</p>
          
          <h2>Components of Chapter One</h2>
          <h3>1. Background of the Study</h3>
          <p>Start with a broad overview of your topic and gradually narrow down to your specific research focus...</p>
          
          <h3>2. Statement of the Problem</h3>
          <p>Clearly articulate the gap in knowledge that your research addresses...</p>
          
          <h3>3. Research Objectives</h3>
          <p>List your main objective and specific objectives using action verbs...</p>
          
          <h2>Tips for Success</h2>
          <ul>
            <li>Be clear and concise</li>
            <li>Use proper academic language</li>
            <li>Support claims with citations</li>
            <li>Maintain logical flow</li>
          </ul>
        `,
        categoryId: projectWritingCategory.id,
        tags: ['chapter one', 'introduction', 'research project', 'writing tips'],
        keywords: ['chapter one', 'introduction', 'project writing', 'research'],
        status: 'published',
        publishedAt: new Date(),
        views: 150,
      },
    })
  }

  // Create Sample FAQ
  console.log('Creating FAQs...')
  const faqs = [
    {
      question: 'How long does it take to complete a project?',
      answer: 'Typically 2-4 weeks for a complete project (Chapter 1-5), depending on complexity. Single chapters can be completed in 3-7 days.',
      category: 'Delivery',
      order: 1,
    },
    {
      question: 'Is the work plagiarism-free?',
      answer: 'Yes, all our work is written from scratch and checked through plagiarism detection software. We provide a plagiarism report upon request.',
      category: 'Quality',
      order: 2,
    },
    {
      question: 'Can I get revisions if my supervisor has comments?',
      answer: 'Yes, we offer free revisions based on supervisor feedback. Simply share the comments and we will address them promptly.',
      category: 'Delivery',
      order: 3,
    },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq,
    })
  }

  console.log('Database seeding completed successfully!')
  console.log('')
  console.log('===========================================')
  console.log('Admin Login Credentials:')
  console.log('Email: admin@alimswrite.com')
  console.log('Password: Olaleke4u@2005')
  console.log('===========================================')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })