// server/data/mockData.js

export const DOMAINS = [
  {
    id: "software-engineering",
    name: "Software Engineering",
    icon: "Code2",
    description: "Full Stack Web & Distributed Backend Systems Engineering",
    standards: [
      { name: "Data Structures & Algorithms", reqLevel: 85 },
      { name: "System Design & Architecture", reqLevel: 80 },
      { name: "Frontend Development (React/CSS)", reqLevel: 75 },
      { name: "Backend APIs & Databases (Node/SQL)", reqLevel: 85 },
      { name: "Git Version Control & CI/CD", reqLevel: 70 },
      { name: "Cloud & Containerization (Docker/AWS)", reqLevel: 65 }
    ],
    courseRecommendations: [
      { id: "se-1", title: "Mastering Distributed System Design", platform: "SkillBridge Learn", duration: "6 Weeks", level: "Advanced", skillCovered: "System Design & Architecture", link: "#" },
      { id: "se-2", title: "Docker & Kubernetes for Developers", platform: "Cloud Academy", duration: "4 Weeks", level: "Intermediate", skillCovered: "Cloud & Containerization (Docker/AWS)", link: "#" },
      { id: "se-3", title: "Advanced Data Structures & Algorithms", platform: "Coursera / SkillBridge", duration: "8 Weeks", level: "Advanced", skillCovered: "Data Structures & Algorithms", link: "#" },
      { id: "se-4", title: "Production Grade Node.js APIs & Microservices", platform: "Udemy Certified", duration: "5 Weeks", level: "Intermediate", skillCovered: "Backend APIs & Databases (Node/SQL)", link: "#" }
    ]
  },
  {
    id: "data-science-ai",
    name: "Data Science & AI",
    icon: "BrainCircuit",
    description: "Machine Learning, Deep Learning, Predictive Analytics & MLOps",
    standards: [
      { name: "Python & Data Wrangling", reqLevel: 90 },
      { name: "Machine Learning Algorithms", reqLevel: 85 },
      { name: "Deep Learning & Neural Networks", reqLevel: 80 },
      { name: "SQL & Data Warehousing", reqLevel: 75 },
      { name: "Statistics & Probability", reqLevel: 85 },
      { name: "MLOps & Model Deployment", reqLevel: 70 }
    ],
    courseRecommendations: [
      { id: "ds-1", title: "Applied Deep Learning with PyTorch & TensorFlow", platform: "DeepLearning.AI", duration: "8 Weeks", level: "Advanced", skillCovered: "Deep Learning & Neural Networks", link: "#" },
      { id: "ds-2", title: "MLOps: Deploying Production Machine Learning Models", platform: "SkillBridge Pro", duration: "6 Weeks", level: "Advanced", skillCovered: "MLOps & Model Deployment", link: "#" },
      { id: "ds-3", title: "Advanced SQL & Big Data Analytics", platform: "DataCamp", duration: "4 Weeks", level: "Intermediate", skillCovered: "SQL & Data Warehousing", link: "#" }
    ]
  },
  {
    id: "cyber-security",
    name: "Cyber Security & Defense",
    icon: "ShieldAlert",
    description: "Ethical Hacking, Network Security, Penetration Testing & Cryptography",
    standards: [
      { name: "Network Security & Protocols", reqLevel: 85 },
      { name: "Ethical Hacking & PenTesting", reqLevel: 80 },
      { name: "OWASP & Web Security", reqLevel: 80 },
      { name: "Cryptography & PKI", reqLevel: 75 },
      { name: "SOC Incident Response & Forensics", reqLevel: 70 },
      { name: "Linux Administration", reqLevel: 80 }
    ],
    courseRecommendations: [
      { id: "cs-1", title: "Certified Ethical Hacking & Web PenTesting", platform: "OffSec / SkillBridge", duration: "10 Weeks", level: "Advanced", skillCovered: "Ethical Hacking & PenTesting", link: "#" },
      { id: "cs-2", title: "OWASP Top 10 Vulnerability Remediation", platform: "SkillBridge Learn", duration: "3 Weeks", level: "Intermediate", skillCovered: "OWASP & Web Security", link: "#" }
    ]
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps Engineering",
    icon: "Cloud",
    description: "Cloud Architecture (AWS/Azure), Infrastructure as Code & Automation",
    standards: [
      { name: "AWS / Azure Cloud Architecture", reqLevel: 85 },
      { name: "Docker & Container Orchestration", reqLevel: 85 },
      { name: "CI/CD Pipeline Automation", reqLevel: 80 },
      { name: "Terraform & IaC", reqLevel: 75 },
      { name: "Linux Administration & Bash", reqLevel: 80 },
      { name: "Monitoring & Log Management", reqLevel: 70 }
    ],
    courseRecommendations: [
      { id: "cd-1", title: "AWS Solutions Architect Certification Mastery", platform: "AWS Academy", duration: "6 Weeks", level: "Advanced", skillCovered: "AWS / Azure Cloud Architecture", link: "#" },
      { id: "cd-2", title: "Terraform Infrastructure as Code Complete Guide", platform: "HashiCorp SkillBridge", duration: "4 Weeks", level: "Intermediate", skillCovered: "Terraform & IaC", link: "#" }
    ]
  },
  {
    id: "core-engineering",
    name: "Core Engineering & Embedded Systems",
    icon: "Cpu",
    description: "VLSI Design, Embedded C, Microcontrollers, CAD & Robotics",
    standards: [
      { name: "Embedded C / C++ Programming", reqLevel: 85 },
      { name: "Microcontrollers & ARM Architecture", reqLevel: 80 },
      { name: "VLSI & Digital Signal Processing", reqLevel: 75 },
      { name: "RTOS (Real-Time Operating Systems)", reqLevel: 70 },
      { name: "CAD/CAM Mechanical Design", reqLevel: 70 },
      { name: "Hardware Troubleshooting & Oscilloscopes", reqLevel: 65 }
    ],
    courseRecommendations: [
      { id: "ce-1", title: "Embedded Systems Development with ARM Cortex-M", platform: "SkillBridge Hardware Lab", duration: "8 Weeks", level: "Advanced", skillCovered: "Microcontrollers & ARM Architecture", link: "#" },
      { id: "ce-2", title: "Real-Time Operating Systems (FreeRTOS) Practical Guide", platform: "SkillBridge Pro", duration: "5 Weeks", level: "Intermediate", skillCovered: "RTOS (Real-Time Operating Systems)", link: "#" }
    ]
  },
  {
    id: "management-analytics",
    name: "Tech Product & Business Analytics",
    icon: "Briefcase",
    description: "Agile Management, Product Strategy, Business Intelligence & Financial Modeling",
    standards: [
      { name: "Product Strategy & Management", reqLevel: 80 },
      { name: "Agile & Scrum Frameworks", reqLevel: 85 },
      { name: "Data Analytics (SQL, Tableau, Excel)", reqLevel: 80 },
      { name: "User Research & Prototyping", reqLevel: 75 },
      { name: "Market Research & Competitor Analysis", reqLevel: 70 },
      { name: "Financial Modeling & KPIs", reqLevel: 65 }
    ],
    courseRecommendations: [
      { id: "ma-1", title: "Product Manager Technical Roadmap & Metrics", platform: "PM Alliance", duration: "6 Weeks", level: "Intermediate", skillCovered: "Product Strategy & Management", link: "#" },
      { id: "ma-2", title: "Business Intelligence with Tableau & SQL", platform: "Coursera", duration: "4 Weeks", level: "Intermediate", skillCovered: "Data Analytics (SQL, Tableau, Excel)", link: "#" }
    ]
  }
];

export const INITIAL_ASSESSMENTS = {
  "software-engineering": [
    {
      id: "se-q1",
      question: "Which data structure provides average O(1) time complexity for insertion, deletion, and search operations?",
      options: ["Binary Search Tree", "Hash Table", "AVL Tree", "Linked List"],
      correctIndex: 1,
      explanation: "Hash Tables utilize key hashing for O(1) average time lookup, insertion, and deletion."
    },
    {
      id: "se-q2",
      question: "What is the primary benefit of using Docker containerization over traditional Virtual Machines?",
      options: [
        "Containers include a full hypervisor layer",
        "Containers share the host OS kernel resulting in lower resource overhead and faster startup",
        "Containers do not require any configuration files",
        "Containers run slower but with double encryption"
      ],
      correctIndex: 1,
      explanation: "Containers share the host kernel instead of running guest OS instances, making them lightweight and fast."
    },
    {
      id: "se-q3",
      question: "In RESTful API design, which HTTP method is typically idempotent and used to replace an existing resource completely?",
      options: ["POST", "PUT", "PATCH", "CONNECT"],
      correctIndex: 1,
      explanation: "PUT is idempotent and replaces the entire target resource with the request payload."
    },
    {
      id: "se-q4",
      question: "In Database design, what does ACID stand for?",
      options: [
        "Array, Cache, Index, Document",
        "Atomicity, Consistency, Isolation, Durability",
        "Async, Concurrent, Internal, Distributed",
        "Access, Control, Interface, Domain"
      ],
      correctIndex: 1,
      explanation: "ACID principles guarantee reliable database transaction processing."
    },
    {
      id: "se-q5",
      question: "In React, what is the key purpose of the useEffect hook?",
      options: [
        "To manage global Redux state",
        "To perform side effects such as data fetching, subscriptions, or DOM mutations",
        "To compile JSX into browser assembly",
        "To replace standard JavaScript CSS classes"
      ],
      correctIndex: 1,
      explanation: "useEffect allows React components to handle lifecycle side effects."
    }
  ],
  "data-science-ai": [
    {
      id: "ds-q1",
      question: "Which machine learning evaluation metric is most appropriate for a severely imbalanced classification dataset?",
      options: ["Accuracy", "F1-Score / PR-AUC", "Mean Squared Error", "R-Squared"],
      correctIndex: 1,
      explanation: "F1-Score balances Precision and Recall, which is crucial for imbalanced classes where Accuracy can be misleading."
    },
    {
      id: "ds-q2",
      question: "What problem does the Dropout technique address in Deep Neural Networks?",
      options: ["Underfitting", "Overfitting by randomly deactivating neurons during training", "Vanishing Gradients", "Data Imbalance"],
      correctIndex: 1,
      explanation: "Dropout prevents co-adaptation of features by randomly dropping out units, reducing overfitting."
    },
    {
      id: "ds-q3",
      question: "What is the main function of the Transformer architecture's Self-Attention mechanism?",
      options: [
        "To compute simple average of all tokens",
        "To dynamically weigh the contextual relationships between all words in a sequence regardless of distance",
        "To encrypt output embeddings",
        "To reduce dimension using PCA"
      ],
      correctIndex: 1,
      explanation: "Self-attention computes dynamic weights representing how much each token relates to every other token in the context."
    },
    {
      id: "ds-q4",
      question: "In Python Pandas, which method is used to combine two DataFrames based on a shared key column?",
      options: ["pd.concat()", "pd.merge()", "pd.join_all()", "pd.slice()"],
      correctIndex: 1,
      explanation: "pd.merge() executes SQL-style database joins on key columns."
    }
  ],
  "cyber-security": [
    {
      id: "cs-q1",
      question: "What type of cyber attack involves manipulating a database query via unsanitized input fields?",
      options: ["Cross-Site Scripting (XSS)", "SQL Injection (SQLi)", "Man-in-the-Middle (MitM)", "Buffer Overflow"],
      correctIndex: 1,
      explanation: "SQL Injection injects malicious SQL payload into input fields to bypass auth or extract data."
    },
    {
      id: "cs-q2",
      question: "What is the main difference between Symmetric and Asymmetric Encryption?",
      options: [
        "Symmetric uses one shared secret key, while Asymmetric uses a public and private key pair",
        "Symmetric is only used for emails",
        "Asymmetric uses single key while Symmetric uses 3 keys",
        "Symmetric cannot encrypt text"
      ],
      correctIndex: 0,
      explanation: "Symmetric uses the same key for encryption/decryption; Asymmetric uses public key to encrypt and private key to decrypt."
    }
  ],
  "cloud-devops": [
    {
      id: "cd-q1",
      question: "In Kubernetes architecture, what component manages the state of the cluster and schedules pods onto worker nodes?",
      options: ["Kubelet", "Control Plane (kube-scheduler & kube-apiserver)", "Ingress Controller", "Container Runtime"],
      correctIndex: 1,
      explanation: "The Kubernetes Control Plane handles scheduling, API management, and cluster state maintenance."
    }
  ],
  "core-engineering": [
    {
      id: "ce-q1",
      question: "In microcontrollers, what is an Interrupt Service Routine (ISR)?",
      options: [
        "A background loop that runs continuously",
        "A high-priority callback function triggered by hardware/software interrupts to execute immediately",
        "A power savings mode",
        "A compiler optimization tool"
      ],
      correctIndex: 1,
      explanation: "ISRs handle urgent hardware events immediately by temporarily pausing main execution."
    }
  ],
  "management-analytics": [
    {
      id: "ma-q1",
      question: "In Agile Scrum framework, who is primarily responsible for managing and prioritizing the Product Backlog?",
      options: ["Scrum Master", "Product Owner", "Lead Developer", "QA Manager"],
      correctIndex: 1,
      explanation: "The Product Owner defines backlogs and prioritizes user stories based on customer and business value."
    }
  ]
};

export const INITIAL_JOBS = [
  {
    id: "job-101",
    title: "Junior Full Stack Engineer",
    company: "Apex Global Tech",
    logo: "⚡",
    location: "Remote / Hybrid (Bengaluru, IN)",
    type: "Full Time",
    domain: "software-engineering",
    stipend: "$75,000 - $95,000 / yr",
    description: "Looking for a passionate junior developer skilled in React, Node.js, REST APIs, and SQL. Candidates with verified SkillBridge status given priority!",
    requiredSkills: ["Data Structures & Algorithms", "Frontend Development (React/CSS)", "Backend APIs & Databases (Node/SQL)", "Git Version Control & CI/CD"],
    minScoreRequired: 50,
    applicants: 14
  },
  {
    id: "job-102",
    title: "AI / ML Research Associate",
    company: "NeuralMind Labs",
    logo: "🧠",
    location: "San Francisco, CA / Remote",
    type: "Internship",
    domain: "data-science-ai",
    stipend: "$4,500 / month",
    description: "Assist in developing deep learning models, training PyTorch architectures, and evaluating datasets for computer vision and NLP apps.",
    requiredSkills: ["Python & Data Wrangling", "Machine Learning Algorithms", "Deep Learning & Neural Networks", "Statistics & Probability"],
    minScoreRequired: 60,
    applicants: 22
  },
  {
    id: "job-103",
    title: "Cloud Infrastructure Specialist",
    company: "Skyline Cloud Networks",
    logo: "☁️",
    location: "Austin, TX / Remote",
    type: "Full Time",
    domain: "cloud-devops",
    stipend: "$85,000 - $110,000 / yr",
    description: "Deploy and manage AWS infrastructure, Docker containers, Kubernetes clusters, and automated Terraform CI/CD pipelines.",
    requiredSkills: ["AWS / Azure Cloud Architecture", "Docker & Container Orchestration", "CI/CD Pipeline Automation", "Linux Administration & Bash"],
    minScoreRequired: 50,
    applicants: 9
  },
  {
    id: "job-104",
    title: "Junior Security Operations Analyst",
    company: "CyberGuard Defense",
    logo: "🛡️",
    location: "Hybrid (New York, NY)",
    type: "Full Time",
    domain: "cyber-security",
    stipend: "$80,000 - $100,000 / yr",
    description: "Monitor SIEM alerts, perform vulnerability assessment, conduct web security audits using OWASP standards, and patch network flaws.",
    requiredSkills: ["Network Security & Protocols", "Ethical Hacking & PenTesting", "OWASP & Web Security", "Linux Administration"],
    minScoreRequired: 50,
    applicants: 18
  },
  {
    id: "job-105",
    title: "Associate Product Manager (APM)",
    company: "Vanguard Tech Solutions",
    logo: "🚀",
    location: "Seattle, WA / Remote",
    type: "Full Time",
    domain: "management-analytics",
    stipend: "$90,000 - $115,000 / yr",
    description: "Drive product requirements, work closely with software engineering teams, run user research experiments, and analyze growth metrics.",
    requiredSkills: ["Product Strategy & Management", "Agile & Scrum Frameworks", "Data Analytics (SQL, Tableau, Excel)", "User Research & Prototyping"],
    minScoreRequired: 50,
    applicants: 31
  },
  {
    id: "job-106",
    title: "Embedded Hardware & Firmware Intern",
    company: "RoboPulse Dynamics",
    logo: "🤖",
    location: "Boston, MA",
    type: "Internship",
    domain: "core-engineering",
    stipend: "$3,800 / month",
    description: "Develop C/C++ firmware for microcontrollers (ARM Cortex), test sensor interfaces, and debug embedded RTOS applications.",
    requiredSkills: ["Embedded C / C++ Programming", "Microcontrollers & ARM Architecture", "VLSI & Digital Signal Processing"],
    minScoreRequired: 50,
    applicants: 7
  }
];

export const INITIAL_CHAT_MESSAGES = {
  "software-engineering": [
    {
      id: "msg-1",
      sender: "Rohan_Dev",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      content: "Hey everyone! Has anyone completed the System Design course module on SkillBridge? Looking for a study partner for load balancing concepts.",
      timestamp: "10:15 AM",
      flagged: false
    },
    {
      id: "msg-2",
      sender: "Elena_V",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      content: "Yes! I just finished the Docker containerization lab. Happy to review microservices and load balancing together!",
      timestamp: "10:18 AM",
      flagged: false
    },
    {
      id: "msg-3",
      sender: "SkillBridge Moderation Bot",
      role: "system",
      avatar: "🤖",
      content: "📌 Reminder: All discussions in this room must remain academic and career-focused. Automated AI filter is active.",
      timestamp: "10:20 AM",
      flagged: false
    }
  ],
  "data-science-ai": [
    {
      id: "msg-ds1",
      sender: "Marcus_AI",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      content: "Can someone clarify when to use PyTorch vs TensorFlow for NLP projects? Preparing for the NeuralMind assessment.",
      timestamp: "09:40 AM",
      flagged: false
    }
  ]
};

export const INITIAL_USERS = [
  {
    id: "user-student-1",
    email: "alex.student@skillbridge.edu",
    password: "password123",
    name: "Alex Rivera",
    role: "student",
    institution: "Apex Institute of Technology",
    targetDomain: "software-engineering",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    credentials: [
      {
        id: "cred-1",
        title: "Meta Front-End Developer Professional Certificate",
        type: "certification",
        issuer: "Coursera / Meta",
        date: "2026-04-15",
        verified: true,
        skillsExtracted: ["Frontend Development (React/CSS)", "Git Version Control & CI/CD"]
      },
      {
        id: "cred-2",
        title: "Full-Stack E-Commerce Platform with Node.js & React",
        type: "project",
        issuer: "GitHub Project",
        date: "2026-06-20",
        verified: true,
        skillsExtracted: ["Backend APIs & Databases (Node/SQL)", "Frontend Development (React/CSS)"]
      },
      {
        id: "cred-3",
        title: "CS301: Advanced Data Structures & Algorithms",
        type: "coursework",
        issuer: "Apex Institute of Technology",
        date: "2026-05-10",
        verified: true,
        skillsExtracted: ["Data Structures & Algorithms"]
      }
    ],
    assessmentScores: {
      "software-engineering": {
        score: 80,
        date: "2026-09-20",
        eligible: true
      }
    },
    bio: "Computer Science senior eager to step into full-stack software development and distributed cloud systems."
  },
  {
    id: "user-institution-1",
    email: "mit.admin@university.edu",
    password: "password123",
    name: "Apex Institute of Technology",
    role: "institution",
    institutionName: "Apex Institute of Technology",
    location: "Boston, MA",
    studentCount: 420,
    placementRate: 78,
    avatar: "🏛️",
    announcements: [
      { id: "ann-1", title: "New Distributed Systems Lab Access Granted", date: "2026-09-22", content: "All CS students can now access AWS cloud server instances via the student portal." }
    ]
  },
  {
    id: "user-industry-1",
    email: "recruiter@techcorp.com",
    password: "password123",
    name: "Apex Global Tech",
    role: "industry",
    companyName: "Apex Global Tech",
    industryType: "Enterprise Software & Cloud",
    avatar: "🏢",
    activeJobsCount: 4
  }
];
