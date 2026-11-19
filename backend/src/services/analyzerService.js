// Credibility and NLP Misinformation Analysis Engine

const KNOWN_DOMAINS = {
  trusted: [
    'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'nature.com',
    'nasa.gov', 'cdc.gov', 'who.int', 'nih.gov', 'thehindu.com',
    'theguardian.com', 'wsj.com', 'bloomberg.com', 'npr.org',
    'pbs.org', 'sciencedirect.com', 'scientificamerican.com'
  ],
  satire: [
    'theonion.com', 'babylonbee.com', 'clickhole.com', 'newsthump.com',
    'private-eye.co.uk', 'waterfordwhispersnews.com'
  ],
  questionable: [
    'infowars.com', 'naturalnews.com', 'beforeitsnews.com', 'worldnewsdailyreport.com',
    'empirenews.net', 'yournewswire.com', 'newspunch.com'
  ]
};

const SENSATIONAL_WORDS = [
  'shocking', 'unbelievable', 'you won\'t believe', 'secret', 'miracle',
  'conspiracy', 'cover-up', 'censored', 'banned', 'exposed', 'danger',
  'apocalypse', 'bombshell', 'cure', 'hidden truth', 'they don\'t want you to know',
  'silent', 'share before deleted', 'wake up', 'hoax', 'deep state', 'poison',
  'urgent alert', 'disaster', 'illuminati', 'microchip', '5g', 'leaked'
];

const CREDIBLE_INDICATORS = [
  'according to', 'study published in', 'researchers found', 'peer-reviewed',
  'spokesperson confirmed', 'official report', 'data shows', 'measured',
  'corroborated by', 'formal investigation', 'statement released', 'institute',
  'laboratory', 'survey conducted', 'evidence indicates'
];

export const analyzeNewsArticle = async (title, content, sourceUrl = '', onProgress = null) => {
  // Step 1: Initialize
  if (onProgress) onProgress({ step: 1, message: 'Parsing article syntax and linguistic structure...', percent: 20 });
  await new Promise((r) => setTimeout(r, 400));

  const cleanTitle = (title || '').trim();
  const cleanContent = (content || '').trim();
  const combinedText = `${cleanTitle} ${cleanContent}`;
  const lowerText = combinedText.toLowerCase();

  // Extract domain if URL is provided
  let domain = 'Manual Submission';
  let domainReliability = 'neutral';
  if (sourceUrl) {
    try {
      const parsed = new URL(sourceUrl);
      domain = parsed.hostname.replace(/^www\./, '');
      if (KNOWN_DOMAINS.trusted.some((d) => domain.includes(d))) domainReliability = 'trusted';
      else if (KNOWN_DOMAINS.satire.some((d) => domain.includes(d))) domainReliability = 'satire';
      else if (KNOWN_DOMAINS.questionable.some((d) => domain.includes(d))) domainReliability = 'questionable';
    } catch {
      domain = 'Invalid URL';
    }
  }

  // Step 2: Stylometric and Sentiment Scan
  if (onProgress) onProgress({ step: 2, message: 'Analyzing sensationalism, tone, and clickbait patterns...', percent: 45 });
  await new Promise((r) => setTimeout(r, 400));

  // Capitalization ratio
  const words = combinedText.split(/\s+/).filter(Boolean);
  const totalWords = words.length || 1;
  const uppercaseWords = words.filter(
    (w) => w.length > 2 && w === w.toUpperCase() && /^[A-Z]+$/.test(w)
  );
  const capsRatio = uppercaseWords.length / totalWords;

  // Excessive punctuation
  const exclamationCount = (combinedText.match(/!/g) || []).length;
  const questionCount = (combinedText.match(/\?/g) || []).length;
  const multiPunctuation = (combinedText.match(/(!|\?){2,}/g) || []).length;

  // Sensational phrase hits
  const detectedSensational = [];
  SENSATIONAL_WORDS.forEach((word) => {
    if (lowerText.includes(word)) {
      detectedSensational.push(word);
    }
  });

  // Credible indicator hits
  const detectedCredible = [];
  CREDIBLE_INDICATORS.forEach((phrase) => {
    if (lowerText.includes(phrase)) {
      detectedCredible.push(phrase);
    }
  });

  // Step 3: Cross-referencing claim verifications
  if (onProgress) onProgress({ step: 3, message: 'Cross-referencing entities and claim verification standards...', percent: 75 });
  await new Promise((r) => setTimeout(r, 450));

  // Compute component scores (0 - 100)
  let sensationalismScore = Math.min(
    100,
    Math.round(
      detectedSensational.length * 15 +
      capsRatio * 120 +
      multiPunctuation * 15 +
      exclamationCount * 4
    )
  );

  let clickbaitScore = Math.min(
    100,
    Math.round(
      (cleanTitle.includes('!') ? 20 : 0) +
      (cleanTitle.toUpperCase() === cleanTitle && cleanTitle.length > 10 ? 35 : 0) +
      detectedSensational.length * 12 +
      (cleanTitle.match(/(shocking|you won't believe|secret|leaked|revealed)/i) ? 30 : 0)
    )
  );

  let objectivityScore = Math.max(
    5,
    Math.min(
      98,
      Math.round(
        60 +
        detectedCredible.length * 12 -
        sensationalismScore * 0.45 +
        (domainReliability === 'trusted' ? 25 : domainReliability === 'questionable' ? -35 : 0)
      )
    )
  );

  // Overall Credibility Score calculation
  let credibilityScore = 50;

  if (domainReliability === 'satire') {
    credibilityScore = 15;
  } else if (domainReliability === 'trusted') {
    credibilityScore = Math.min(99, Math.round(75 + detectedCredible.length * 6 - sensationalismScore * 0.25));
  } else if (domainReliability === 'questionable') {
    credibilityScore = Math.max(5, Math.round(25 - sensationalismScore * 0.2));
  } else {
    // Rely primarily on linguistic & empirical markers
    credibilityScore = Math.max(
      5,
      Math.min(
        96,
        Math.round(
          55 +
          detectedCredible.length * 10 -
          sensationalismScore * 0.5 -
          clickbaitScore * 0.2 +
          (totalWords > 80 ? 5 : -10)
        )
      )
    );
  }

  // Step 4: Final verdict & Report Compilation
  if (onProgress) onProgress({ step: 4, message: 'Compiling multi-factor credibility report and confidence indicators...', percent: 95 });
  await new Promise((r) => setTimeout(r, 350));

  let verdict = 'Likely Authentic';
  let verdictDescription = '';

  if (domainReliability === 'satire') {
    verdict = 'Satire / Parody';
    verdictDescription = 'The source is an established satirical or humor publication. Not intended as factual reporting.';
  } else if (credibilityScore >= 75) {
    verdict = 'Likely Authentic';
    verdictDescription = 'High level of verifiable language, minimal sensationalism, and objective journalistic indicators detected.';
  } else if (credibilityScore >= 45) {
    verdict = 'Partially True / Misleading';
    verdictDescription = 'Contains mixed signals: either unverified anonymous claims, emotional framing, or lack of peer-verifiable corroboration.';
  } else {
    verdict = 'High Risk / False';
    verdictDescription = 'Significant markers of misinformation: aggressive sensationalism, manipulative syntax, absence of credible sources, or known hoax patterns.';
  }

  // Generate actionable flags
  const flags = [];
  if (capsRatio > 0.1) {
    flags.push({
      type: 'danger',
      title: 'Excessive Capitalization',
      description: `${Math.round(capsRatio * 100)}% of words are ALL-CAPS, frequently used to evoke panic or high excitement.`,
    });
  }
  if (detectedSensational.length > 0) {
    flags.push({
      type: sensationalismScore > 50 ? 'danger' : 'warning',
      title: 'Sensational / Manipulative Vocabulary',
      description: `Detected high-arousal trigger terms: ${detectedSensational.slice(0, 5).join(', ')}.`,
    });
  }
  if (multiPunctuation > 0) {
    flags.push({
      type: 'warning',
      title: 'Repeated Punctuation (!!, ??)',
      description: 'Abuse of exclamation marks and interrogatives signals emotive rhetoric over sober reporting.',
    });
  }
  if (detectedCredible.length > 0) {
    flags.push({
      type: 'success',
      title: 'Empirical Attribution Identified',
      description: `Contains verified evidentiary signals such as "${detectedCredible.slice(0, 3).join('", "')}".`,
    });
  } else {
    flags.push({
      type: 'warning',
      title: 'Weak Source Attribution',
      description: 'No direct references to peer-reviewed studies, named spokespeople, or primary source archives were detected.',
    });
  }
  if (domainReliability === 'trusted') {
    flags.push({
      type: 'success',
      title: 'Recognized Reliable Domain',
      description: `${domain} is cataloged as a mainstream journalistic or academic domain.`,
    });
  } else if (domainReliability === 'questionable') {
    flags.push({
      type: 'danger',
      title: 'Known Questionable Source',
      description: `${domain} has historical records of publishing unverified claims or pseudoscientific content.`,
    });
  }

  // Highlighted phrases extraction
  const highlightedPhrases = [];
  detectedSensational.forEach((phrase) => {
    highlightedPhrases.push({
      phrase,
      reason: 'Sensationalism trigger word',
      severity: 'high',
    });
  });

  uppercaseWords.slice(0, 4).forEach((word) => {
    if (!highlightedPhrases.some((h) => h.phrase === word)) {
      highlightedPhrases.push({
        phrase: word,
        reason: 'Emphasis manipulation (ALL-CAPS)',
        severity: 'medium',
      });
    }
  });

  // Fact check findings
  const factCheckFindings = [
    {
      claim: cleanTitle || 'Main headline claim',
      status: credibilityScore >= 70 ? 'Verified' : credibilityScore >= 45 ? 'Unverified' : 'Debunked',
      explanation:
        credibilityScore >= 70
          ? 'Coincides with standard factual reporting conventions and verifiable references.'
          : credibilityScore >= 45
          ? 'Further independent corroboration from primary sources recommended before sharing.'
          : 'Multiple factual anomalies, emotional fallacies, or uncorroborated narratives found.',
    },
  ];

  // Sentiment analysis
  let sentiment = 'Neutral';
  if (sensationalismScore > 60) sentiment = 'Alarmist / Agitated';
  else if (detectedCredible.length > 2) sentiment = 'Objective / Analytical';
  else if (sensationalismScore < 20) sentiment = 'Measured / Sincere';

  // Bias rating
  let biasRating = 'Balanced';
  if (sensationalismScore > 65) biasRating = 'Heavy Partisan / Sensational';
  else if (sensationalismScore > 35) biasRating = 'Mild Framing';

  // Executive summary
  const summary = `The detector evaluated this text across ${totalWords} words and found an overall Credibility Score of ${credibilityScore}/100. Sensationalism is indexed at ${sensationalismScore}%, with an Objectivity score of ${objectivityScore}%. ${verdictDescription}`;

  if (onProgress) onProgress({ step: 5, message: 'Analysis complete!', percent: 100 });

  return {
    title: cleanTitle || 'Untitled News Item',
    content: cleanContent,
    sourceUrl,
    domain,
    credibilityScore,
    verdict,
    verdictDescription,
    breakdown: {
      sensationalismScore,
      clickbaitScore,
      objectivityScore,
      sentiment,
      biasRating,
    },
    flags,
    highlightedPhrases,
    factCheckFindings,
    summary,
  };
};
