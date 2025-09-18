import type { IAssessment } from "@/db";
import { delay } from "msw";

export const randomDelay = async () => await delay(Math.random() * (1200 - 200) + 200);
export const shouldError = (rate = 0.10) => Math.random() < rate; // 10% error rate

export const ASSESSMENT_TEMPLATES : IAssessment[] = [
    {
        id: '1',
        jobTitle: "Senior Frontend Developer",
        jobId: '',
        sections: [
            {
                id: '',
                title: "Technical Proficiency",
                description: "This section evaluates your technical knowledge and problem-solving abilities in frontend development.",
                questions: [
                    { id: 'fe-q1-framework', label: "Which JavaScript framework are you most experienced with?", type: 'single-choice', options: ['React', 'Vue', 'Angular', 'Svelte'], validations: { required: true } },
                    { id: 'fe-q2-ts', label: "Please rate your proficiency in TypeScript on a scale of 1 to 10.", type: 'numeric', validations: { required: true, range: { min: 1, max: 10 } } },
                    { id: 'fe-q3-state', label: "Which state management libraries have you used?", type: 'multi-choice', options: ['Redux/RTK', 'Zustand', 'Pinia', 'MobX', 'Context API'], validations: { required: true } },
                    { id: 'fe-q4-conditional-react', label: "Specifically for React, have you used server components?", type: 'single-choice', options: ['Yes', 'No'], conditions: [{ questionId: 'fe-q1-framework', operator: '===', value: 'React' }] },
                    { id: 'fe-q5-complex-ui', label: "Describe the most complex UI component you have built and the challenges you faced.", type: 'long-text', validations: { required: true, maxLength: 3000 } },
                    { id: 'fe-q6-performance', label: "How would you diagnose and fix a performance bottleneck in a web application?", type: 'long-text', validations: { required: true } },
                    { id: 'fe-q7-code-sample', label: "Optional: Please upload a code sample of a custom hook or component you're proud of.", type: 'file-upload' },
                ]
            },
            {
                id: '2',
                title: "Problem Solving & Collaboration",
                description: "This section helps us understand your work style and how you handle workplace situations.",
                questions: [
                    { id: 'fe-q8-code-review', label: "What do you look for when conducting a code review for a teammate?", type: 'short-text', validations: { required: true, maxLength: 500 } },
                    { id: 'fe-q9-agile', label: "Have you worked in an Agile/Scrum environment?", type: 'single-choice', options: ['Yes, extensively', 'Yes, sometimes', 'No'], validations: { required: true } },
                    { id: 'fe-q10-disagreement', label: "Describe a time you had a technical disagreement with a colleague and how you resolved it.", type: 'long-text', validations: { required: true } },
                    { id: 'fe-q11-learning', label: "How do you stay up-to-date with the fast-paced evolution of frontend technologies?", type: 'short-text', validations: { required: true } },
                    { id: 'fe-q12-deployment', label: "What is your experience with CI/CD pipelines for frontend applications?", type: 'short-text', validations: { required: false } },
                ]
            }
        ]
    },
    {
        id: '2',
        jobTitle: "Backend (Node.js) Engineer",
        jobId:'2',
        sections: [
            {
                id: '3',
                title: "Core Concepts & Architecture",
                description: "Evaluating your understanding of backend principles and system design.",
                questions: [
                    { id: 'be-q1-database', label: "Which database technology are you most comfortable with?", type: 'single-choice', options: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'], validations: { required: true } },
                    { id: 'be-q2-rest-graphql', label: "In your own words, describe the main differences between REST and GraphQL.", type: 'long-text', validations: { required: true, maxLength: 2000 } },
                    { id: 'be-q3-caching', label: "How would you design a caching strategy for a high-traffic API endpoint?", type: 'long-text', validations: { required: true } },
                    { id: 'be-q4-idempotency', label: "Explain the concept of idempotency and why it's important in API design.", type: 'short-text', validations: { required: true } },
                    { id: 'be-q5-microservices', label: "What are the potential benefits and drawbacks of a microservices architecture?", type: 'long-text', validations: { required: true } },
                    { id: 'be-q6-message-brokers', label: "Which message brokers or event streaming platforms have you worked with?", type: 'multi-choice', options: ['RabbitMQ', 'Kafka', 'AWS SQS/SNS', 'None of the above'] },
                ]
            },
            {
                id: '4',
                title: "Practical Skills & Deployment",
                description: "Assessing your hands-on experience with tools and technologies.",
                questions: [
                    { id: 'be-q7-docker', label: "Have you used Docker for containerizing applications?", type: 'single-choice', options: ['Yes', 'No'], validations: { required: true } },
                    { id: 'be-q8-docker-compose', label: "If yes, describe a use case where you've used Docker Compose.", type: 'short-text', validations: { required: true, maxLength: 500 }, conditions: [{ questionId: 'be-q7-docker', operator: '===', value: 'Yes' }] },
                    { id: 'be-q9-cloud', label: "Which cloud provider do you have the most experience with?", type: 'single-choice', options: ['AWS', 'Google Cloud (GCP)', 'Microsoft Azure', 'Other'], validations: { required: true } },
                    { id: 'be-q10-testing', label: "Describe your approach to testing in a Node.js application (unit, integration, e2e).", type: 'long-text', validations: { required: true } },
                    { id: 'be-q11-auth', label: "What authentication/authorization strategies have you implemented (e.g., JWT, OAuth)?", type: 'short-text', validations: { required: true } },
                ]
            }
        ]
    },
    {
        id:'3',
        jobTitle: "Product Manager",
        jobId:'3',
        sections: [
            {
                id: '1',
                title: "Product Strategy & Vision",
                description: "Understanding your approach to product planning and market analysis.",
                questions: [
                    { id: 'pm-q1-research', label: "How do you conduct market research to identify and validate user needs?", type: 'long-text', validations: { required: true } },
                    { id: 'pm-q2-roadmap', label: "Describe your process for creating and maintaining a product roadmap.", type: 'long-text', validations: { required: true } },
                    { id: 'pm-q3-prioritization', label: "Which product prioritization frameworks are you most familiar with?", type: 'multi-choice', options: ['RICE', 'MoSCoW', 'Kano Model', 'Value vs. Effort Matrix'], validations: { required: true } },
                    { id: 'pm-q4-kpis', label: "How would you define and measure the key success metrics (KPIs) for a new feature launch?", type: 'long-text', validations: { required: true } },
                    { id: 'pm-q5-ab-testing', label: "Describe your experience with A/B testing and data-driven decision-making.", type: 'short-text', validations: { required: false, maxLength: 500 } },
                ]
            },
            {
                id: '2',
                title: "Execution & Communication",
                description: "Evaluating your ability to work with teams and stakeholders to deliver value.",
                questions: [
                    { id: 'pm-q6-experience', label: "How many years of formal Product Management experience do you have?", type: 'numeric', validations: { required: true, range: {min: 0, max: 25} } },
                    { id: 'pm-q7-collaboration', label: "How do you collaborate with engineering and design teams to ensure requirements are understood and executed well?", type: 'long-text', validations: { required: true } },
                    { id: 'pm-q8-saying-no', label: "Describe a time you had to say 'no' to a feature request from an important stakeholder. How did you handle it?", type: 'long-text', validations: { required: true } },
                    { id: 'pm-q9-tools', label: "Which tools do you primarily use for project management and documentation?", type: 'multi-choice', options: ['Jira & Confluence', 'Asana', 'Linear', 'Notion', 'Trello'] },
                    { id: 'pm-q10-feedback', label: "What is your process for gathering, analyzing, and acting on user feedback?", type: 'short-text', validations: { required: true } },
                ]
            }
        ]
    }
];