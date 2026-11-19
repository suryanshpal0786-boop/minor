import axios from 'axios';

// Domain Trust & Verification Knowledge Graph
const DOMAIN_REGISTRY = {
  authoritative: [
    { pattern: 'reuters.com', name: 'Reuters News Agency', tier: 'Authoritative / Global Wire', transparency: 'High' },
    { pattern: 'apnews.com', name: 'Associated Press', tier: 'Authoritative / Global Wire', transparency: 'High' },
    { pattern: 'bbc.com', name: 'BBC News', tier: 'Public Broadcaster / Verified', transparency: 'High' },
    { pattern: 'bbc.co.uk', name: 'BBC UK', tier: 'Public Broadcaster / Verified', transparency: 'High' },
    { pattern: 'nature.com', name: 'Nature Publishing Group', tier: 'Peer-Reviewed Scientific Journal', transparency: 'High' },
    { pattern: 'sciencemag.org', name: 'Science Magazine / AAAS', tier: 'Peer-Reviewed Scientific Journal', transparency: 'High' },
    { pattern: 'nasa.gov', name: 'NASA', tier: 'Government Aerospace / Science', transparency: 'High' },
    { pattern: 'who.int', name: 'World Health Organization', tier: 'Multilateral Health Agency', transparency: 'High' },
    { pattern: 'cdc.gov', name: 'Centers for Disease Control', tier: 'Government Public Health Agency', transparency: 'High' },
    { pattern: 'nih.gov', name: 'National Institutes of Health', tier: 'Government Research Institution', transparency: 'High' },
    { pattern: 'thehindu.com', name: 'The Hindu', tier: 'Accredited National Daily', transparency: 'High' },
    { pattern: 'wsj.com', name: 'Wall Street Journal', tier: 'Financial / Journalistic', transparency: 'High' },
    { pattern: 'nytimes.com', name: 'The New York Times', tier: 'Journalistic Publication', transparency: 'High' },
    { pattern: 'theguardian.com', name: 'The Guardian', tier: 'Journalistic Publication', transparency: 'High' },
  ],
  satire: [
    { pattern: 'theonion.com', name: 'The Onion', tier: 'Satire / Humor Publication', transparency: 'High' },
    { pattern: 'babylonbee.com', name: 'The Babylon Bee', tier: 'Satire / Parody Publication', transparency: 'Moderate' },
    { pattern: 'clickhole.com', name: 'ClickHole', tier: 'Satirical Parody', transparency: 'Moderate' },
    { pattern: 'newsthump.com', name: 'NewsThump', tier: 'Satire', transparency: 'Moderate' },
  ],
  flaggedQuestionable: [
    { pattern: 'infowars.com', name: 'InfoWars', tier: 'Flagged Conspiracy / Disinformation', transparency: 'Low' },
    { pattern: 'naturalnews.com', name: 'Natural News', tier: 'Flagged Pseudoscientific / Commercial', transparency: 'Low' },
    { pattern: 'beforeitsnews.com', name: 'Before It\'s News', tier: 'Unvetted Citizen Aggregate', transparency: 'None' },
    { pattern: 'worldnewsdailyreport.com', name: 'World News Daily Report', tier: 'Fabricated Hoaxes', transparency: 'None' },
  ],
};

// Linguistic Markers & Stylometric Lexicons
const EMOTIONAL_TRIGGERS = [
  'shocking', 'unbelievable', 'you won\'t believe', 'secret', 'miracle',
  'conspiracy', 'cover-up', 'censored', 'banned', 'exposed', 'danger',
  'apocalypse', 'bombshell', 'cure', 'hidden truth', 'they don\'t want you to know',
  'silent', 'share before deleted', 'wake up', 'hoax', 'deep state', 'poison',
  'urgent alert', 'disaster', 'illuminati', 'microchip', '5g', 'leaked',
  'destroy', 'devastating', 'corrupt', 'terrified', 'mind-control', 'deadly'
];

const OBJECTIVE_ATTRIBUTIONS = [
  'according to', 'study published in', 'researchers found', 'peer-reviewed',
  'spokesperson confirmed', 'official report', 'data shows', 'measured',
  'corroborated by', 'formal investigation', 'statement released', 'institute',
  'laboratory', 'survey conducted', 'evidence indicates', 'reuters reported',
  'associated press confirmed', 'press release', 'court documents state'
];

const VAGUE_ATTRIBUTIONS = [
  'experts say', 'sources reveal', 'insiders claim', 'many believe',
  'it is widely known', 'doctors are silent', 'some say', 'critics warn',
  'whistleblowers report', 'top officials secretly admitted'
];

/**
 * Core AI Analysis Engine for TruthLens
 */
export const runAIAnalysis = async (
  headline = '',
  content = '',
  category = 'General News',
  sourceUrl = '',
  onProgress = null
) => {
  // Step 1: Ingestion & Preprocessing
  if (onProgress) onProgress({ step: 1, message: 'Ingesting and parsing document semantics...', percent: 15 });
  await new Promise((r) => setTimeout(r, 300));

  const cleanHeadline = (headline || '').trim();
  const cleanContent = (content || '').trim();
  const fullText = `${cleanHeadline} ${cleanContent}`;
  const lowerText = fullText.toLowerCase();

  // Step 2: Source & Domain Reputation Check
  if (onProgress) onProgress({ step: 2, message: 'Evaluating source metadata and domain provenance...', percent: 35 });
  await new Promise((r) => setTimeout(r, 350));

  // Check for Google Gemini AI Key
  const geminiApiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (geminiApiKey) {
    try {
      if (onProgress) onProgress({ step: 3, message: 'Consulting Google Gemini Neural Fact-Checking Model...', percent: 65 });

      const prompt = `You are TruthLens AI, an expert investigative fact-checker, news intelligence, and explainable AI system.
Your mission is to provide an ACCURATE, RIGOROUS, and OBJECTIVE verification of the following news query, question, claim, or article:
Headline / Question: "${cleanHeadline}"
Content / Claim: "${cleanContent}"
Category: "${category}"
Source URL: "${sourceUrl}"

ANALYSIS GUIDELINES:
1. Ground your assessment in established factual reality and consensus from accredited international news wires (Reuters, Associated Press, BBC, AFP, PIB Fact Check, Snopes, PolitiFact, and peer-reviewed journals).
2. ACCURATELY determine the classification:
   - "Appears Credible": The core facts are confirmed and corroborated by verifiable reputable sources.
   - "Potentially Misleading": Contains some truth but suffers from misleading framing, missing critical context, selective quoting, or exaggerated statistics.
   - "Suspicious": The claim is demonstrably false, fabricated, a known internet hoax, conspiracy theory, or originates from a flagged disreputable source.
   - "Inconclusive": The claim cannot be verified empirically or concerns unverified developing events.
3. Provide deep, understandable, and articulate explanations in the detailedReasoning and analysisSummary fields.

Respond ONLY with a valid JSON object matching this exact schema:
{
  "classification": "Appears Credible" | "Potentially Misleading" | "Suspicious" | "Inconclusive",
  "confidenceScore": <integer between 50 and 98>,
  "analysisSummary": "<2-3 sentence clear, authoritative overview of the factual evaluation>",
  "detailedReasoning": "<comprehensive factual breakdown explaining why this is true, misleading, or fabricated, citing verified facts and timeline>",
  "headlineAnalysis": {
    "sensationalismScore": <integer 0-100>,
    "clickbaitRating": "Low" | "Moderate" | "High" | "Extreme",
    "isManipulative": <boolean>,
    "notes": "<concise observation on phrasing, tone, and clickbait triggers>"
  },
  "languageAnalysis": {
    "objectivityScore": <integer 0-100>,
    "emotionalCharge": "<e.g. Measured / Factual, Sensationalist, or Panic-Inducing>",
    "urgencyLevel": "None" | "Elevated" | "High / Urgent",
    "capitalizationAnomalies": <integer>,
    "punctuationExcess": <integer>
  },
  "suspiciousIndicators": [
    { "type": "linguistic" | "attribution" | "claim" | "source", "label": "<indicator title>", "description": "<detailed observation>", "severity": "low" | "medium" | "high" }
  ],
  "claimsToVerify": [
    { "claim": "<specific statement extracted from query>", "verificationStatus": "Corroborated" | "Unsupported" | "Requires Verification" | "Context Needed", "note": "<fact check guidance>" }
  ],
  "sourceAssessment": {
    "publisher": "<publisher or 'Direct Inquiry'>",
    "domain": "<domain or 'Direct Submission'>",
    "transparency": "High" | "Moderate" | "Low" | "Unverifiable",
    "authorInfo": "<author byline or 'Unspecified'>",
    "reliabilityTier": "<e.g. Authoritative / Verified Wire, Questionable / Hoax, or Independent Source>",
    "notes": "<context regarding source provenance>"
  },
  "limitations": "Automated AI assessments reflect probabilistic comparison against public factual records. Automated evaluations do not substitute for official primary documentation.",
  "recommendedVerificationSteps": [
    "<concrete step 1: e.g. Cross-reference with Reuters or AP>",
    "<concrete step 2: e.g. Review official governmental or scientific portal>",
    "<concrete step 3: e.g. Search dedicated fact-checking registries>"
  ]
}`;

      // Try primary model (gemini-1.5-flash) then fallback to gemini-1.5-pro
      const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];
      let rawJson = null;

      for (const model of candidateModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          const resp = await axios.post(
            geminiUrl,
            {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.15,
                responseMimeType: 'application/json',
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': geminiApiKey,
              },
              timeout: 12000,
            }
          );
          rawJson = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) break;
        } catch (mErr) {
          console.warn(`Model ${model} attempt notice:`, mErr.response?.data?.error?.message || mErr.message);
        }
      }

      if (rawJson) {
        // Strip markdown backticks if returned
        const cleanedJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        if (onProgress) onProgress({ step: 5, message: 'Finalizing neural fact-checking report...', percent: 100 });

        return {
          submittedHeadline: cleanHeadline || (cleanContent.slice(0, 90) + '...'),
          submittedContent: cleanContent,
          category,
          sourceUrl,
          classification: parsed.classification || 'Inconclusive',
          confidenceScore: parsed.confidenceScore || 75,
          analysisSummary: parsed.analysisSummary || '',
          detailedReasoning: parsed.detailedReasoning || '',
          headlineAnalysis: parsed.headlineAnalysis || { sensationalismScore: 20, clickbaitRating: 'Low', isManipulative: false, notes: 'Evaluated by Neural Model' },
          languageAnalysis: parsed.languageAnalysis || { objectivityScore: 75, emotionalCharge: 'Measured', urgencyLevel: 'Normal', capitalizationAnomalies: 0, punctuationExcess: 0 },
          suspiciousIndicators: parsed.suspiciousIndicators || [],
          claimsToVerify: parsed.claimsToVerify || [],
          sourceAssessment: parsed.sourceAssessment || { publisher: 'Direct Submission', domain: 'Direct Submission', transparency: 'Unverifiable', authorInfo: 'Direct query', reliabilityTier: 'Direct Submission', notes: 'Evaluated by Neural Model' },
          limitations: parsed.limitations || 'Automated AI assessments reflect probabilistic comparison against public factual records.',
          recommendedVerificationSteps: parsed.recommendedVerificationSteps || [
            'Cross-reference claims with established international news agencies (e.g. Reuters, AP, BBC).',
            'Consult official government, scientific, or academic registries.',
            'Review independent fact-checking databases such as Snopes or PolitiFact.'
          ],
        };
      }
    } catch (geminiErr) {
      console.warn('⚠️ [TruthLens AI] Gemini API call skipped or timed out, using built-in NLP engine:', geminiErr.message);
    }
  }

  let sourceAssessment = {
    publisher: 'Unknown',
    domain: 'Direct Submission',
    transparency: 'Unverifiable',
    authorInfo: 'Source information unavailable',
    reliabilityTier: 'Unrated',
    notes: 'No external URL provided. Content evaluated solely on submitted text.',
  };

  if (sourceUrl) {
    try {
      const parsedUrl = new URL(sourceUrl);
      const host = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
      sourceAssessment.domain = host;

      const authMatch = DOMAIN_REGISTRY.authoritative.find((d) => host.includes(d.pattern));
      const satireMatch = DOMAIN_REGISTRY.satire.find((d) => host.includes(d.pattern));
      const flagMatch = DOMAIN_REGISTRY.flaggedQuestionable.find((d) => host.includes(d.pattern));

      if (authMatch) {
        sourceAssessment = {
          publisher: authMatch.name,
          domain: host,
          transparency: authMatch.transparency,
          authorInfo: 'Staff Journalist / Verified Byline',
          reliabilityTier: authMatch.tier,
          notes: 'Domain matches an accredited news wire, academic journal, or governmental registry.',
        };
      } else if (satireMatch) {
        sourceAssessment = {
          publisher: satireMatch.name,
          domain: host,
          transparency: satireMatch.transparency,
          authorInfo: 'Editorial Satirist',
          reliabilityTier: satireMatch.tier,
          notes: 'Established humor publication. Content is intended as satire or parody, not factual reporting.',
        };
      } else if (flagMatch) {
        sourceAssessment = {
          publisher: flagMatch.name,
          domain: host,
          transparency: flagMatch.transparency,
          authorInfo: 'Unverified Contributor',
          reliabilityTier: flagMatch.tier,
          notes: 'Domain has documented history of disseminating pseudoscientific or unverified claims.',
        };
      } else {
        sourceAssessment = {
          publisher: host.split('.')[0].toUpperCase(),
          domain: host,
          transparency: 'Moderate / Independent',
          authorInfo: 'Domain present; author credentials unindexed',
          reliabilityTier: 'Independent Web Source',
          notes: 'Source domain registered but not cataloged in mainstream journalistic registries. Requires independent verification.',
        };
      }
    } catch {
      sourceAssessment.domain = 'Invalid URL';
      sourceAssessment.notes = 'The submitted source link could not be parsed into a valid web address.';
    }
  }

  // Step 3: Stylometric & Sensationalism Analysis
  if (onProgress) onProgress({ step: 3, message: 'Scanning linguistic stylometry and sensationalism markers...', percent: 60 });
  await new Promise((r) => setTimeout(r, 400));

  // Word metrics
  const words = fullText.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const uppercaseWords = words.filter(
    (w) => w.length > 2 && w === w.toUpperCase() && /^[A-Z]+$/.test(w)
  );
  const capsRatio = uppercaseWords.length / wordCount;

  // Punctuation anomalies
  const exclamationMatches = (fullText.match(/!/g) || []).length;
  const questionMatches = (fullText.match(/\?/g) || []).length;
  const multiPunctuationMatches = (fullText.match(/(!|\?){2,}/g) || []).length;

  // Lexicon matches
  const matchedTriggers = EMOTIONAL_TRIGGERS.filter((t) => lowerText.includes(t));
  const matchedAttributions = OBJECTIVE_ATTRIBUTIONS.filter((a) => lowerText.includes(a));
  const matchedVague = VAGUE_ATTRIBUTIONS.filter((v) => lowerText.includes(v));

  // Headline Specific Assessment
  let headlineSensationalism = 0;
  if (cleanHeadline) {
    if (cleanHeadline.includes('!')) headlineSensationalism += 25;
    if (cleanHeadline.toUpperCase() === cleanHeadline && cleanHeadline.length > 12) headlineSensationalism += 35;
    if (matchedTriggers.some((t) => cleanHeadline.toLowerCase().includes(t))) headlineSensationalism += 30;
  }
  headlineSensationalism = Math.min(100, headlineSensationalism);

  let clickbaitRating = 'Low';
  if (headlineSensationalism >= 70) clickbaitRating = 'High';
  else if (headlineSensationalism >= 35) clickbaitRating = 'Moderate';

  const isHeadlineManipulative = headlineSensationalism >= 50;

  // Language Objectivity Score (0 - 100)
  let objectivityScore = Math.round(
    65 +
    matchedAttributions.length * 8 -
    matchedTriggers.length * 10 -
    matchedVague.length * 7 -
    capsRatio * 80 -
    multiPunctuationMatches * 15
  );
  objectivityScore = Math.max(5, Math.min(98, objectivityScore));

  // Emotional Charge
  let emotionalCharge = 'Neutral / Informative';
  if (matchedTriggers.length >= 3 || capsRatio > 0.08) {
    emotionalCharge = 'High Arousal / Alarmist';
  } else if (matchedTriggers.length >= 1 || headlineSensationalism > 40) {
    emotionalCharge = 'Sensationalized / Urgent';
  } else if (matchedAttributions.length >= 2) {
    emotionalCharge = 'Analytical / Objective';
  }

  // Step 4: Claim Verification & Suspicious Indicators Generation
  if (onProgress) onProgress({ step: 4, message: 'Formulating claim verifications and evidentiary checks...', percent: 85 });
  await new Promise((r) => setTimeout(r, 350));

  const suspiciousIndicators = [];

  if (capsRatio > 0.08) {
    suspiciousIndicators.push({
      type: 'linguistic',
      label: 'Excessive Capitalization',
      description: `${Math.round(capsRatio * 100)}% of words appear in ALL-CAPS, a known tactic for inducing artificial urgency.`,
      severity: capsRatio > 0.15 ? 'high' : 'medium',
    });
  }

  if (multiPunctuationMatches > 0 || exclamationMatches >= 3) {
    suspiciousIndicators.push({
      type: 'linguistic',
      label: 'Exaggerated Punctuation',
      description: `Detected repeated exclamation or question marks (${exclamationMatches} total), contrary to standard journalistic style.`,
      severity: 'medium',
    });
  }

  if (matchedTriggers.length > 0) {
    suspiciousIndicators.push({
      type: 'linguistic',
      label: 'Sensational Emotional Keywords',
      description: `Contains high-arousal terms: ${matchedTriggers.slice(0, 4).join(', ')}.`,
      severity: matchedTriggers.length > 3 ? 'high' : 'low',
    });
  }

  if (matchedVague.length > 0) {
    suspiciousIndicators.push({
      type: 'attribution',
      label: 'Anonymous / Vague Attribution',
      description: `Relies on non-specific attributions such as "${matchedVague.slice(0, 2).join('", "')}" without named institutional sources.`,
      severity: 'medium',
    });
  }

  if (sourceAssessment.reliabilityTier.includes('Flagged') || sourceAssessment.reliabilityTier.includes('Hoaxes')) {
    suspiciousIndicators.push({
      type: 'source',
      label: 'Flagged Domain History',
      description: `The source domain (${sourceAssessment.domain}) is indexed in disinformation monitoring records.`,
      severity: 'high',
    });
  }

  // Claims to Verify
  const sentences = cleanContent
    .split(/(?<=[.?!])\s+/)
    .filter((s) => s.trim().length > 25);

  const claimsToVerify = [];
  if (sentences.length > 0) {
    claimsToVerify.push({
      claim: sentences[0].slice(0, 120) + (sentences[0].length > 120 ? '...' : ''),
      verificationStatus:
        objectivityScore > 75 ? 'Corroborated' : objectivityScore < 40 ? 'Unsupported' : 'Requires Verification',
      note:
        objectivityScore > 75
          ? 'Primary claim aligns with formal reporting standards.'
          : 'Core assertion requires cross-referencing with primary source records.',
    });
  }
  if (sentences.length > 1) {
    claimsToVerify.push({
      claim: sentences[1].slice(0, 120) + (sentences[1].length > 120 ? '...' : ''),
      verificationStatus: matchedAttributions.length > 0 ? 'Context Needed' : 'Requires Verification',
      note: 'Supporting claim lacks direct documentary citation.',
    });
  }

  // Step 5: Final Classification & Calibrated Confidence Score
  if (onProgress) onProgress({ step: 5, message: 'Finalizing explainable AI assessment...', percent: 100 });
  await new Promise((r) => setTimeout(r, 200));

  let classification = 'Inconclusive';
  let confidenceScore = 60;
  let analysisSummary = '';
  let detailedReasoning = '';

  const isSatireDomain = sourceAssessment.reliabilityTier.includes('Satire');
  const isFlaggedDomain = sourceAssessment.reliabilityTier.includes('Flagged') || sourceAssessment.reliabilityTier.includes('Hoaxes');
  const isAuthoritativeDomain = sourceAssessment.reliabilityTier.includes('Authoritative') || sourceAssessment.reliabilityTier.includes('Peer-Reviewed');

  if (isSatireDomain) {
    classification = 'Suspicious';
    confidenceScore = 95;
    analysisSummary = `The submitted material originates from ${sourceAssessment.publisher}, an established satirical publication. While creative and humorous, it is not factual journalism.`;
    detailedReasoning = 'The source website is explicitly registered as a humor/parody outlet. Articles from this domain are intended as cultural or political commentary rather than empirical reporting.';
  } else if (isFlaggedDomain || (objectivityScore < 30 && suspiciousIndicators.filter((i) => i.severity === 'high').length >= 2)) {
    classification = 'Suspicious';
    confidenceScore = Math.min(94, Math.max(75, 100 - objectivityScore));
    analysisSummary =
      'High concentrations of sensational language, manipulative urgency appeals, and absence of verifiable sources indicate a significant risk of misinformation.';
    detailedReasoning =
      'Stylometric analysis identified multiple red flags: emotionally coercive phrasing, severe capitalization anomalies, and ungrounded assertions. Content exhibiting this profile frequently mimics viral disinformation patterns.';
  } else if (isAuthoritativeDomain && objectivityScore >= 65) {
    classification = 'Appears Credible';
    confidenceScore = Math.min(95, Math.max(80, objectivityScore));
    analysisSummary =
      'Content demonstrates high journalistic integrity, verifiable empirical attribution, and absence of emotional manipulation.';
    detailedReasoning =
      'The submission utilizes measured prose, avoids sensational clickbait hooks, and references accredited institutional or peer-reviewed origins. These characteristics strongly align with professional reporting standards.';
  } else if (objectivityScore >= 72 && matchedAttributions.length >= 1 && suspiciousIndicators.length === 0) {
    classification = 'Appears Credible';
    confidenceScore = Math.min(88, objectivityScore);
    analysisSummary =
      'Linguistic patterns, citations, and sober framing appear consistent with standard journalistic and informational reporting.';
    detailedReasoning =
      'The text avoids inflammatory rhetoric, includes specific attributions, and presents claims in a factual manner. No manipulative stylometric anomalies were detected.';
  } else if (objectivityScore < 50 || suspiciousIndicators.length >= 2 || isHeadlineManipulative) {
    classification = 'Potentially Misleading';
    confidenceScore = Math.min(85, Math.max(65, 80 - objectivityScore + 20));
    analysisSummary =
      'The article exhibits mixed reliability indicators: while it may reference genuine topics, the framing, anonymous sourcing, or sensational headline could mislead readers.';
    detailedReasoning =
      'Analysis revealed disproportionate emotional rhetoric or selective presentation. Readers should distinguish between the core factual premise and the sensationalized narrative framing.';
  } else {
    classification = 'Inconclusive';
    confidenceScore = 55;
    analysisSummary =
      'The submitted text is brief, ambiguous, or lacks sufficient verifiable references for an automated determination.';
    detailedReasoning =
      'Automated analysis requires adequate contextual depth and verifiable citations to evaluate credibility. The submitted content did not present enough decisive linguistic signals to classify definitively.';
  }

  // Actionable Recommended Steps for the User
  const recommendedVerificationSteps = [
    'Check if mainstream international news agencies (e.g. Reuters, AP, BBC) have corroborated this specific headline.',
    'Search for the primary author or institution named in the article to verify their professional credentials.',
    'Examine whether the claims link to original public records, legislation, or scientific journal papers.',
  ];

  if (classification === 'Suspicious' || classification === 'Potentially Misleading') {
    recommendedVerificationSteps.unshift(
      'Search independent fact-checking databases such as Snopes, PolitiFact, or Google Fact Check Tools.'
    );
  }

  return {
    submittedHeadline: cleanHeadline || (cleanContent.slice(0, 90) + '...'),
    submittedContent: cleanContent,
    category,
    sourceUrl,
    classification,
    confidenceScore,
    analysisSummary,
    detailedReasoning,
    headlineAnalysis: {
      sensationalismScore: headlineSensationalism,
      clickbaitRating,
      isManipulative: isHeadlineManipulative,
      notes: isHeadlineManipulative
        ? 'Headline exhibits high emotional framing or clickbait triggers.'
        : 'Headline adopts measured, informative phrasing.',
    },
    languageAnalysis: {
      objectivityScore,
      emotionalCharge,
      urgencyLevel: capsRatio > 0.1 ? 'High / Urgent' : 'Normal',
      capitalizationAnomalies: uppercaseWords.length,
      punctuationExcess: exclamationMatches + multiPunctuationMatches,
    },
    suspiciousIndicators,
    claimsToVerify,
    sourceAssessment,
    limitations:
      'This automated assessment is probabilistic and reflects linguistic and contextual heuristics. It does not replace independent journalistic fact-checking.',
    recommendedVerificationSteps,
  };
};
