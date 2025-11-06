export enum Schema {
  AbandonmentInstability = 'Abandonment/Instability',
  MistrustAbuse = 'Mistrust/Abuse',
  SocialIsolationAlienation = 'Social Isolation/Alienation',
  DefectivenessShame = 'Defectiveness/Shame',
  Failure = 'Failure',
  DependenceIncompetence = 'Dependence/Incompetence',
  VulnerabilityToHarm = 'Vulnerability to Harm or Illness',
  EnmeshmentUndevelopedSelf = 'Enmeshment/Undeveloped Self',
  SelfSacrifice = 'Self-Sacrifice',
  UnrelentingStandards = 'Unrelenting Standards/Hypercriticalness',
  EmotionalInhibition = 'Emotional Inhibition',
  EntitlementGrandiosity = 'Entitlement/Grandiosity',
  InsufficientSelfControl = 'Insufficient Self-Control/Self-Discipline',
  EmotionalDeprivation = 'Emotional Deprivation',
  Subjugation = 'Subjugation',
  Punitiveness = 'Punitiveness',
}

export enum YPICategory {
    RejectionCriticism = 'Rejection & Criticism',
    EmotionalDeprivationDistance = 'Emotional Deprivation & Distance',
    OvercontrolEnmeshment = 'Overcontrol & Enmeshment',
    ExcessiveDemands = 'Excessive Demands & Unrelenting Standards',
    LackOfLimits = 'Lack of Limits & Insufficient Discipline',
    PositiveParenting = 'Positive Parenting Attributes',
}

export enum SchemaMode {
    VulnerableChild = 'Vulnerable Child',
    AngryChild = 'Angry Child',
    ImpulsiveUndisciplinedChild = 'Impulsive/Undisciplined Child',
    DetachedProtector = 'Detached Protector',
    CompliantSurrenderer = 'Compliant Surrenderer',
    Overcompensator = 'Overcompensator',
    PunitiveParent = 'Punitive Parent',
    DemandingParent = 'Demanding Parent',
    HealthyAdult = 'Healthy Adult',
}

export enum OICategory {
    Perfectionism = 'Perfectionism & Unrelenting Standards',
    SelfAggrandizement = 'Self-Aggrandizement & Status Seeking',
    ControlVigilance = 'Control & Vigilance',
    RebellionDefiance = 'Rebellion & Defiance',
    AggressionBlame = 'Aggression & Blame',
    DetachedSelfReliance = 'Detached Self-Reliance (Hyper-Independence)',
}

export type TestType = 'YSQ' | 'YPI' | 'SMI' | 'OI';

export interface Question {
  id: string;
  text: string;
  schema?: Schema; // Only for YSQ
}

export interface Test {
  id: number;
  type: TestType;
  title: string;
  description: string;
  questions: Question[];
}

export type Answers = Record<string, number>; // e.g. { 'ysq-q1': 5, 'ypi-q1_c1': 4, 'smi-q1': 3 }

export interface SchemaScore {
  schema: Schema;
  score: number;
}

export interface SchemaModeScore {
    mode: SchemaMode;
    score: number;
}

export interface OIScore {
    category: OICategory;
    score: number;
}

export interface YPICategoryScores {
    caregiver1: Record<YPICategory, Question[]>;
    caregiver2: Record<YPICategory, Question[]>;
}

export interface YSCTestResult {
    type: 'YSQ';
    scores: SchemaScore[];
    totalScore: number;
    feedback: GeminiFeedback | null;
}

export interface YPITestResult {
    type: 'YPI';
    scores: YPICategoryScores;
    feedback: GeminiParentingFeedback | null;
}

export interface SMITestResult {
    type: 'SMI';
    scores: SchemaModeScore[];
    feedback: GeminiSMIFeedback | null;
}

export interface OITestResult {
    type: 'OI';
    scores: OIScore[];
    feedback: GeminiOIFeedback | null;
}


export type TestResult = YSCTestResult | YPITestResult | SMITestResult | OITestResult;

export interface GeminiFeedback {
  topSchemas: {
    schemaName: string;
    score: number;
    explanation:string;
    reflectionPoints: string[];
  }[];
  disclaimer: string;
}

export interface GeminiParentingFeedback {
    caregiver1Feedback: {
        name: string;
        topCategory: string;
        explanation: string;
        reflectionPoints: string[];
    };
    caregiver2Feedback: {
        name: string;
        topCategory: string;
        explanation: string;
        reflectionPoints: string[];
    };
    comparison: string;
    disclaimer: string;
}

export interface GeminiSMIFeedback {
    topModes: {
        modeName: string;
        score: number;
        explanation: string;
        reflectionPoints: string[];
    }[];
    healthyAdult: {
        score: number;
        commentary: string;
    };
    interaction: string;
    disclaimer: string;
}

export interface GeminiOIFeedback {
    topPatterns: {
        patternName: string;
        score: number;
        explanation: string;
        reflectionPoints: string[];
    }[];
    disclaimer: string;
}

export type AllFeedback = GeminiFeedback | GeminiParentingFeedback | GeminiSMIFeedback | GeminiOIFeedback;

export type AppState = 'welcome' | 'testing' | 'review' | 'loading' | 'results' | 'error';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}