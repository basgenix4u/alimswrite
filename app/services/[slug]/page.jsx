// app/services/[slug]/page.jsx
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowRight, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import { sanitizeHtml } from '@/lib/sanitize' // ✅ NEW: Import sanitizer

// Services data - matching slugs from services listing page
const servicesData = {
  'project-writing': {
    title: 'Project Writing',
    tagline: 'Complete Chapter 1-5 Projects Delivered to Your Specifications',
    description: 'Our project writing service is designed for final year undergraduate and postgraduate students who need comprehensive support in completing their research projects. We handle everything from topic refinement to the final chapter, ensuring your work meets institutional standards.',
    longDescription: `
      <p>Writing a research project can be overwhelming. Between coursework, exams, and other commitments, finding time to conduct thorough research and write quality chapters is challenging. That is where we come in.</p>
      
      <p>Our team of experienced academic writers specializes in crafting well-researched, properly structured projects across all disciplines. Whether you need help with a single chapter or the entire project, we deliver work that meets your institution's requirements and your supervisor's expectations.</p>
      
      <h3>What Makes Our Project Writing Different</h3>
      
      <p>We do not use templates or recycle content. Every project is written from scratch based on your specific topic, objectives, and requirements. Our writers conduct original research using credible academic sources, ensuring your project demonstrates genuine scholarly work.</p>
      
      <p>We also understand that different institutions have different formatting requirements. Whether your school uses APA, Harvard, Chicago, or any other citation style, we format your work accordingly. We pay attention to details like margins, spacing, font requirements, and chapter structure specific to your institution.</p>
      
      <h3>Covering All Nigerian Universities</h3>
      
      <p>From UNILAG to UNIBEN, OAU to ABU, we have successfully delivered projects for students across every Nigerian university. We understand the specific requirements of different institutions and departments, ensuring your project fits perfectly.</p>
    `,
    features: [
      'Complete Chapter 1-5 writing',
      'Single chapter writing available',
      'Topic selection assistance',
      'Proper APA, Harvard, or Chicago referencing',
      'Plagiarism-free content with report',
      'Supervisor feedback corrections included',
      'Research methodology guidance',
      'Data collection instrument design',
      'Unlimited revisions until approval',
    ],
    process: [
      {
        title: 'Share Your Requirements',
        description: 'Provide your topic, department, institution, deadline, and any supervisor instructions or guidelines.',
      },
      {
        title: 'Receive Your Quote',
        description: 'We assess your requirements and provide a fair quote based on complexity and deadline.',
      },
      {
        title: 'Work Begins',
        description: 'Upon confirmation, our assigned writer begins researching and writing your project.',
      },
      {
        title: 'Progress Updates',
        description: 'We keep you informed of progress and seek clarification when needed.',
      },
      {
        title: 'Delivery and Review',
        description: 'Receive your completed project, review it, and request any revisions.',
      },
    ],
    faqs: [
      {
        question: 'How long does it take to complete a full project?',
        answer: 'Typically 2-4 weeks for a complete project, depending on complexity. We also offer express delivery for urgent requests at additional cost.',
      },
      {
        question: 'Can I order just one chapter?',
        answer: 'Yes, you can order individual chapters. Many students order Chapter 4 (Data Analysis) or Chapter 2 (Literature Review) separately.',
      },
      {
        question: 'What if my supervisor requests corrections?',
        answer: 'We offer free corrections based on supervisor feedback. Simply share the comments and we will address them promptly.',
      },
      {
        question: 'How do you ensure the work is plagiarism-free?',
        answer: 'We write every project from scratch and run it through plagiarism detection software. You receive a plagiarism report with your delivery.',
      },
    ],
    relatedServices: ['thesis-dissertation', 'data-analysis', 'research-proposals'],
  },

  'thesis-dissertation': {
    title: 'Thesis & Dissertation',
    tagline: 'Advanced Research Writing for Masters and PhD Students',
    description: 'Comprehensive thesis and dissertation writing services for postgraduate students. Our team of specialists with advanced degrees ensures your research demonstrates the depth and rigor expected at the Masters and PhD level.',
    longDescription: `
      <p>A thesis or dissertation represents the culmination of your postgraduate journey. It requires not just writing skills, but deep understanding of research methodology, theoretical frameworks, and academic discourse. Our team is equipped to support you through this challenging process.</p>
      
      <p>We work with Masters and PhD candidates across disciplines, providing support ranging from proposal development to final dissertation writing. Our writers hold advanced degrees and understand the expectations at postgraduate level.</p>
      
      <h3>Comprehensive Support at Every Stage</h3>
      
      <p>Whether you need help developing your research proposal, conducting a comprehensive literature review, designing your methodology, analyzing data, or writing up your findings, we provide targeted support. We can work on specific chapters or provide end-to-end assistance.</p>
      
      <p>We also understand that postgraduate research often involves complex methodologies. Our team includes specialists in both quantitative and qualitative research methods who can guide you through data collection, analysis, and interpretation.</p>
      
      <h3>Defense-Ready Work</h3>
      
      <p>We do not just help you write—we help you defend. Your thesis or dissertation will be structured and argued in a way that anticipates examiner questions and demonstrates scholarly rigor.</p>
    `,
    features: [
      'Masters thesis writing',
      'PhD dissertation support',
      'Research proposal development',
      'Comprehensive literature review',
      'Methodology design and justification',
      'Quantitative and qualitative analysis',
      'Theoretical framework development',
      'Defense preparation support',
      'Publication-ready chapters',
    ],
    process: [
      {
        title: 'Initial Consultation',
        description: 'We discuss your research area, progress so far, and specific needs.',
      },
      {
        title: 'Proposal or Chapter Assessment',
        description: 'If you have existing work, we review it to understand your approach and requirements.',
      },
      {
        title: 'Custom Quote',
        description: 'Based on your needs, we provide a detailed quote and timeline.',
      },
      {
        title: 'Collaborative Writing',
        description: 'We work closely with you, sharing drafts and incorporating your feedback.',
      },
      {
        title: 'Quality Delivery',
        description: 'Receive polished chapters ready for supervisor review.',
      },
    ],
    faqs: [
      {
        question: 'Do you write entire dissertations?',
        answer: 'Yes, we can provide complete dissertation writing services. However, many postgraduate students use us for specific chapters or aspects they find challenging.',
      },
      {
        question: 'What disciplines do you cover?',
        answer: 'Our team covers all major disciplines including sciences, social sciences, humanities, business, engineering, and more.',
      },
      {
        question: 'Can you help with dissertation corrections after defense?',
        answer: 'Yes, we assist with post-defense corrections and revisions required by your committee.',
      },
      {
        question: 'How do you handle complex data analysis?',
        answer: 'We have statisticians and data analysts who specialize in advanced quantitative and qualitative analysis methods.',
      },
    ],
    relatedServices: ['project-writing', 'data-analysis', 'research-proposals'],
  },

  'data-analysis': {
    title: 'Data Analysis',
    tagline: 'Transform Raw Data into Meaningful Research Insights',
    description: 'Expert data analysis services using SPSS, Excel, Stata, R, and Python. We handle everything from data entry to complex statistical analysis, providing clear interpretations that strengthen your research findings.',
    longDescription: `
      <p>Data analysis is often the most challenging aspect of research projects. Whether you have collected primary data through surveys or are working with secondary data, proper analysis is crucial for valid conclusions. Our team of statisticians makes this process seamless.</p>
      
      <p>We work with various statistical software including SPSS, Excel, Stata, R, and Python. Whatever your data type or analysis requirements, we have the expertise to handle it. From simple descriptive statistics to complex regression models and structural equation modeling, we cover it all.</p>
      
      <h3>More Than Just Numbers</h3>
      
      <p>Analysis is not just about running tests. It is about understanding what the results mean for your research. We provide detailed interpretation of findings, explaining what the statistics reveal in the context of your research objectives and hypotheses.</p>
      
      <p>We also present results in formats required by your institution, including properly formatted tables, charts, and graphs that can go directly into your Chapter 4.</p>
      
      <h3>Chapter 4 Writing Included</h3>
      
      <p>Need help writing up your results? We can provide a complete Chapter 4 (Data Presentation and Analysis) that presents your findings clearly and professionally.</p>
    `,
    features: [
      'SPSS data analysis',
      'Excel data analysis',
      'Stata statistical analysis',
      'R programming and analysis',
      'Python data analysis',
      'Descriptive statistics',
      'Inferential statistics',
      'Regression analysis',
      'Hypothesis testing',
      'Results interpretation',
      'Tables and charts',
      'Chapter 4 writing',
    ],
    process: [
      {
        title: 'Share Your Data',
        description: 'Send us your data file and research objectives or hypotheses.',
      },
      {
        title: 'Analysis Plan',
        description: 'We propose appropriate statistical tests based on your research design.',
      },
      {
        title: 'Quote Approval',
        description: 'Once you approve the analysis plan and quote, we proceed.',
      },
      {
        title: 'Analysis Execution',
        description: 'We run the analysis using appropriate software.',
      },
      {
        title: 'Results Delivery',
        description: 'Receive output files, formatted tables, and detailed interpretation.',
      },
    ],
    faqs: [
      {
        question: 'What if I have not collected data yet?',
        answer: 'We can help design your data collection instrument (questionnaire) and advise on sample size requirements.',
      },
      {
        question: 'Which statistical tests will you use?',
        answer: 'Tests depend on your research design, variables, and objectives. We recommend appropriate tests and explain why they are suitable.',
      },
      {
        question: 'Can you teach me how to interpret the results?',
        answer: 'Yes, we provide detailed explanations and can walk you through the analysis to help you understand and defend your findings.',
      },
      {
        question: 'What format do you deliver results in?',
        answer: 'We provide the software output file, formatted Word tables, and written interpretation that can go into your Chapter 4.',
      },
    ],
    relatedServices: ['project-writing', 'thesis-dissertation', 'research-proposals'],
  },

  'assignment-writing': {
    title: 'Assignment Writing',
    tagline: 'Never Miss a Deadline Again with Expert Assignment Support',
    description: 'From essays to case studies, lab reports to presentations, we help you tackle assignments across all subjects. Our writers deliver well-researched, properly formatted work that meets your course requirements.',
    longDescription: `
      <p>University life comes with endless assignments. Between multiple courses, each with its own deadlines and requirements, keeping up can feel impossible. Add in part-time work, family responsibilities, or other commitments, and something has to give. But it does not have to be your grades.</p>
      
      <p>Our assignment help service connects you with subject matter experts who understand your course requirements and can deliver quality work within your deadline. Whether it is a 500-word reflection paper or a 5,000-word research assignment, we have got you covered.</p>
      
      <h3>All Subjects, All Levels</h3>
      
      <p>From accounting to zoology, we cover virtually every subject taught in Nigerian universities. Our writers have diverse academic backgrounds and practical experience in their fields. You are matched with someone who actually understands your subject, not just a general writer trying to figure it out.</p>
      
      <h3>Last-Minute Deadlines?</h3>
      
      <p>We know assignments sometimes pile up unexpectedly. That is why we offer express delivery options for urgent work. While we always recommend giving us adequate time for the best results, we can handle tight deadlines when you need us to.</p>
      
      <p>Every assignment is researched and written from scratch. We never recycle work or use essay mills. Your assignment is uniquely yours.</p>
    `,
    features: [
      'Essay writing',
      'Case study analysis',
      'Lab reports',
      'Reflection papers',
      'Research assignments',
      'Discussion posts',
      'Course work support',
      'Presentation content',
      'All subjects covered',
      'Express delivery available',
      'Proper formatting (APA, MLA, Harvard)',
      'Plagiarism-free guarantee',
    ],
    process: [
      {
        title: 'Submit Your Assignment',
        description: 'Share the assignment brief, rubric, lecture notes, and deadline.',
      },
      {
        title: 'Get Matched',
        description: 'We assign a writer with expertise in your subject area.',
      },
      {
        title: 'Confirm and Pay',
        description: 'Review the quote and confirm your order.',
      },
      {
        title: 'Receive Your Work',
        description: 'Get your completed assignment before the deadline.',
      },
      {
        title: 'Request Revisions',
        description: 'If needed, request adjustments and we will revise promptly.',
      },
    ],
    faqs: [
      {
        question: 'Can you handle very short deadlines?',
        answer: 'Yes, we offer express services for urgent assignments. However, very short deadlines may attract a premium fee.',
      },
      {
        question: 'What if the assignment requires specific textbooks?',
        answer: 'If you have specific course materials, share them with us. This helps us align the work with what your lecturer expects.',
      },
      {
        question: 'Do you follow rubrics?',
        answer: 'Absolutely. Share your assignment rubric and we structure the work to meet each criterion.',
      },
      {
        question: 'Can you help with group assignments?',
        answer: 'Yes, we can handle your portion of a group assignment or help coordinate the entire group work.',
      },
    ],
    relatedServices: ['project-writing', 'proofreading-editing', 'paraphrasing-rewriting'],
  },

  'research-proposals': {
    title: 'Research Proposals',
    tagline: 'Get Your Research Approved with a Compelling Proposal',
    description: 'A strong research proposal is your ticket to approval. We craft persuasive, well-structured proposals that clearly communicate your research objectives, methodology, and significance to your supervisors and committee.',
    longDescription: `
      <p>Your research proposal is the foundation of your entire project. It is the document that convinces your supervisor and department that your research is worth pursuing. A poorly written proposal can delay your project by months or even lead to rejection. We help you avoid that.</p>
      
      <p>Our proposal writing service has helped hundreds of students get their research approved on the first submission. We understand what committees look for and how to present your ideas in a way that demonstrates scholarly potential and practical feasibility.</p>
      
      <h3>More Than Just an Outline</h3>
      
      <p>A good proposal is not just about having a topic. It is about demonstrating that you understand the problem, know the existing literature, have a clear methodology, and can realistically complete the research. We help you articulate all these elements convincingly.</p>
      
      <p>We also tailor proposals to your specific institution's requirements. Whether you need a 5-page undergraduate proposal or a 30-page PhD research proposal with extensive literature review, we deliver according to your guidelines.</p>
      
      <h3>Research Gap Identification</h3>
      
      <p>One of the most challenging aspects of proposal writing is identifying and articulating the research gap. Our experienced researchers help you pinpoint what makes your study unique and why it matters to your field.</p>
    `,
    features: [
      'Undergraduate project proposals',
      'Masters thesis proposals',
      'PhD research proposals',
      'Problem statement development',
      'Research gap identification',
      'Literature review summary',
      'Methodology justification',
      'Timeline and work plan',
      'Budget estimation (if required)',
      'Supervisor-ready formatting',
    ],
    process: [
      {
        title: 'Topic Discussion',
        description: 'Share your research area, interests, and any preliminary ideas you have.',
      },
      {
        title: 'Feasibility Assessment',
        description: 'We evaluate the viability of your topic and suggest refinements if needed.',
      },
      {
        title: 'Proposal Development',
        description: 'We craft your proposal with all required sections and proper academic language.',
      },
      {
        title: 'Review and Revision',
        description: 'You review the draft and we make adjustments based on your feedback.',
      },
      {
        title: 'Final Delivery',
        description: 'Receive your polished proposal ready for supervisor submission.',
      },
    ],
    faqs: [
      {
        question: 'I do not have a topic yet. Can you help?',
        answer: 'Absolutely! We can suggest relevant, researchable topics in your field based on current trends and available resources.',
      },
      {
        question: 'What if my proposal gets rejected?',
        answer: 'We offer free revisions based on committee feedback. Our goal is to get your proposal approved.',
      },
      {
        question: 'How detailed should my proposal be?',
        answer: 'This depends on your level of study and institution. We will ask about your specific requirements and format accordingly.',
      },
      {
        question: 'Do you include references in the proposal?',
        answer: 'Yes, we include a preliminary bibliography with credible academic sources that support your research direction.',
      },
    ],
    relatedServices: ['project-writing', 'thesis-dissertation', 'data-analysis'],
  },

  'siwes-it-reports': {
    title: 'SIWES & IT Reports',
    tagline: 'Professional Industrial Training Documentation That Impresses',
    description: 'Document your industrial training experience professionally. We help you structure your SIWES or IT report to reflect your learning and meet your institution\'s requirements perfectly.',
    longDescription: `
      <p>The Students Industrial Work Experience Scheme (SIWES) and Industrial Training (IT) are crucial components of Nigerian tertiary education. They bridge the gap between classroom theory and real-world application. But documenting this experience in a way that meets academic standards can be challenging.</p>
      
      <p>Our SIWES and IT report writing service helps you transform your practical experience into a well-structured, professionally written report. We ensure your documentation reflects the skills gained, tasks performed, and knowledge acquired during your attachment.</p>
      
      <h3>More Than Just a Logbook Summary</h3>
      
      <p>A good IT report goes beyond simply listing what you did each day. It demonstrates reflection, learning, and the ability to connect practical experience with academic concepts. We help you present your experience in a way that showcases genuine professional development.</p>
      
      <h3>Institution-Specific Formatting</h3>
      
      <p>Different institutions have different requirements for IT reports—from the structure and chapters to formatting and appendices. We are familiar with requirements across Nigerian universities and polytechnics, ensuring your report meets your specific institution's standards.</p>
      
      <p>Whether you did your attachment at a bank, oil company, government agency, tech startup, or any other organization, we can document your experience appropriately for your course of study.</p>
    `,
    features: [
      'SIWES report writing',
      'IT attachment reports',
      'Log book entries compilation',
      'Weekly activity documentation',
      'Company profile writing',
      'Experience documentation',
      'Proper formatting',
      'Diagrams and charts',
      'Institution-specific requirements',
      'All courses covered',
      'Appendices preparation',
      'Supervisor recommendations',
    ],
    process: [
      {
        title: 'Share Your Experience',
        description: 'Tell us about your attachment—company, department, duration, and key activities.',
      },
      {
        title: 'Provide Materials',
        description: 'Share your logbook entries, photos, and any documentation from your attachment.',
      },
      {
        title: 'Report Structuring',
        description: 'We structure your report according to your institution\'s guidelines.',
      },
      {
        title: 'Draft Development',
        description: 'We write your report with proper technical language and formatting.',
      },
      {
        title: 'Finalization',
        description: 'Review the draft, request changes, and receive your final report.',
      },
    ],
    faqs: [
      {
        question: 'I did not keep good notes during my IT. Can you still help?',
        answer: 'Yes, we can work with whatever information you have. We will ask questions to help you recall key experiences and activities.',
      },
      {
        question: 'Do you know my school\'s IT report format?',
        answer: 'We are familiar with formats for most Nigerian institutions. Share any guidelines you have, and we will follow them precisely.',
      },
      {
        question: 'Can you help with the technical diagrams?',
        answer: 'Yes, we can create process flows, organizational charts, and other diagrams relevant to your attachment.',
      },
      {
        question: 'What if I did my IT at an unusual company?',
        answer: 'No company is too unusual. We have written reports for attachments in banks, oil companies, farms, startups, NGOs, and more.',
      },
    ],
    relatedServices: ['project-writing', 'assignment-writing', 'proofreading-editing'],
  },

  'powerpoint-design': {
    title: 'PowerPoint Design',
    tagline: 'Visually Stunning Slides That Communicate Your Ideas Effectively',
    description: 'From academic defenses to business presentations, we create professional PowerPoint slides that enhance your message. Clean design, clear content, and speaker notes included.',
    longDescription: `
      <p>A great presentation is more than just bullet points on slides. It is about visual storytelling that keeps your audience engaged while clearly communicating your message. Whether you are defending your project or presenting to a class, your slides matter.</p>
      
      <p>Our presentation design service combines content expertise with visual design skills. We do not just dump text onto slides—we structure your content for maximum impact, use appropriate visuals, and create a cohesive design that looks professional.</p>
      
      <h3>Academic Presentations</h3>
      
      <p>Project defense presentations, seminar presentations, conference papers—each has specific requirements. We understand academic presentation conventions and create slides that impress supervisors and committees.</p>
      
      <h3>Beyond Just Slides</h3>
      
      <p>We provide more than a PowerPoint file. You get speaker notes that guide you on what to say for each slide, making your preparation easier. We can also create handouts or summary documents if needed.</p>
      
      <p>Need to present but have stage fright? We include tips on delivery and can help you prepare talking points that make presenting feel natural.</p>
    `,
    features: [
      'Custom slide design',
      'Content development',
      'Academic defense presentations',
      'Business presentations',
      'Seminar presentations',
      'Conference presentations',
      'Speaker notes included',
      'Infographics and charts',
      'Consistent branding',
      'Animation (if appropriate)',
      'Handout versions',
      'Multiple format delivery (PPTX, PDF)',
    ],
    process: [
      {
        title: 'Share Your Content',
        description: 'Provide your presentation topic, key points, or existing document to convert.',
      },
      {
        title: 'Structure Planning',
        description: 'We plan the slide flow and content distribution for maximum impact.',
      },
      {
        title: 'Design and Development',
        description: 'Our designers create visually appealing slides with your content.',
      },
      {
        title: 'Review and Revise',
        description: 'You review the draft and we make adjustments.',
      },
      {
        title: 'Final Delivery',
        description: 'Receive your presentation with speaker notes, ready to present.',
      },
    ],
    faqs: [
      {
        question: 'I have a document—can you convert it to a presentation?',
        answer: 'Yes, we can take your project, report, or any document and transform it into an engaging presentation.',
      },
      {
        question: 'How many slides do I need?',
        answer: 'This depends on presentation length. A general rule is 1-2 slides per minute of speaking time. We will advise based on your requirements.',
      },
      {
        question: 'Can you match my school or company template?',
        answer: 'Yes, share your template and we will design within those guidelines.',
      },
      {
        question: 'Do you create Google Slides too?',
        answer: 'Yes, while PowerPoint is most common, we also work with Google Slides and Canva presentations.',
      },
    ],
    relatedServices: ['project-writing', 'thesis-dissertation', 'data-analysis'],
  },

  'paraphrasing-rewriting': {
    title: 'Paraphrasing & Rewriting',
    tagline: 'Same Ideas, Fresh Expression—Professional Rewriting Services',
    description: 'Need to express ideas in your own words? Our paraphrasing service rewrites content while maintaining original meaning, perfect for literature reviews, avoiding plagiarism, and content refreshing.',
    longDescription: `
      <p>Paraphrasing is an essential academic skill, but it is harder than it looks. Simply replacing words with synonyms is not enough—and can even make writing worse. True paraphrasing requires understanding the original meaning and expressing it in a completely new way.</p>
      
      <p>Our professional paraphrasing service transforms content while preserving meaning. Whether you need to rewrite literature for your review, rephrase technical content, or express research findings differently, we deliver quality paraphrased content that sounds natural.</p>
      
      <h3>Why Our Paraphrasing Works</h3>
      
      <p>We do not use paraphrasing tools or AI spinners that produce awkward, unnatural text. Our writers read, understand, and rewrite content manually. The result is text that flows naturally and makes sense in academic context.</p>
      
      <h3>Plagiarism-Safe Content</h3>
      
      <p>Properly paraphrased content will not match the original in plagiarism checkers. We ensure your rewritten content is genuinely different while maintaining the core ideas and academic integrity.</p>
      
      <p>We also ensure proper citation. Even paraphrased content needs to credit the original source. We format citations according to your required style.</p>
    `,
    features: [
      'Manual paraphrasing (no tools)',
      'Original meaning preserved',
      'Academic tone maintained',
      'Natural-sounding text',
      'Proper terminology use',
      'Citation formatting',
      'Multiple sections/chapters',
      'Literature rewriting',
      'Concept explanation',
      'Plagiarism reduction',
      'Quick turnaround',
      'Revision rounds included',
    ],
    process: [
      {
        title: 'Submit Original Content',
        description: 'Share the content you need paraphrased and any specific requirements.',
      },
      {
        title: 'Comprehension',
        description: 'Our writer reads and understands the original material thoroughly.',
      },
      {
        title: 'Rewriting',
        description: 'The content is rewritten in fresh language while maintaining meaning.',
      },
      {
        title: 'Quality Check',
        description: 'We verify accuracy, naturalness, and plagiarism status.',
      },
      {
        title: 'Delivery',
        description: 'Receive your paraphrased content ready for use.',
      },
    ],
    faqs: [
      {
        question: 'Is paraphrased content plagiarism-free?',
        answer: 'Yes, properly paraphrased content will not match the original in plagiarism checkers. However, you should still cite the source.',
      },
      {
        question: 'Can you paraphrase technical content?',
        answer: 'Yes, our writers include subject matter experts who can handle technical terminology appropriately.',
      },
      {
        question: 'How is this different from editing?',
        answer: 'Editing improves your existing writing. Paraphrasing completely rewrites content to express the same ideas differently.',
      },
      {
        question: 'Do you keep the same length?',
        answer: 'Paraphrased content may be slightly longer or shorter, but we aim to maintain similar length unless you specify otherwise.',
      },
    ],
    relatedServices: ['proofreading-editing', 'project-correction', 'project-writing'],
  },

  'proofreading-editing': {
    title: 'Proofreading & Editing',
    tagline: 'Polish Your Work to Perfection Before Submission',
    description: 'Already written your work but want it reviewed by a professional? Our editing and proofreading service catches errors, improves clarity, and ensures your writing meets academic standards.',
    longDescription: `
      <p>You have put in the hard work—researched, drafted, and revised. But before you submit, would not it be great to have a fresh pair of expert eyes review your work? That is exactly what our editing and proofreading service provides.</p>
      
      <p>We go beyond simple spell-checking. Our editors review your work for grammar, punctuation, sentence structure, clarity, coherence, and academic tone. We also check that your formatting and citations are consistent and correct.</p>
      
      <h3>Different Levels for Different Needs</h3>
      
      <p><strong>Proofreading:</strong> Perfect for work that just needs a final polish. We focus on grammar, spelling, punctuation, and typographical errors.</p>
      
      <p><strong>Copy Editing:</strong> More comprehensive. We address sentence structure, word choice, clarity, and consistency in addition to basic errors.</p>
      
      <p><strong>Substantive Editing:</strong> For work that needs significant improvement. We may reorganize content, rewrite unclear sections, and strengthen arguments while maintaining your voice.</p>
      
      <h3>Track Changes Included</h3>
      
      <p>We provide your edited document with track changes so you can see every modification. This transparency helps you learn from the edits and make informed decisions about accepting changes.</p>
    `,
    features: [
      'Grammar and spelling correction',
      'Punctuation review',
      'Sentence structure improvement',
      'Clarity and coherence enhancement',
      'Academic tone adjustment',
      'Formatting consistency',
      'Citation style check',
      'Track changes document',
      'Editor notes and feedback',
      'Multiple revision rounds',
      'Express turnaround available',
      'All document types accepted',
    ],
    process: [
      {
        title: 'Submit Your Document',
        description: 'Upload your document and specify the level of editing you need.',
      },
      {
        title: 'Review Assessment',
        description: 'We review your document and confirm the scope of work.',
      },
      {
        title: 'Editing Process',
        description: 'Our editor works through your document meticulously.',
      },
      {
        title: 'Quality Review',
        description: 'A second reviewer checks the edited document.',
      },
      {
        title: 'Delivery',
        description: 'Receive your polished document with track changes.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between editing and proofreading?',
        answer: 'Proofreading catches surface errors (spelling, grammar). Editing goes deeper, addressing clarity, structure, and style. We offer both.',
      },
      {
        question: 'Will my work still sound like me?',
        answer: 'Yes, we preserve your voice while improving quality. We enhance, not rewrite, unless you request substantive editing.',
      },
      {
        question: 'How long does editing take?',
        answer: 'Typically 24-72 hours depending on document length and editing level. Express options are available.',
      },
      {
        question: 'Can you edit non-academic documents?',
        answer: 'Yes, we also edit professional documents, business writing, and personal projects.',
      },
    ],
    relatedServices: ['project-writing', 'paraphrasing-rewriting', 'project-correction'],
  },

  'project-correction': {
    title: 'Project Correction',
    tagline: 'Turn Supervisor Feedback into an Approved Project',
    description: 'Supervisor returned your work with corrections? We help you address feedback efficiently, making the necessary changes to meet your supervisor\'s expectations and get your project approved.',
    longDescription: `
      <p>Few things are more frustrating than submitting your project only to have it returned with pages of corrections. Whether it is issues with your methodology, gaps in your literature review, problems with your analysis, or formatting inconsistencies, addressing supervisor feedback can feel overwhelming.</p>
      
      <p>Our project correction service takes the stress out of revisions. We carefully analyze your supervisor's feedback and implement the required changes systematically, ensuring nothing is missed.</p>
      
      <h3>Understanding What Your Supervisor Wants</h3>
      
      <p>Supervisors often provide feedback in ways that can be hard to interpret. Our experienced academic writers understand what supervisors are really asking for. We can translate vague comments like "strengthen your argument" or "more depth needed" into concrete improvements.</p>
      
      <h3>Maintaining Consistency</h3>
      
      <p>When making corrections, it is crucial to maintain consistency with the rest of your work. We ensure that changes flow naturally with your existing content and that the revised work reads as a cohesive whole.</p>
      
      <p>We handle corrections for all chapters, from Chapter 1 introduction refinements to Chapter 5 conclusion adjustments. Whether you have minor edits or major rewrites, we have got you covered.</p>
    `,
    features: [
      'Feedback implementation',
      'Content revision',
      'Structure adjustment',
      'Methodology fixes',
      'Literature expansion',
      'Analysis corrections',
      'Reference updates',
      'Formatting fixes',
      'Quality improvement',
      'Consistency maintenance',
      'Multiple revision rounds',
      'Track changes provided',
    ],
    process: [
      {
        title: 'Share Your Project',
        description: 'Send us your current project document.',
      },
      {
        title: 'Share Feedback',
        description: 'Provide your supervisor\'s comments, corrections, or feedback.',
      },
      {
        title: 'Correction Plan',
        description: 'We analyze the feedback and plan the required corrections.',
      },
      {
        title: 'Implementation',
        description: 'We make all necessary corrections and improvements.',
      },
      {
        title: 'Delivery',
        description: 'Receive your corrected project, ready for resubmission.',
      },
    ],
    faqs: [
      {
        question: 'My supervisor\'s feedback is vague. Can you still help?',
        answer: 'Yes, we are experienced at interpreting academic feedback. We can clarify what changes are likely needed.',
      },
      {
        question: 'What if the corrections are extensive?',
        answer: 'We handle everything from minor tweaks to major rewrites. We will quote based on the scope of work required.',
      },
      {
        question: 'Will the corrections match my writing style?',
        answer: 'Yes, we carefully match the tone and style of your existing work to maintain consistency.',
      },
      {
        question: 'What if my supervisor asks for more corrections after?',
        answer: 'We offer follow-up correction support. Our goal is to help you get approved.',
      },
    ],
    relatedServices: ['project-writing', 'proofreading-editing', 'paraphrasing-rewriting'],
  },

  'cv-resume-writing': {
    title: 'CV & Resume Writing',
    tagline: 'Professional CVs That Open Doors to Opportunities',
    description: 'Whether you are a fresh graduate or an experienced professional, your CV is your marketing document. We create compelling CVs and resumes that highlight your strengths and get you noticed by employers.',
    longDescription: `
      <p>Your CV is often the first impression you make on potential employers. In a competitive job market, a well-crafted CV can be the difference between getting an interview and being overlooked. Yet many job seekers underestimate the importance of professional CV presentation.</p>
      
      <p>Our CV writing service goes beyond just listing your experience. We strategically present your qualifications, achievements, and potential in a way that speaks directly to what employers are looking for. We understand Nigerian job market expectations as well as international CV standards.</p>
      
      <h3>Achievement-Focused Writing</h3>
      
      <p>We do not just list duties—we highlight achievements. Employers want to know what you accomplished, not just what you were supposed to do. We help you quantify achievements and demonstrate impact.</p>
      
      <h3>ATS-Friendly Formatting</h3>
      
      <p>Many companies use Applicant Tracking Systems (ATS) to screen CVs before human review. We create CVs that pass these automated screenings while still looking professional to human recruiters.</p>
      
      <p>Whether you need an academic CV, a corporate resume, or an international format CV, we tailor the document to your specific goals and target industry.</p>
    `,
    features: [
      'Professional CV writing',
      'Resume development',
      'Academic CV',
      'LinkedIn profile optimization',
      'Cover letter writing',
      'ATS-friendly formatting',
      'Achievement quantification',
      'Keyword optimization',
      'Industry-specific tailoring',
      'Fresh graduate CVs',
      'Executive resumes',
      'Career change CVs',
    ],
    process: [
      {
        title: 'Information Gathering',
        description: 'You complete a detailed questionnaire about your experience, skills, and goals.',
      },
      {
        title: 'Strategy Session',
        description: 'We discuss your target roles and how to position you effectively.',
      },
      {
        title: 'CV Development',
        description: 'We craft your CV with compelling content and professional formatting.',
      },
      {
        title: 'Review and Refine',
        description: 'You review the draft and we make adjustments based on feedback.',
      },
      {
        title: 'Final Delivery',
        description: 'Receive your CV in Word and PDF formats, ready for applications.',
      },
    ],
    faqs: [
      {
        question: 'I am a fresh graduate with little experience. Can you help?',
        answer: 'Absolutely. We highlight your education, internships, projects, and transferable skills to create a strong entry-level CV.',
      },
      {
        question: 'Can you also write cover letters?',
        answer: 'Yes, we offer cover letter writing as an add-on service, tailored to specific job applications.',
      },
      {
        question: 'How long should my CV be?',
        answer: 'This depends on your experience level. Fresh graduates typically have 1-2 pages; experienced professionals may have 2-3 pages.',
      },
      {
        question: 'Do you optimize for Nigerian or international employers?',
        answer: 'We can do both. Just let us know your target market and we will format and position accordingly.',
      },
    ],
    relatedServices: ['statement-of-purpose', 'proofreading-editing', 'assignment-writing'],
  },

  'statement-of-purpose': {
    title: 'Statement of Purpose',
    tagline: 'Stand Out From Thousands of Applicants with a Compelling Story',
    description: 'Your statement of purpose or personal statement is your chance to show who you are beyond grades and test scores. We help you craft authentic, memorable essays that capture attention and communicate your unique value.',
    longDescription: `
      <p>Getting into a competitive program—whether it is a Nigerian university, a foreign institution, or a scholarship program—often comes down to your personal statement. It is your opportunity to show the person behind the application, to explain your motivations, and to demonstrate why you belong in that program.</p>
      
      <p>Our statement of purpose service has helped students gain admission to top universities in Nigeria, the UK, US, Canada, and beyond. We have also helped secure competitive scholarships like PTDF, Chevening, Commonwealth, Agbami, and more.</p>
      
      <h3>Your Story, Professionally Told</h3>
      
      <p>We do not write generic essays. We take time to understand your experiences, achievements, aspirations, and unique qualities. Then we help you present these in a compelling narrative that resonates with admission committees.</p>
      
      <h3>Understanding What Committees Want</h3>
      
      <p>Admission committees read thousands of essays. They can spot generic, clichéd writing immediately. We help you avoid common pitfalls and create essays that are genuine, specific, and memorable.</p>
      
      <p>Whether you need help with a personal statement, statement of purpose, motivation letter, or scholarship essay, we tailor the approach to the specific program and audience.</p>
    `,
    features: [
      'Personal statements',
      'Statement of purpose (SOP)',
      'Motivation letters',
      'Scholarship essays',
      'PTDF essay support',
      'Chevening scholarship essays',
      'Agbami scholarship applications',
      'Commonwealth scholarship essays',
      'NNPC scholarship applications',
      'MBA application essays',
      'Graduate school essays',
      'Authentic voice preservation',
    ],
    process: [
      {
        title: 'Discovery Session',
        description: 'We learn about your background, experiences, and aspirations through a questionnaire or call.',
      },
      {
        title: 'Prompt Analysis',
        description: 'We analyze the essay prompt and program requirements carefully.',
      },
      {
        title: 'Draft Development',
        description: 'We craft an essay that tells your story compellingly.',
      },
      {
        title: 'Collaborative Revision',
        description: 'We refine the essay based on your feedback until it feels authentically you.',
      },
      {
        title: 'Final Polish',
        description: 'The essay is proofread and polished for submission.',
      },
    ],
    faqs: [
      {
        question: 'Will it sound like me?',
        answer: 'Absolutely. We work to capture your voice and story. The essay will reflect your genuine experiences and perspectives.',
      },
      {
        question: 'Can you help if I do not know what to write about?',
        answer: 'Yes, our discovery process helps identify compelling aspects of your background that you might overlook.',
      },
      {
        question: 'Do you guarantee admission?',
        answer: 'We cannot guarantee admission as that depends on many factors, but we maximize your essay\'s impact on the application.',
      },
      {
        question: 'How much input do I have?',
        answer: 'Complete input. This is your story. We collaborate with you throughout the process.',
      },
    ],
    relatedServices: ['cv-resume-writing', 'proofreading-editing', 'assignment-writing'],
  },
}

// Generate static params for known services
export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug: slug,
  }))
}

// Generate metadata
export async function generateMetadata({ params }) {
  const { slug } = await params
  const service = servicesData[slug]
  
  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: `${service.title} - AlimsWrite`,
    description: service.description,
  }
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params
  const service = servicesData[slug]

  if (!service) {
    notFound()
  }

  const relatedServices = service.relatedServices
    ?.map(relatedSlug => servicesData[relatedSlug] ? { slug: relatedSlug, ...servicesData[relatedSlug] } : null)
    .filter(Boolean)
    .slice(0, 3)

  // ✅ NEW: Sanitize the HTML content before rendering
  const safeDescription = sanitizeHtml(service.longDescription)

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-dark-500 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="text-dark-300">/</span>
            <Link href="/services" className="text-dark-500 hover:text-primary-600 transition-colors">
              Services
            </Link>
            <span className="text-dark-300">/</span>
            <span className="text-dark-900 font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link 
              href="/services" 
              className="inline-flex items-center text-primary-200 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              All Services
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-secondary-400 font-medium mb-4">
              {service.tagline}
            </p>
            <p className="text-lg text-primary-100 mb-8">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/order">
                <Button variant="secondary" size="lg">
                  Order This Service
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a
                href="https://wa.me/2349039611238"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Ask Questions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Description - ✅ NOW SANITIZED */}
              <div 
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: safeDescription }}
              />

              {/* Process */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-dark-900 mb-6">
                  Our Process
                </h2>
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary-900">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark-900 mb-1">{step.title}</h3>
                        <p className="text-dark-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-2xl font-bold text-dark-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-dark-900 mb-2">{faq.question}</h3>
                      <p className="text-dark-500">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Features Card */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 sticky top-24">
                <h3 className="text-lg font-semibold text-dark-900 mb-4">
                  What is Included
                </h3>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-dark-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 pt-6">
                  <Link href="/order">
                    <Button variant="primary" className="w-full justify-center mb-3">
                      Order Now
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/2349039611238"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full justify-center">
                      <FaWhatsapp className="w-4 h-4 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>

              {/* Related Services */}
              {relatedServices && relatedServices.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-4">
                    Related Services
                  </h3>
                  <div className="space-y-3">
                    {relatedServices.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/services/${related.slug}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <span className="font-medium text-dark-800 group-hover:text-primary-600 transition-colors">
                          {related.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started with {service.title}?
          </h2>
          <p className="text-primary-100 mb-8">
            Tell us about your project and receive a free quote within hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button variant="secondary" size="lg">
                Start Your Order
              </Button>
            </Link>
            <Link href="/topics">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900">
                Browse Topics First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}