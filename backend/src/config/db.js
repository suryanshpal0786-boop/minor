import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { NewsAnalysis } from '../models/NewsAnalysis.js';

let isConnected = false;

const seedInitialData = async () => {
  try {
    // Drop legacy index if exists from previous prototype
    try {
      await mongoose.connection.collection('users').dropIndex('username_1');
    } catch {}

    // Remove any demo accounts
    await User.deleteMany({
      email: { $in: ['admin@truthlens.ai', 'demo@truthlens.ai'] },
    });

    // Check if analyses exist
    const analysisCount = await NewsAnalysis.countDocuments();
    if (analysisCount === 0) {
      await NewsAnalysis.create([
        {
          userId: null,
          submittedHeadline:
            'James Webb Space Telescope Confirms Atmospheric Carbon Dioxide on Exoplanet WASP-39b',
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
        },
        {
          userId: null,
          submittedHeadline:
            'Electric Vehicles Emit 400% More Pollution Than Gas Cars Over Their Lifespan',
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
        },
        {
          userId: null,
          submittedHeadline:
            'SHOCKING: Secret Government Directive Mandates Nighttime Frequency Transmissions!!',
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
        },
      ]);
      console.log('🌱 [Seeder] Seeded initial academic evaluation analyses.');
    }
  } catch (err) {
    console.warn('Seeder notice:', err.message);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fake_news_detector';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to ${uri}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Local MongoDB connection failed (${error.message}).`);
    console.warn(`⚡ [Fallback] In-memory storage mode active. All detection, auth, and analytics features will remain fully functional.`);
    isConnected = false;
  }
};

export const isDbConnected = () => isConnected;
