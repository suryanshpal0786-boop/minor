import bcrypt from 'bcryptjs';

// Clean initial state - No demo accounts
const users = [];

const analyses = [
  {
    _id: 'anl_001_cred',
    userId: null,
    submittedHeadline: 'James Webb Space Telescope Confirms Atmospheric Carbon Dioxide on Exoplanet WASP-39b',
    submittedContent:
      'Astronomers utilizing the James Webb Space Telescope have published peer-reviewed findings in Nature demonstrating unambiguous evidence of atmospheric carbon dioxide on WASP-39b. According to research teams from NASA, ESA, and CSA, high-precision transmission spectroscopy confirms the molecule with 5-sigma statistical certainty.',
    category: 'Science & Technology',
    sourceUrl: 'https://nasa.gov/webb-exoplanet-wasp39b',
    classification: 'Appears Credible',
    confidenceScore: 92,
    analysisSummary:
      'The content displays high stylistic objectivity, empirical scientific terminology, explicit institutional attribution (NASA, ESA, CSA), and direct reference to a peer-reviewed publication in Nature.',
    detailedReasoning:
      'Stylometric scan detected no emotional agitation, zero manipulative urgency triggers, and an objective tone. The article attributes key findings to verifiable organizations and cites concrete measurement instruments.',
    headlineAnalysis: {
      sensationalismScore: 10,
      clickbaitRating: 'Low',
      isManipulative: false,
      notes: 'Clear, factual headline stating the specific instrument, target exoplanet, and scientific discovery.',
    },
    languageAnalysis: {
      objectivityScore: 94,
      emotionalCharge: 'Objective / Measured',
      urgencyLevel: 'None',
      capitalizationAnomalies: 0,
      punctuationExcess: 0,
    },
    suspiciousIndicators: [],
    claimsToVerify: [
      {
        claim: 'Transmission spectroscopy confirms CO2 with 5-sigma statistical certainty',
        verificationStatus: 'Corroborated',
        note: 'Matches Nature paper peer-reviewed observational datasets.',
      },
    ],
    sourceAssessment: {
      publisher: 'National Aeronautics and Space Administration (NASA)',
      domain: 'nasa.gov',
      transparency: 'High',
      authorInfo: 'Official Scientific Communication Office',
      reliabilityTier: 'Authoritative / Verified',
      notes: 'Official government aerospace and scientific research repository.',
    },
    limitations:
      'This automated assessment evaluates linguistic patterns, attribution syntax, and domain verification. It does not replace independent astrophysical peer review.',
    recommendedVerificationSteps: [
      'Cross-reference the Nature journal DOI reference for raw spectroscopic data.',
      'Review corroborating press releases from the European Space Agency (ESA).',
    ],
    createdAt: new Date(Date.now() - 3600000 * 5),
    updatedAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    _id: 'anl_002_mislead',
    userId: null,
    submittedHeadline: 'Electric Vehicles Emit 400% More Pollution Than Gas Cars Over Their Lifespan',
    submittedContent:
      'A viral social media study claims that mining lithium causes more total environmental destruction than 20 years of gasoline exhaust. The post asserts that battery disposal will poison local water supplies within 18 months, citing unnamed European industry insiders.',
    category: 'Climate & Environment',
    sourceUrl: 'https://social-truth-network.fake/ev-myth',
    classification: 'Potentially Misleading',
    confidenceScore: 78,
    analysisSummary:
      'The article conflates initial manufacturing emissions with lifetime vehicle operation cycles, omitting standard lifecycle analysis (LCA) peer-reviewed baselines and relying on anonymous "insider" attribution.',
    detailedReasoning:
      'While lithium extraction carries genuine ecological footprint considerations, mainstream environmental engineering studies (such as the ICCT and Argonne National Lab GREET model) establish that EVs break even within 1.5 to 2 years of operation. The 400% figure represents an uncited cherry-picked extreme.',
    headlineAnalysis: {
      sensationalismScore: 68,
      clickbaitRating: 'Moderate',
      isManipulative: true,
      notes: 'Employs an extreme multiplier ("400% More Pollution") without context or timeframe boundary.',
    },
    languageAnalysis: {
      objectivityScore: 42,
      emotionalCharge: 'Alarmist / Anxious',
      urgencyLevel: 'Elevated',
      capitalizationAnomalies: 2,
      punctuationExcess: 1,
    },
    suspiciousIndicators: [
      {
        type: 'attribution',
        label: 'Anonymous Authority Reference',
        description: 'Uses vague phrases like "unnamed European industry insiders" without verifiable identities.',
        severity: 'medium',
      },
      {
        type: 'claim',
        label: 'Unsubstantiated Statistical Metric',
        description: 'The "400% more pollution" claim contradicts consensus life-cycle assessment models.',
        severity: 'high',
      },
    ],
    claimsToVerify: [
      {
        claim: 'Electric vehicles pollute 400% more than internal combustion vehicles over entire lifecycle',
        verificationStatus: 'Unsupported',
        note: 'Contradicted by EPA, ICCT, and peer-reviewed lifecycle analyses.',
      },
    ],
    sourceAssessment: {
      publisher: 'Social Truth Network Blog',
      domain: 'social-truth-network.fake',
      transparency: 'Low',
      authorInfo: 'Anonymous Contributor',
      reliabilityTier: 'Questionable',
      notes: 'No editorial board, corrections policy, or contact information available.',
    },
    limitations:
      'This analysis compares the submitted claims against established academic lifecycle emissions frameworks. Automated models cannot verify private proprietary corporate studies.',
    recommendedVerificationSteps: [
      'Examine EPA or ICCT comprehensive vehicle life-cycle reports.',
      'Check if the cited study was published in an accredited engineering or environmental journal.',
    ],
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    _id: 'anl_003_susp',
    userId: null,
    submittedHeadline: 'SHOCKING: Secret Government Directive Mandates Nighttime Frequency Transmissions!!',
    submittedContent:
      'LEAKED documents reveal that top officials are SILENT about a secret order to activate high-frequency microwave towers across major cities at midnight! Share this with 20 friends before Big Tech deletes this post forever! Doctors who speak out are having their licenses revoked!',
    category: 'Politics & Policy',
    sourceUrl: 'https://conspiracy-wire-now.fake/leaked-directive',
    classification: 'Suspicious',
    confidenceScore: 94,
    analysisSummary:
      'Severe markers of coordinated viral disinformation: high sensory arousal vocabulary, intimidation appeals, artificial urgency ("Share with 20 friends"), and zero empirical citations.',
    detailedReasoning:
      'Contains textbook hallmarks of manipulative fabrication. Excessive capitalization, multiple exclamation points, persecution narratives ("before Big Tech deletes this"), and absence of any verifiable governmental or medical documents.',
    headlineAnalysis: {
      sensationalismScore: 96,
      clickbaitRating: 'Extreme',
      isManipulative: true,
      notes: 'Employs screaming ALL-CAPS words ("SHOCKING", "LEAKED") and emergency punctuation.',
    },
    languageAnalysis: {
      objectivityScore: 6,
      emotionalCharge: 'Panic-Inducing / Paranoid',
      urgencyLevel: 'Emergency Solicitation',
      capitalizationAnomalies: 8,
      punctuationExcess: 5,
    },
    suspiciousIndicators: [
      {
        type: 'linguistic',
        label: 'Emotional Manipulation & Alarmism',
        description: 'Language is engineered to trigger immediate panic and defensive sharing behavior.',
        severity: 'high',
      },
      {
        type: 'linguistic',
        label: 'Viral Chain Solicitation',
        description: 'Coerces user to "Share this with 20 friends before it is deleted".',
        severity: 'high',
      },
      {
        type: 'claim',
        label: 'Unverifiable Conspiracy Narrative',
        description: 'Asserts secret governmental frequency directives with zero documentary or physical evidence.',
        severity: 'high',
      },
    ],
    claimsToVerify: [
      {
        claim: 'Government secretly activating microwave towers to transmit frequencies at midnight',
        verificationStatus: 'Unsupported',
        note: 'Completely ungrounded; physical electromagnetic spectrum is publicly monitored by telecommunications authorities.',
      },
    ],
    sourceAssessment: {
      publisher: 'Conspiracy Wire Now',
      domain: 'conspiracy-wire-now.fake',
      transparency: 'None',
      authorInfo: 'Unattributed',
      reliabilityTier: 'High Risk / Debunked',
      notes: 'Domain exhibits multiple historical flags for medical and civic hoaxes.',
    },
    limitations:
      'Automated analysis detects rhetorical and psychological persuasion signatures. It does not possess direct surveillance capabilities over telecommunications infrastructure.',
    recommendedVerificationSteps: [
      'Consult the Federal Communications Commission (FCC) or national telecommunications frequency registry.',
      'Check recognized fact-checking databases (e.g. PolitiFact, Snopes, AP Fact Check).',
    ],
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    _id: 'anl_004_inconc',
    userId: null,
    submittedHeadline: 'Local Startup Claims Breakthrough Solid-State Battery Yields 1,200km Range',
    submittedContent:
      'A regional clean-tech firm held a closed-door investor demo yesterday exhibiting a proprietary silicon-anode prototype that allegedly achieves double the energy density of commercial pouch cells. Independent automotive partners have not yet inspected the battery bench data.',
    category: 'Business & Economy',
    sourceUrl: 'https://tech-insider-daily.fake/solid-state-demo',
    classification: 'Inconclusive',
    confidenceScore: 62,
    analysisSummary:
      'The submission discusses early-stage private laboratory claims. Because no third-party benchmarking or published cell testing data is accessible, automated verification remains inconclusive.',
    detailedReasoning:
      'The text is measured and does not employ clickbait syntax. However, extraordinary technological claims from early-stage venture announcements cannot be empirically verified without independent laboratory testing reports.',
    headlineAnalysis: {
      sensationalismScore: 28,
      clickbaitRating: 'Low',
      isManipulative: false,
      notes: 'Attributes the claim properly with "Claims Breakthrough" rather than presenting it as established fact.',
    },
    languageAnalysis: {
      objectivityScore: 68,
      emotionalCharge: 'Neutral / Cautious',
      urgencyLevel: 'Normal',
      capitalizationAnomalies: 0,
      punctuationExcess: 0,
    },
    suspiciousIndicators: [
      {
        type: 'attribution',
        label: 'Awaiting Independent Corroboration',
        description: 'Third-party automotive partners and certification bodies have not yet verified laboratory data.',
        severity: 'low',
      },
    ],
    claimsToVerify: [
      {
        claim: 'Silicon-anode prototype delivers 1,200km range at commercial energy density',
        verificationStatus: 'Context Needed',
        note: 'Requires third-party cycle life and degradation testing reports.',
      },
    ],
    sourceAssessment: {
      publisher: 'Tech Insider Daily',
      domain: 'tech-insider-daily.fake',
      transparency: 'Moderate',
      authorInfo: 'Industry Reporter',
      reliabilityTier: 'Unverified / Independent',
      notes: 'Regional tech blog reporting on closed investor presentation.',
    },
    limitations:
      'Early-stage technological development claims cannot be verified through linguistic analysis alone. Physical laboratory replication is required.',
    recommendedVerificationSteps: [
      'Monitor for subsequent peer-reviewed technical whitepapers or SAE benchmark certifications.',
      'Await automotive OEM validation announcements.',
    ],
    createdAt: new Date(Date.now() - 3600000 * 72),
    updatedAt: new Date(Date.now() - 3600000 * 72),
  },
];

const savedReports = [];

const activityLogs = [];

export const memoryStore = {
  // USER METHODS
  findUserByEmail(email) {
    if (!email) return null;
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById(id) {
    if (!id) return null;
    return users.find((u) => u._id === id || u._id.toString() === id.toString()) || null;
  },

  createUser(userData) {
    const newUser = {
      _id: 'usr_' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },

  updateUser(id, updateData) {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, updateData, { updatedAt: new Date() });
    return user;
  },

  deleteUser(id) {
    const idx = users.findIndex((u) => u._id === id || u._id.toString() === id.toString());
    if (idx === -1) return false;
    users.splice(idx, 1);
    // Cascade delete analyses and saved reports
    for (let i = analyses.length - 1; i >= 0; i--) {
      if (analyses[i].userId === id) analyses.splice(i, 1);
    }
    for (let i = savedReports.length - 1; i >= 0; i--) {
      if (savedReports[i].userId === id) savedReports.splice(i, 1);
    }
    return true;
  },

  getAllUsers(query = {}) {
    let result = [...users];
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (query.status && query.status !== 'all') {
      result = result.filter((u) => u.status === query.status);
    }
    if (query.role && query.role !== 'all') {
      result = result.filter((u) => u.role === query.role);
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // ANALYSIS METHODS
  getAnalyses(filter = {}) {
    let result = [...analyses];
    if (filter.userId) {
      result = result.filter((a) => a.userId === filter.userId);
    }
    if (filter.category && filter.category !== 'all') {
      result = result.filter((a) => a.category === filter.category);
    }
    if (filter.classification && filter.classification !== 'all') {
      result = result.filter((a) => a.classification === filter.classification);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.submittedHeadline.toLowerCase().includes(q) ||
          a.submittedContent.toLowerCase().includes(q) ||
          (a.sourceAssessment?.domain || '').toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAnalysisById(id) {
    return analyses.find((a) => a._id === id || a._id.toString() === id.toString()) || null;
  },

  createAnalysis(data) {
    const newDoc = {
      _id: 'anl_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    analyses.unshift(newDoc);
    return newDoc;
  },

  deleteAnalysis(id, userId) {
    const idx = analyses.findIndex(
      (a) =>
        (a._id === id || a._id.toString() === id.toString()) &&
        (!userId || a.userId === userId || a.userId?.toString() === userId.toString())
    );
    if (idx === -1) return false;
    analyses.splice(idx, 1);
    // Also remove from saved reports
    for (let i = savedReports.length - 1; i >= 0; i--) {
      if (savedReports[i].analysisId === id) savedReports.splice(i, 1);
    }
    return true;
  },

  // SAVED REPORT METHODS
  getSavedReports(userId) {
    const userSaves = savedReports.filter(
      (s) => s.userId === userId || s.userId?.toString() === userId?.toString()
    );
    return userSaves
      .map((s) => {
        const analysis = this.getAnalysisById(s.analysisId);
        return {
          _id: s._id,
          userId: s.userId,
          analysisId: s.analysisId,
          analysis,
          notes: s.notes,
          createdAt: s.createdAt,
        };
      })
      .filter((s) => s.analysis !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  saveReport(userId, analysisId, notes = '') {
    const exists = savedReports.find(
      (s) =>
        (s.userId === userId || s.userId?.toString() === userId.toString()) &&
        (s.analysisId === analysisId || s.analysisId?.toString() === analysisId.toString())
    );
    if (exists) return { saved: exists, alreadySaved: true };

    const newSave = {
      _id: 'sav_' + Math.random().toString(36).substring(2, 9),
      userId,
      analysisId,
      notes,
      createdAt: new Date(),
    };
    savedReports.unshift(newSave);
    return { saved: newSave, alreadySaved: false };
  },

  removeSavedReport(userId, analysisId) {
    const idx = savedReports.findIndex(
      (s) =>
        (s.userId === userId || s.userId?.toString() === userId.toString()) &&
        (s.analysisId === analysisId || s.analysisId?.toString() === analysisId.toString())
    );
    if (idx === -1) return false;
    savedReports.splice(idx, 1);
    return true;
  },

  isReportSaved(userId, analysisId) {
    return savedReports.some(
      (s) =>
        (s.userId === userId || s.userId?.toString() === userId.toString()) &&
        (s.analysisId === analysisId || s.analysisId?.toString() === analysisId.toString())
    );
  },

  // ACTIVITY LOGS
  logActivity(data) {
    const log = {
      _id: 'act_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      ...data,
    };
    activityLogs.unshift(log);
    if (activityLogs.length > 500) activityLogs.pop();
    return log;
  },

  getActivityLogs(limit = 50) {
    return [...activityLogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  // SYSTEM STATS
  getSystemStats() {
    const totalUsers = users.length;
    const totalAnalyses = analyses.length;
    const distribution = {
      appearsCredible: analyses.filter((a) => a.classification === 'Appears Credible').length,
      potentiallyMisleading: analyses.filter((a) => a.classification === 'Potentially Misleading')
        .length,
      suspicious: analyses.filter((a) => a.classification === 'Suspicious').length,
      inconclusive: analyses.filter((a) => a.classification === 'Inconclusive').length,
    };
    return {
      totalUsers,
      totalAnalyses,
      distribution,
      systemStatus: 'Operational',
      uptime: process.uptime(),
    };
  },
};
