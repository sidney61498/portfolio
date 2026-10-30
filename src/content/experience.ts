export interface Job {
  company: string
  role: string
  period: string
  /** From the resume. */
  stack: string[]
  points: string[]
}

export const jobs: Job[] = [
  {
    company: 'Cloudstaff Modern Workforce Inc.',
    role: 'Senior Software Engineer I',
    period: 'Jul 2022 – Present',
    stack: ['Laravel', 'CakePHP', 'React', 'Angular', 'Vue', 'jQuery', 'MySQL'],
    points: [
      'Develop and maintain StaffCentral (~7,000 users): time tracking, leave, holidays and log corrections',
      'Build HR/Operations reporting and maintain legacy CakePHP 1.3 applications',
      'Contribute to Phoenix (Laravel + Angular): APIs, features and migration work; also React and Vue',
      'Optimize SQL and application performance for large data sets',
      'Build n8n automations, use AI agents for coding, docs and BA/PO workflows, and automate E2E QA with Playwright',
    ],
  },
  {
    company: 'Bizmates Philippines Inc.',
    role: 'Software Engineer I',
    period: 'Jan 2022 – Jul 2022',
    stack: ['Nuxt.js', 'Laravel', 'HTML/CSS'],
    points: [
      'Turned PDF lesson material into structured, reusable HTML/CSS for a web classroom platform',
      'Built frontend features in Nuxt.js with Laravel on the backend',
      'Kept lessons responsive and consistent across devices',
    ],
  },
  {
    company: 'Mariano Marcos State University',
    role: 'Computer Programmer I',
    period: 'Sep 2019 – Jan 2022',
    stack: ['Laravel', 'Vue', 'React', 'MySQL'],
    points: [
      'Built and maintained POS, inventory, payroll, document repository and COVID-19 contact tracing systems',
      'Full-stack Laravel and Vue with MySQL, with newer systems in React',
      'Automated administrative processes; trained users and supported deployed systems',
    ],
  },
  {
    company: 'The Black Nazarene Hospital, Inc.',
    role: 'IT Staff',
    period: 'Mar 2019 – Sep 2019',
    stack: ['Laravel', 'React'],
    points: [
      'Built systems for patient records, surveys and inventory (Laravel, React)',
      'Provided IT support and system training for hospital staff',
    ],
  },
]

export const education = {
  degree: 'Bachelor of Science in Computer Science',
  honors: 'Cum laude',
  school: 'Mariano Marcos State University',
  period: '2014 – 2018',
}
