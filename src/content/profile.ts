// All homepage copy lives in src/content. Text in square brackets is an unfilled placeholder:
// it renders highlighted on the page, and `npm run placeholders` lists what is left.

export const profile = {
  name: 'Sidney Medrano',
  title: 'Senior Software Engineer',
  stackLine: 'Laravel · React · Vue · Angular',
  pitch:
    'I build and maintain the internal systems companies run on: time tracking, HR workflows, APIs and the automation around them. Five-plus years, most of it on software real people use every day.',
  location: 'Ilocos Norte, Philippines',
  availability: 'Open to remote',
  email: 'sidney.medrano61498@gmail.com',
  links: {
    github: 'https://github.com/sidney61498',
    linkedin: 'https://www.linkedin.com/in/sidneym61498/',
  },
  // Add a public resume PDF to /public (no phone number, no references' contacts), then set this.
  resumeUrl: null as string | null,
}

export const about = {
  paragraphs: [
    'I am a full-stack engineer at Cloudstaff, where I work on StaffCentral, the system about 7,000 staff use to log time, file leave, and request corrections. A lot of my job is careful work on a large legacy codebase: adding features without breaking what people depend on, speeding up slow queries, and moving pieces onto newer stacks when it makes sense.',
    'Before Cloudstaff I built internal systems at Mariano Marcos State University, including POS, inventory, payroll, a document repository and COVID-19 contact tracing. Before that I built hospital systems for patient records and inventory. I like the unglamorous parts: approval flows, reports that HR actually trusts, and making sure the numbers add up.',
    'These days I also spend time on AI-assisted development: building guardrails and automation so AI agents help with coding, review and documentation without cutting corners.',
  ],
  facts: [
    { label: 'Years building production web apps', value: '5+' },
    { label: 'Staff using the system I maintain', value: '~7,000' },
    { label: 'BS Computer Science, MMSU', value: 'Cum laude' },
  ],
  trainings: ['Visual Graphics Design NC III', 'GitHub Training', 'AWS Training'],
}
