/**
 * Sample Demo Data for "Mysuru Institute of Technology"
 * Financial Year: 2024-2025
 * Currency: INR (₹)
 * 
 * Departments:
 * 1. CSE  - ₹10,00,000 allocated, ₹7,00,000 spent (70% - Healthy)
 * 2. ECE  - ₹8,00,000 allocated,  ₹7,50,000 spent (93.8% - Warning)
 * 3. ME   - ₹6,00,000 allocated,  ₹6,30,000 spent (105% - Overspent)
 * 4. CIVIL- ₹5,00,000 allocated,  ₹2,80,000 spent (56% - Healthy)
 * 5. AIDS - ₹7,00,000 allocated,  ₹5,80,000 spent (82.9% - Attention)
 */

export const COLLEGE = {
  id: 1,
  name: "Mysuru Institute of Technology",
  code: "MIT-MYS",
  financial_year: "2024-2025",
  total_budget_allocated: 3600000,
  currency: "INR",
  currency_symbol: "₹"
};

export const DEPARTMENTS = [
  {
    id: 1,
    college_id: 1,
    code: "CSE",
    name: "Computer Science & Engineering",
    head: "Dr. K. S. Ramanujam",
    created_at: "2024-04-01T00:00:00Z"
  },
  {
    id: 2,
    college_id: 1,
    code: "ECE",
    name: "Electronics & Communication Engineering",
    head: "Dr. Suma V.",
    created_at: "2024-04-01T00:00:00Z"
  },
  {
    id: 3,
    college_id: 1,
    code: "ME",
    name: "Mechanical Engineering",
    head: "Dr. Raghavendra Rao",
    created_at: "2024-04-01T00:00:00Z"
  },
  {
    id: 4,
    college_id: 1,
    code: "CIVIL",
    name: "Civil Engineering",
    head: "Dr. Manjunath Swamy",
    created_at: "2024-04-01T00:00:00Z"
  },
  {
    id: 5,
    college_id: 1,
    code: "AIDS",
    name: "Artificial Intelligence & Data Science",
    head: "Dr. Ananya Sharma",
    created_at: "2024-04-01T00:00:00Z"
  }
];

export const CATEGORIES = [
  "Infrastructure",
  "Equipment",
  "Laboratory",
  "Software",
  "Events",
  "Maintenance",
  "Training",
  "Research",
  "Travel",
  "Stationery",
  "Utilities",
  "Miscellaneous"
];

export const BUDGETS = [
  // 1. CSE Budgets (Total: ₹10,00,000, Planned: ₹8,50,000)
  { id: 101, college_id: 1, department_id: 1, financial_year: "2024-2025", category: "Equipment", allocated_amount: 300000, planned_amount: 250000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Computing servers & network switches", status: "ACTIVE" },
  { id: 102, college_id: 1, department_id: 1, financial_year: "2024-2025", category: "Software", allocated_amount: 250000, planned_amount: 220000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Cloud IDEs, MATLAB, JetBrains licenses", status: "ACTIVE" },
  { id: 103, college_id: 1, department_id: 1, financial_year: "2024-2025", category: "Events", allocated_amount: 150000, planned_amount: 120000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Annual Hackathon & National Symposium", status: "ACTIVE" },
  { id: 104, college_id: 1, department_id: 1, financial_year: "2024-2025", category: "Research", allocated_amount: 120000, planned_amount: 100000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Faculty research grants & publication fees", status: "ACTIVE" },
  { id: 105, college_id: 1, department_id: 1, financial_year: "2024-2025", category: "Training", allocated_amount: 80000, planned_amount: 70000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Cybersecurity workshop & certifications", status: "ACTIVE" },
  { id: 106, college_id: 1, department_id: 1, financial_year: "2024-2025", category: "Stationery", allocated_amount: 50000, planned_amount: 45000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Office supplies, answer scripts, printing", status: "ACTIVE" },
  { id: 107, college_id: 1, department_id: 1, financial_year: "2024-2025", category: "Maintenance", allocated_amount: 50000, planned_amount: 45000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Lab AC servicing & UPS battery upkeep", status: "ACTIVE" },

  // 2. ECE Budgets (Total: ₹8,00,000, Planned: ₹7,80,000)
  { id: 201, college_id: 1, department_id: 2, financial_year: "2024-2025", category: "Equipment", allocated_amount: 350000, planned_amount: 340000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Digital Storage Oscilloscopes & Spectrum Analyzers", status: "ACTIVE" },
  { id: 202, college_id: 1, department_id: 2, financial_year: "2024-2025", category: "Laboratory", allocated_amount: 200000, planned_amount: 190000, start_date: "2024-04-01", end_date: "2025-03-31", description: "VLSI FPGA trainer boards & sensors", status: "ACTIVE" },
  { id: 203, college_id: 1, department_id: 2, financial_year: "2024-2025", category: "Software", allocated_amount: 120000, planned_amount: 120000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Cadence EDA tools license", status: "ACTIVE" },
  { id: 204, college_id: 1, department_id: 2, financial_year: "2024-2025", category: "Maintenance", allocated_amount: 80000, planned_amount: 80000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Soldering station calibrations & repairs", status: "ACTIVE" },
  { id: 205, college_id: 1, department_id: 2, financial_year: "2024-2025", category: "Events", allocated_amount: 50000, planned_amount: 50000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Robotics club exhibition", status: "ACTIVE" },

  // 3. ME Budgets (Total: ₹6,00,000, Planned: ₹5,90,000)
  { id: 301, college_id: 1, department_id: 3, financial_year: "2024-2025", category: "Equipment", allocated_amount: 250000, planned_amount: 240000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Lathe tooling & 3D printer filament upgrades", status: "ACTIVE" },
  { id: 302, college_id: 1, department_id: 3, financial_year: "2024-2025", category: "Laboratory", allocated_amount: 150000, planned_amount: 150000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Thermodynamics test rig consumables", status: "ACTIVE" },
  { id: 303, college_id: 1, department_id: 3, financial_year: "2024-2025", category: "Maintenance", allocated_amount: 120000, planned_amount: 120000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Heavy machinery overhaul & lubrication", status: "ACTIVE" },
  { id: 304, college_id: 1, department_id: 3, financial_year: "2024-2025", category: "Stationery", allocated_amount: 40000, planned_amount: 40000, start_date: "2024-04-01", end_date: "2025-03-31", description: "CAD drawing sheets & manuals", status: "ACTIVE" },
  { id: 305, college_id: 1, department_id: 3, financial_year: "2024-2025", category: "Travel", allocated_amount: 40000, planned_amount: 40000, start_date: "2024-04-01", end_date: "2025-03-31", description: "SAE Baja competition student travel", status: "ACTIVE" },

  // 4. CIVIL Budgets (Total: ₹5,00,000, Planned: ₹4,50,000)
  { id: 401, college_id: 1, department_id: 4, financial_year: "2024-2025", category: "Laboratory", allocated_amount: 200000, planned_amount: 180000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Soil mechanics testing materials", status: "ACTIVE" },
  { id: 402, college_id: 1, department_id: 4, financial_year: "2024-2025", category: "Equipment", allocated_amount: 180000, planned_amount: 160000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Total Station calibration & survey kits", status: "ACTIVE" },
  { id: 403, college_id: 1, department_id: 4, financial_year: "2024-2025", category: "Software", allocated_amount: 70000, planned_amount: 65000, start_date: "2024-04-01", end_date: "2025-03-31", description: "AutoCAD & STAAD Pro educational license", status: "ACTIVE" },
  { id: 404, college_id: 1, department_id: 4, financial_year: "2024-2025", category: "Maintenance", allocated_amount: 50000, planned_amount: 45000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Hydraulics bench repairs", status: "ACTIVE" },

  // 5. AIDS Budgets (Total: ₹7,00,000, Planned: ₹6,50,000)
  { id: 501, college_id: 1, department_id: 5, financial_year: "2024-2025", category: "Equipment", allocated_amount: 320000, planned_amount: 300000, start_date: "2024-04-01", end_date: "2025-03-31", description: "GPU workstation for deep learning lab", status: "ACTIVE" },
  { id: 502, college_id: 1, department_id: 5, financial_year: "2024-2025", category: "Software", allocated_amount: 200000, planned_amount: 180000, start_date: "2024-04-01", end_date: "2025-03-31", description: "AWS Academy compute credits & weights & biases", status: "ACTIVE" },
  { id: 503, college_id: 1, department_id: 5, financial_year: "2024-2025", category: "Research", allocated_amount: 100000, planned_amount: 90000, start_date: "2024-04-01", end_date: "2025-03-31", description: "ArXiv publication grants & dataset purchases", status: "ACTIVE" },
  { id: 504, college_id: 1, department_id: 5, financial_year: "2024-2025", category: "Training", allocated_amount: 80000, planned_amount: 80000, start_date: "2024-04-01", end_date: "2025-03-31", description: "Generative AI industry bootcamp", status: "ACTIVE" }
];

export const EXPENSES = [
  // --- CSE Expenses (Total: ₹7,00,000 -> 70% of ₹10,00,000) ---
  { id: 1001, department_id: 1, category: "Equipment", description: "Edge AI GPU server nodes", amount: 210000, date: "2024-05-10", vendor: "Silicon Systems Mysuru", payment_method: "NEFT", receipt_url: "/receipts/cse-1001.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-05-10" },
  { id: 1002, department_id: 1, category: "Software", description: "Campus MATLAB license renewal", amount: 160000, date: "2024-06-15", vendor: "MathWorks India", payment_method: "NEFT", receipt_url: "/receipts/cse-1002.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-06-15" },
  { id: 1003, department_id: 1, category: "Events", description: "HackMIT 2024 college hackathon prizes & logistics", amount: 125000, date: "2024-07-22", vendor: "Apex Event Planners", payment_method: "CHEQUE", receipt_url: "/receipts/cse-1003.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-07-22" },
  { id: 1004, department_id: 1, category: "Research", description: "IEEE Transactions publication submission", amount: 75000, date: "2024-08-04", vendor: "IEEE Operations Center", payment_method: "CREDIT_CARD", receipt_url: "/receipts/cse-1004.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-08-04" },
  { id: 1005, department_id: 1, category: "Training", description: "Certified Kubernetes administrator trainer honorarium", amount: 60000, date: "2024-08-18", vendor: "CloudNative Training Hub", payment_method: "NEFT", receipt_url: "/receipts/cse-1005.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-08-18" },
  { id: 1006, department_id: 1, category: "Stationery", description: "Semester exam answer sheets - Lot 1", amount: 12000, date: "2024-04-18", vendor: "Chamundi Stationery", payment_method: "UPI", receipt_url: "/receipts/cse-1006.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-04-18" },
  { id: 1007, department_id: 1, category: "Stationery", description: "Printer toner cartridges - Lot 2", amount: 11000, date: "2024-06-02", vendor: "Chamundi Stationery", payment_method: "UPI", receipt_url: "/receipts/cse-1007.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-06-02" },
  { id: 1008, department_id: 1, category: "Stationery", description: "Lab record booklets - Lot 3", amount: 12000, date: "2024-07-11", vendor: "Chamundi Stationery", payment_method: "UPI", receipt_url: "/receipts/cse-1008.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-07-11" },
  { id: 1009, department_id: 1, category: "Maintenance", description: "Server Room UPS Battery replacement", amount: 35000, date: "2024-09-02", vendor: "Exide Power Systems", payment_method: "NEFT", receipt_url: "/receipts/cse-1009.pdf", approval_status: "APPROVED", created_by: 2, created_date: "2024-09-02" },

  // --- ECE Expenses (Total: ₹7,50,000 -> 93.75% of ₹8,00,000) --- [WARNING STATUS]
  { id: 2001, department_id: 2, category: "Equipment", description: "4-Channel 100MHz Digital Oscilloscopes (x4)", amount: 330000, date: "2024-04-25", vendor: "Tektronix India", payment_method: "NEFT", receipt_url: "/receipts/ece-2001.pdf", approval_status: "APPROVED", created_by: 3, created_date: "2024-04-25" },
  { id: 2002, department_id: 2, category: "Laboratory", description: "Xilinx Spartan-7 FPGA Dev Boards (x10)", amount: 195000, date: "2024-05-18", vendor: "CoreEL Technologies", payment_method: "NEFT", receipt_url: "/receipts/ece-2002.pdf", approval_status: "APPROVED", created_by: 3, created_date: "2024-05-18" },
  { id: 2003, department_id: 2, category: "Software", description: "Cadence Virtuoso layout license renewal", amount: 115000, date: "2024-06-10", vendor: "Cadence Design Systems", payment_method: "NEFT", receipt_url: "/receipts/ece-2003.pdf", approval_status: "APPROVED", created_by: 3, created_date: "2024-06-10" },
  { id: 2004, department_id: 2, category: "Maintenance", description: "Cleanroom Air Purifier & Calibration", amount: 65000, date: "2024-07-19", vendor: "Mysuru Clean Air Tech", payment_method: "CHEQUE", receipt_url: "/receipts/ece-2004.pdf", approval_status: "APPROVED", created_by: 3, created_date: "2024-07-19" },
  { id: 2005, department_id: 2, category: "Events", description: "State Level RoboSoccer Challenge kits", amount: 45000, date: "2024-08-28", vendor: "RoboKart Bangalore", payment_method: "NEFT", receipt_url: "/receipts/ece-2005.pdf", approval_status: "APPROVED", created_by: 3, created_date: "2024-08-28" },

  // --- ME Expenses (Total: ₹6,30,000 -> 105.0% of ₹6,00,000) --- [OVERSPENT STATUS]
  { id: 3001, department_id: 3, category: "Equipment", description: "Heavy Duty CNC Milling Cutter tooling set", amount: 260000, date: "2024-04-20", vendor: "Sandvik Coromant India", payment_method: "NEFT", receipt_url: "/receipts/me-3001.pdf", approval_status: "APPROVED", created_by: 4, created_date: "2024-04-20" },
  { id: 3002, department_id: 3, category: "Laboratory", description: "Universal Testing Machine sensor replacement", amount: 165000, date: "2024-06-05", vendor: "Fuel Instruments & Engineers", payment_method: "NEFT", receipt_url: "/receipts/me-3002.pdf", approval_status: "APPROVED", created_by: 4, created_date: "2024-06-05" },
  { id: 3003, department_id: 3, category: "Maintenance", description: "Hydraulic Press overhauling and oil flush", amount: 130000, date: "2024-07-14", vendor: "Karnataka Hydraulic Spares", payment_method: "CHEQUE", receipt_url: "/receipts/me-3003.pdf", approval_status: "APPROVED", created_by: 4, created_date: "2024-07-14" },
  { id: 3004, department_id: 3, category: "Travel", description: "BAJA SAE student team vehicle transport & travel", amount: 45000, date: "2024-08-12", vendor: "VRL Logistics", payment_method: "NEFT", receipt_url: "/receipts/me-3004.pdf", approval_status: "APPROVED", created_by: 4, created_date: "2024-08-12" },
  { id: 3005, department_id: 3, category: "Stationery", description: "Engineering drawing drafting sheets", amount: 30000, date: "2024-09-01", vendor: "Sri Venkateshwara Book House", payment_method: "UPI", receipt_url: "/receipts/me-3005.pdf", approval_status: "APPROVED", created_by: 4, created_date: "2024-09-01" },

  // --- CIVIL Expenses (Total: ₹2,80,000 -> 56.0% of ₹5,00,000) --- [HEALTHY STATUS]
  { id: 4001, department_id: 4, category: "Laboratory", description: "Concrete compression testing cuboids & cement batches", amount: 110000, date: "2024-05-12", vendor: "UltraTech Build Solutions", payment_method: "NEFT", receipt_url: "/receipts/civ-4001.pdf", approval_status: "APPROVED", created_by: 5, created_date: "2024-05-12" },
  { id: 4002, department_id: 4, category: "Equipment", description: "Total Station electronic prism accessories", amount: 95000, date: "2024-06-25", vendor: "Leica Geosystems India", payment_method: "NEFT", receipt_url: "/receipts/civ-4002.pdf", approval_status: "APPROVED", created_by: 5, created_date: "2024-06-25" },
  { id: 4003, department_id: 4, category: "Software", description: "STAAD.Pro annual academic subscription", amount: 45000, date: "2024-07-30", vendor: "Bentley Systems India", payment_method: "NEFT", receipt_url: "/receipts/civ-4003.pdf", approval_status: "APPROVED", created_by: 5, created_date: "2024-07-30" },
  { id: 4004, department_id: 4, category: "Maintenance", description: "Fluid mechanics flow nozzle recalibration", amount: 30000, date: "2024-08-15", vendor: "Pico Lab Instruments", payment_method: "CHEQUE", receipt_url: "/receipts/civ-4004.pdf", approval_status: "APPROVED", created_by: 5, created_date: "2024-08-15" },

  // --- AIDS Expenses (Total: ₹5,80,000 -> 82.86% of ₹7,00,000) --- [ATTENTION STATUS]
  { id: 5001, department_id: 5, category: "Equipment", description: "Dual NVIDIA RTX 4090 Workstations (x2)", amount: 285000, date: "2024-05-08", vendor: "Silicon Systems Mysuru", payment_method: "NEFT", receipt_url: "/receipts/aids-5001.pdf", approval_status: "APPROVED", created_by: 6, created_date: "2024-05-08" },
  { id: 5002, department_id: 5, category: "Software", description: "AWS cloud GPU spot instance vouchers", amount: 155000, date: "2024-06-14", vendor: "Amazon Web Services India", payment_method: "CREDIT_CARD", receipt_url: "/receipts/aids-5002.pdf", approval_status: "APPROVED", created_by: 6, created_date: "2024-06-14" },
  { id: 5003, department_id: 5, category: "Research", description: "OpenAI API tokens & CVPR paper submission fees", amount: 75000, date: "2024-07-28", vendor: "OpenAI / IEEE CVF", payment_method: "CREDIT_CARD", receipt_url: "/receipts/aids-5003.pdf", approval_status: "APPROVED", created_by: 6, created_date: "2024-07-28" },
  { id: 5004, department_id: 5, category: "Training", description: "Hands-on LLM fine-tuning expert workshop honorarium", amount: 65000, date: "2024-08-20", vendor: "DeepTech Learning Labs", payment_method: "NEFT", receipt_url: "/receipts/aids-5004.pdf", approval_status: "APPROVED", created_by: 6, created_date: "2024-08-20" }
];

export const BUDGET_REQUESTS = [
  {
    id: 901,
    department_id: 3, // ME
    requested_amount: 50000,
    category: "Equipment",
    reason: "Urgent replacement for burned spindle motor in CNC Milling Machine to allow 7th semester final year projects to continue.",
    supporting_document: "/docs/requests/me-cnc-quotation.pdf",
    date: "2024-09-05",
    status: "PENDING",
    reviewed_by: null,
    review_comment: null
  },
  {
    id: 902,
    department_id: 2, // ECE
    requested_amount: 40000,
    category: "Laboratory",
    reason: "Additional mixed-signal probe cables for VLSI lab test benches.",
    supporting_document: "/docs/requests/ece-probe-quote.pdf",
    date: "2024-09-02",
    status: "PENDING",
    reviewed_by: null,
    review_comment: null
  },
  {
    id: 903,
    department_id: 1, // CSE
    requested_amount: 80000,
    category: "Software",
    reason: "Additional AWS cloud student credits for GenAI elective course.",
    supporting_document: "/docs/requests/cse-aws-credits.pdf",
    date: "2024-07-10",
    status: "APPROVED",
    reviewed_by: 1,
    review_comment: "Approved as per Academic Council resolution for GenAI initiatives."
  }
];

export const USERS = [
  {
    id: 1,
    username: "college_admin",
    name: "Dr. H. N. Jagannatha",
    role: "COLLEGE_ADMIN",
    college_id: 1,
    department_id: null,
    email: "principal@mit-mysuru.ac.in"
  },
  {
    id: 2,
    username: "cse_admin",
    name: "Dr. K. S. Ramanujam",
    role: "DEPARTMENT_ADMIN",
    college_id: 1,
    department_id: 1,
    email: "hod.cse@mit-mysuru.ac.in"
  },
  {
    id: 3,
    username: "ece_admin",
    name: "Dr. Suma V.",
    role: "DEPARTMENT_ADMIN",
    college_id: 1,
    department_id: 2,
    email: "hod.ece@mit-mysuru.ac.in"
  },
  {
    id: 4,
    username: "me_admin",
    name: "Dr. Raghavendra Rao",
    role: "DEPARTMENT_ADMIN",
    college_id: 1,
    department_id: 3,
    email: "hod.me@mit-mysuru.ac.in"
  },
  {
    id: 5,
    username: "civil_admin",
    name: "Dr. Manjunath Swamy",
    role: "DEPARTMENT_ADMIN",
    college_id: 1,
    department_id: 4,
    email: "hod.civil@mit-mysuru.ac.in"
  },
  {
    id: 6,
    username: "aids_admin",
    name: "Dr. Ananya Sharma",
    role: "DEPARTMENT_ADMIN",
    college_id: 1,
    department_id: 5,
    email: "hod.aids@mit-mysuru.ac.in"
  }
];
