import { Schema, Test, YPICategory, SchemaMode, OICategory } from './types';

export const SCHEMA_DEFINITIONS: Record<Schema, string> = {
  [Schema.AbandonmentInstability]: 'The belief that you will inevitably lose anyone with whom you form an emotional attachment.',
  [Schema.MistrustAbuse]: 'The expectation that others will hurt, abuse, humiliate, cheat, lie, manipulate, or take advantage of you.',
  [Schema.SocialIsolationAlienation]: 'The feeling that you are isolated from the rest of the world, different from other people, and/or not part of any group or community.',
  [Schema.DefectivenessShame]: 'The belief that you are internally flawed, and that if others knew, they would withdraw their support.',
  [Schema.Failure]: 'The belief that you have failed, will inevitably fail, or are fundamentally inadequate compared to your peers.',
  [Schema.DependenceIncompetence]: 'The belief that you are unable to handle your everyday responsibilities competently without considerable help from others.',
  [Schema.VulnerabilityToHarm]: 'The exaggerated fear that imminent catastrophe will strike at any time and that you will be unable to prevent it.',
  [Schema.EnmeshmentUndevelopedSelf]: 'Excessive emotional involvement and closeness with one or more significant others at the expense of full individuation or normal social development.',
  [Schema.SelfSacrifice]: 'The excessive focus on voluntarily meeting the needs of others in daily situations, at the expense of your own gratification.',
  [Schema.UnrelentingStandards]: 'The underlying belief that you must strive to meet very high internalized standards of behavior and performance, usually to avoid criticism.',
  [Schema.EmotionalInhibition]: 'The excessive inhibition of spontaneous action, feeling, or communication, usually to avoid disapproval by others, feelings of shame, or losing control of your impulses.',
  [Schema.EntitlementGrandiosity]: 'The belief that you are superior to other people and therefore have special rights and privileges.',
  [Schema.InsufficientSelfControl]: 'The pervasive difficulty or refusal to exercise sufficient self-control and frustration tolerance to achieve your personal goals.',
  [Schema.EmotionalDeprivation]: 'The belief that your desire for a normal degree of emotional support will not be adequately met by others.',
  [Schema.Subjugation]: 'The excessive surrendering of control to others because you feel coerced, usually to avoid anger, retaliation, or abandonment.',
  [Schema.Punitiveness]: 'The belief that people should be harshly punished for making mistakes. This can be directed at yourself or others.',
};

export const YPI_CATEGORY_DEFINITIONS: Record<YPICategory, string> = {
    [YPICategory.RejectionCriticism]: "This pattern reflects a childhood environment where you may have felt flawed, unloved, or unworthy. Your caregiver may have been overly critical, shaming, or rejecting.",
    [YPICategory.EmotionalDeprivationDistance]: "This suggests a caregiver who was not emotionally available. They may have been cold, neglectful, or too absorbed in their own issues to provide adequate nurturance, warmth, and guidance.",
    [YPICategory.OvercontrolEnmeshment]: "This pattern points to a caregiver who was overly involved, anxious, and controlling. They may have made you feel smothered, lacked respect for your boundaries, and discouraged autonomy.",
    [YPICategory.ExcessiveDemands]: "This reflects a parenting style focused on high achievement, performance, and perfection. Love and approval may have felt contingent on you meeting very high standards.",
    [YPICategory.LackOfLimits]: "This pattern suggests a permissive caregiver who did not provide enough structure, discipline, or guidance. This can make it difficult for a child to learn self-control and respect for others' boundaries.",
    [YPICategory.PositiveParenting]: "High scores here reflect a healthy, supportive, and balanced parenting style that fosters resilience and a strong sense of self. These are protective factors against developing maladaptive schemas.",
};

export const SMI_MODE_DEFINITIONS: Record<SchemaMode, string> = {
    [SchemaMode.VulnerableChild]: 'You often feel lonely, sad, helpless, or flawed. This is the part of you that holds the core pain of your unmet childhood needs.',
    [SchemaMode.AngryChild]: 'You feel intense anger, rage, or frustration when your core needs feel blocked or violated. This anger is often a reaction to the pain of the Vulnerable Child.',
    [SchemaMode.ImpulsiveUndisciplinedChild]: 'You tend to act on immediate desires and impulses without considering the consequences. This mode seeks immediate gratification and struggles with self-discipline.',
    [SchemaMode.DetachedProtector]: 'Your go-to coping style is to shut down emotionally. You might feel empty, numb, or bored, and you avoid feelings by distracting yourself or withdrawing from others.',
    [SchemaMode.CompliantSurrenderer]: 'You cope by submitting to others. You tend to be a people-pleaser, avoid conflict, and allow others to control you, suppressing your own needs and feelings.',
    [SchemaMode.Overcompensator]: 'You fight your schemas by trying to be the opposite. You might act tough, grandiose, controlling, or perfectionistic to prove your worth and keep others from seeing your vulnerability.',
    [SchemaMode.PunitiveParent]: 'This is a harsh, internal voice that criticizes and punishes you for making mistakes. It makes you feel that you are bad and deserve negative outcomes.',
    [SchemaMode.DemandingParent]: 'This is the internal voice that pushes you relentlessly to meet extremely high standards. It tells you that you "should" always be productive, perfect, and efficient, and that expressing feelings or relaxing is unacceptable.',
    [SchemaMode.HealthyAdult]: 'This is the goal of Schema Therapy. This part of you is competent, resilient, and balanced. It can regulate emotions, make wise decisions, set healthy boundaries, and nurture your Vulnerable Child.',
};

export const SMI_MODE_DETAILS: Record<SchemaMode, { description: string; highScoreSuggests: string; scoreInterpretation: string; }> = {
    [SchemaMode.VulnerableChild]: {
        description: 'This is the part of you that feels the pain of unmet childhood needs. You may feel lonely, sad, misunderstood, or anxious.',
        highScoreSuggests: 'A high score suggests that feelings of vulnerability are present and may be triggered in certain situations.',
        scoreInterpretation: 'While not dominant, this score indicates that feelings of vulnerability are present and may be triggered in certain situations, impacting your emotional well-being.',
    },
    [SchemaMode.AngryChild]: {
        description: 'This mode surfaces as intense anger and frustration when core needs feel ignored or violated. It often acts as a protector for the Vulnerable Child mode.',
        highScoreSuggests: 'You may find yourself reacting with disproportionate anger in situations that trigger underlying emotional pain or unmet needs.',
        scoreInterpretation: 'Your score suggests that you sometimes use anger as a defense mechanism. Understanding its triggers is key to finding more constructive ways to express your needs.',
    },
    [SchemaMode.ImpulsiveUndisciplinedChild]: {
        description: 'This mode acts on whims and immediate desires, often neglecting long-term consequences. It struggles with self-discipline and delayed gratification.',
        highScoreSuggests: 'You may struggle with impulsivity, procrastination, or difficulty sticking to commitments, which can interfere with achieving your long-term goals.',
        scoreInterpretation: 'This score indicates a tendency towards impulsive behavior. Building self-discipline can help you balance immediate wants with future aspirations.',
    },
    [SchemaMode.DetachedProtector]: {
        description: 'This mode involves emotional detachment to avoid pain. You might feel empty, bored, or use distractions like workaholism or substance use.',
        highScoreSuggests: 'You frequently use emotional withdrawal as a coping mechanism. This can lead to a sense of isolation and prevent you from forming deep, meaningful connections.',
        scoreInterpretation: 'Your score suggests this coping style is a significant part of your experience. Learning to reconnect with emotions is a key step towards healing.',
    },
    [SchemaMode.CompliantSurrenderer]: {
        description: 'In this mode, you suppress your own needs and feelings to please others and avoid conflict or rejection.',
        highScoreSuggests: 'You often prioritize others\' needs over your own, which can lead to resentment and a lack of fulfillment. You may struggle to assert yourself.',
        scoreInterpretation: 'Your score indicates a strong tendency to people-please. Learning to identify and express your own needs is crucial for building healthier relationships.',
    },
    [SchemaMode.Overcompensator]: {
        description: 'This mode attempts to fight against underlying schemas by acting in an opposite, often extreme, manner. This can manifest as perfectionism, grandiosity, or control.',
        highScoreSuggests: 'You may present a facade of extreme confidence or competence to mask underlying feelings of inadequacy or vulnerability.',
        scoreInterpretation: 'This score suggests you use overcompensation as a defense. Recognizing this pattern can help you address the core beliefs you are trying to cover up.',
    },
    [SchemaMode.PunitiveParent]: {
        description: 'This is the harsh, critical internal voice that punishes you for mistakes. It is often an internalization of a critical caregiver from your past.',
        highScoreSuggests: 'You likely experience harsh self-criticism, which can lead to feelings of shame, guilt, and low self-worth.',
        scoreInterpretation: 'This score indicates a strong inner critic. Developing self-compassion is essential to counteracting this punitive voice.',
    },
    [SchemaMode.DemandingParent]: {
        description: 'This internal voice pushes you to meet excessively high standards. It equates your worth with achievement and productivity.',
        highScoreSuggests: 'You may feel constant pressure to perform, leading to burnout, anxiety, and an inability to relax and enjoy life.',
        scoreInterpretation: 'This score suggests you have internalized very high expectations. Learning to value yourself beyond your accomplishments is a vital part of recovery.',
    },
    [SchemaMode.HealthyAdult]: {
        description: 'The Healthy Adult mode is your functional, grown-up self. It\'s rational, compassionate, and works to meet your needs in healthy ways.',
        highScoreSuggests: 'A high score suggests a well-developed capacity for emotional regulation, healthy boundary setting, and self-care.',
        scoreInterpretation: 'Your score suggests there\'s room to strengthen your Healthy Adult mode. Building this mode is key to managing other, more challenging modes.',
    },
};

export const OI_CATEGORY_DEFINITIONS: Record<OICategory, string> = {
    [OICategory.Perfectionism]: 'This pattern is a direct fight against an underlying feeling of being flawed or a failure. You overcompensate by striving for perfection, being hyper-critical of yourself and others, and linking your entire self-worth to achievement.',
    [OICategory.SelfAggrandizement]: 'This pattern fights schemas of Defectiveness, Social Isolation, or Emotional Deprivation. You build an external facade of superiority, confidence, and importance to convince yourself and others of your value.',
    [OICategory.ControlVigilance]: 'This is a defense against schemas like Mistrust, Vulnerability, or Abandonment. You believe the world is unpredictable and unsafe, so you must maintain tight control over your environment and relationships.',
    [OICategory.RebellionDefiance]: 'This pattern is a direct fight against a Subjugation schema—the feeling of being controlled or suppressed by others. You overcompensate by resisting authority, rules, and advice.',
    [OICategory.AggressionBlame]: 'This is a "preemptive strike" strategy against schemas of Mistrust/Abuse or Defectiveness. The logic is: "I will hurt you before you can hurt me."',
    [OICategory.DetachedSelfReliance]: 'This pattern fights schemas of Abandonment, Dependence, or Mistrust. You have learned that relying on others leads to pain, so you build a wall of extreme self-sufficiency.',
};

export const YPI_QUESTION_TO_CATEGORY_MAP: Record<string, YPICategory> = {
    'ypi-q2': YPICategory.RejectionCriticism, 'ypi-q5': YPICategory.RejectionCriticism, 'ypi-q14': YPICategory.RejectionCriticism, 'ypi-q20': YPICategory.RejectionCriticism, 'ypi-q24': YPICategory.RejectionCriticism,
    'ypi-q6': YPICategory.EmotionalDeprivationDistance, 'ypi-q8': YPICategory.EmotionalDeprivationDistance, 'ypi-q12': YPICategory.EmotionalDeprivationDistance, 'ypi-q22': YPICategory.EmotionalDeprivationDistance,
    'ypi-q3': YPICategory.OvercontrolEnmeshment, 'ypi-q16': YPICategory.OvercontrolEnmeshment, 'ypi-q21': YPICategory.OvercontrolEnmeshment,
    'ypi-q10': YPICategory.ExcessiveDemands, 'ypi-q13': YPICategory.ExcessiveDemands, 'ypi-q17': YPICategory.ExcessiveDemands,
    'ypi-q11': YPICategory.LackOfLimits,
    'ypi-q1': YPICategory.PositiveParenting, 'ypi-q4': YPICategory.PositiveParenting, 'ypi-q7': YPICategory.PositiveParenting, 'ypi-q9': YPICategory.PositiveParenting, 'ypi-q15': YPICategory.PositiveParenting, 'ypi-q19': YPICategory.PositiveParenting, 'ypi-q23': YPICategory.PositiveParenting,
};

export const SMI_QUESTION_GROUPINGS: Record<SchemaMode, string[]> = {
    [SchemaMode.VulnerableChild]: ['smi-q1', 'smi-q8', 'smi-q14', 'smi-q20'],
    [SchemaMode.AngryChild]: ['smi-q5', 'smi-q16'],
    [SchemaMode.ImpulsiveUndisciplinedChild]: ['smi-q9', 'smi-q13'],
    [SchemaMode.DetachedProtector]: ['smi-q2', 'smi-q15', 'smi-q21'],
    [SchemaMode.CompliantSurrenderer]: ['smi-q4', 'smi-q11', 'smi-q22'],
    [SchemaMode.Overcompensator]: ['smi-q7', 'smi-q12', 'smi-q18'],
    [SchemaMode.PunitiveParent]: ['smi-q6', 'smi-q10', 'smi-q19'],
    [SchemaMode.DemandingParent]: ['smi-q3', 'smi-q17'],
    [SchemaMode.HealthyAdult]: ['smi-q23', 'smi-q24'],
};

export const OI_QUESTION_GROUPINGS: Record<OICategory, string[]> = {
    [OICategory.Perfectionism]: ['oi-q1', 'oi-q6', 'oi-q12', 'oi-q18', 'oi-q24'],
    [OICategory.SelfAggrandizement]: ['oi-q2', 'oi-q7', 'oi-q13', 'oi-q19', 'oi-q25'],
    [OICategory.ControlVigilance]: ['oi-q8', 'oi-q14', 'oi-q20', 'oi-q26', 'oi-q30'],
    [OICategory.RebellionDefiance]: ['oi-q3', 'oi-q9', 'oi-q15', 'oi-q21', 'oi-q27'],
    [OICategory.AggressionBlame]: ['oi-q4', 'oi-q10', 'oi-q16', 'oi-q22', 'oi-q28'],
    [OICategory.DetachedSelfReliance]: ['oi-q5', 'oi-q11', 'oi-q17', 'oi-q23', 'oi-q29'],
};

export const TESTS: Test[] = [
  {
    id: 1,
    type: 'YSQ',
    title: 'The 20 Questions Schema Quiz',
    description: 'Inspired by the Young Schema Questionnaire (YSQ), this quiz helps identify potential early maladaptive schemas.',
    questions: [
      { id: 'ysq-q1', text: 'I worry a great deal that the people I care about will leave me or abandon me.', schema: Schema.AbandonmentInstability },
      { id: 'ysq-q2', text: 'I feel that people will take advantage of me.', schema: Schema.MistrustAbuse },
      { id: 'ysq-q3', text: 'I don\'t feel like I fit in with other people; I feel fundamentally different.', schema: Schema.SocialIsolationAlienation },
      { id: 'ysq-q4', text: 'I feel that I am not lovable and that I am unworthy of love from others.', schema: Schema.DefectivenessShame },
      { id: 'ysq-q5', text: 'I often feel like I am a failure in most areas of my life.', schema: Schema.Failure },
      { id: 'ysq-q6', text: 'I find it very difficult to make everyday decisions without a lot of reassurance from others.', schema: Schema.DependenceIncompetence },
      { id: 'ysq-q7', text: 'I constantly worry about something bad happening, like a natural disaster, illness, or being a victim of a crime.', schema: Schema.VulnerabilityToHarm },
      { id: 'ysq-q8', text: 'I have a hard time separating my feelings and identity from those of my parents or partner.', schema: Schema.EnmeshmentUndevelopedSelf },
      { id: 'ysq-q9', text: 'I often put the needs of others before my own to the point where I neglect my own needs.', schema: Schema.SelfSacrifice },
      { id: 'ysq-q10', text: 'I feel like I have to be the best at everything I do; I am very demanding of myself.', schema: Schema.UnrelentingStandards },
      { id: 'ysq-q11', text: 'I often feel that I have to control my emotions and impulses to an excessive degree.', schema: Schema.EmotionalInhibition },
      { id: 'ysq-q12', text: 'I find it difficult to accept "no" for an answer and feel that I should be able to do or have whatever I want.', schema: Schema.EntitlementGrandiosity },
      { id: 'ysq-q13', text: 'I often give up easily when faced with challenges or boring tasks.', schema: Schema.InsufficientSelfControl },
      { id: 'ysq-q14', text: 'I haven\'t had a strong person to give me sound advice or direction when I\'m not sure what to do.', schema: Schema.EmotionalDeprivation },
      { id: 'ysq-q15', text: 'I feel that my needs for love, attention, and affection are not truly met by others.', schema: Schema.EmotionalDeprivation },
      { id: 'ysq-q16', text: 'I am a very private person and don\'t let others see the "real" me.', schema: Schema.DefectivenessShame },
      { id: 'ysq-q17', text: 'I am often drawn to people who are critical of me or reject me.', schema: Schema.Subjugation },
      { id: 'ysq-q18', text: 'I can\'t seem to escape the feeling that something bad is about to happen.', schema: Schema.VulnerabilityToHarm },
      { id: 'ysq-q19', text: 'I find it hard to set boundaries with people for fear of their reaction.', schema: Schema.Subjugation },
      { id: 'ysq-q20', text: 'I am highly critical of myself and others.', schema: Schema.Punitiveness },
    ],
  },
  {
    id: 2,
    type: 'YPI',
    title: 'The 24-Question Parenting Inventory',
    description: 'Inspired by the Young Parenting Inventory (YPI), this tool helps you reflect on the parenting styles you experienced in childhood.',
    questions: [
        { id: 'ypi-q1', text: 'Was affectionate and warm with me.' },
        { id: 'ypi-q2', text: 'Made me feel like I wasn\'t good enough.' },
        { id: 'ypi-q3', text: 'Was often anxious or worried about me.' },
        { id: 'ypi-q4', text: 'Encouraged me to be independent and make my own choices.' },
        { id: 'ypi-q5', text: 'Was very critical of my mistakes.' },
        { id: 'ypi-q6', text: 'Seemed emotionally distant or unavailable.' },
        { id: 'ypi-q7', text: 'Made me feel safe and protected.' },
        { id: 'ypi-q8', text: 'Put their own needs before mine.' },
        { id: 'ypi-q9', text: 'Set firm and consistent rules.' },
        { id: 'ypi-q10', text: 'Made me feel guilty for not meeting their expectations.' },
        { id: 'ypi-q11', text: 'Let me get away with too much; was not firm enough.' },
        { id: 'ypi-q12', text: 'Was someone I could confide in and share my feelings with.' },
        { id: 'ypi-q13', text: 'Pushed me to be the best, sometimes to an extreme.' },
        { id: 'ypi-q14', text: 'Made me feel like a burden.' },
        { id: 'ypi-q15', text: 'Respected my privacy.' },
        { id: 'ypi-q16', text: 'Was controlling and wanted to know everything I was doing.' },
        { id: 'ypi-q17', text: 'Made love and affection feel conditional on my success.' },
        { id: 'ypi-q18', text: 'Was unpredictable; sometimes warm, sometimes cold or angry.' }, // Note: This question isn't in the provided scoring categories, can be used for qualitative feedback
        { id: 'ypi-q19', text: 'Encouraged me to express my feelings and opinions.' },
        { id: 'ypi-q20', text: 'Compared me unfavorably to others.' },
        { id: 'ypi-q21', text: 'Sheltered me too much from the world.' },
        { id: 'ypi-q22', text: 'Was often preoccupied with their own problems.' },
        { id: 'ypi-q23', text: 'Taught me practical life skills.' },
        { id: 'ypi-q24', text: 'Used shame or humiliation as a form of discipline.' },
    ]
  },
  {
    id: 3,
    type: 'SMI',
    title: 'The 24-Question Schema Mode Inventory',
    description: 'Inspired by the Schema Mode Inventory (SMI), this tool helps identify your dominant emotional states and coping responses.',
    questions: [
        { id: 'smi-q1', text: 'I feel lonely, sad, and misunderstood.' },
        { id: 'smi-q2', text: 'I feel emotionally numb, empty, or detached from my feelings.' },
        { id: 'smi-q3', text: 'I push myself to be perfect and get everything done, feeling that rest is a waste of time.' },
        { id: 'smi-q4', text: 'I find myself submitting to others\' wishes and letting them have their way.' },
        { id: 'smi-q5', text: 'I feel enraged when my important needs and feelings are not acknowledged.' },
        { id: 'smi-q6', text: 'I am harsh and critical with myself, telling myself I\'m stupid or worthless.' },
        { id: 'smi-q7', text: 'I act tough, superior, or overly independent to keep people at a distance.' },
        { id: 'smi-q8', text: 'I feel like a helpless child who needs someone to take care of them.' },
        { id: 'smi-q9', text: 'I act on impulse and cravings, even if it harms me or others in the long run.' },
        { id: 'smi-q10', text: 'I feel like I deserve to be punished for my mistakes.' },
        { id: 'smi-q11', text: 'I put others\' needs before my own to avoid conflict or rejection.' },
        { id: 'smi-q12', text: 'I try to be the best, seek status, or control situations to feel valued.' },
        { id: 'smi-q13', text: 'I find it very hard to get started on routine or boring tasks.' },
        { id: 'smi-q14', text: 'I feel fundamentally flawed and unlovable.' },
        { id: 'smi-q15', text: 'I distract myself with activities to avoid feeling empty (e.g., working excessively, over-eating, substance use).' },
        { id: 'smi-q16', text: 'I feel intense frustration and impatience when things don\'t go my way.' },
        { id: 'smi-q17', text: 'I have a strong inner voice that tells me the rules I "should" and "must" follow.' },
        { id: 'smi-q18', text: 'I feel like people don\'t respect me, so I act in a way that demands attention.' },
        { id: 'smi-q19', text: 'I feel like I\'m a bad person who deserves negative consequences.' },
        { id: 'smi-q20', text: 'I find myself clinging to people because I\'m afraid of being left alone.' },
        { id: 'smi-q21', text: 'I avoid intimacy or getting close to people, even if I want to.' },
        { id: 'smi-q22', text: 'I let others take the lead because I don\'t trust my own judgment.' },
        { id: 'smi-q23', text: 'I can take care of my responsibilities while also making time for healthy pleasure and connection.' },
        { id: 'smi-q24', text: 'I can validate my own feelings and needs and find healthy ways to meet them.' },
    ]
  },
  {
    id: 4,
    type: 'OI',
    title: 'The 30-Question Overcompensation Inventory',
    description: 'This inventory helps identify patterns of overcompensation, which are ways we fight against our core schemas by acting in an opposite manner.',
    questions: [
        { id: 'oi-q1', text: 'I feel a constant internal pressure that I am not doing enough or achieving enough.' },
        { id: 'oi-q2', text: 'I am the one who takes charge in group settings, even when I\'m unsure of myself.' },
        { id: 'oi-q3', text: 'I have a strong dislike for rules and feel a need to bend or break them.' },
        { id: 'oi-q4', text: 'When someone criticizes me, my first instinct is to find fault with them.' },
        { id: 'oi-q5', text: 'I take pride in solving my own problems without any help from anyone.' },
        { id: 'oi-q6', text: 'I must be the best at my job or in my social circle; second place feels like a failure.' },
        { id: 'oi-q7', text: 'I need to be seen as special, successful, or important.' },
        { id: 'oi-q8', text: 'I feel anxious or irritable when I cannot control a situation.' },
        { id: 'oi-q9', text: 'I get a sense of satisfaction from proving authority figures wrong.' },
        { id: 'oi-q10', text: 'I use sarcasm or biting humor to point out others\' flaws.' },
        { id: 'oi-q11', text: 'I feel uncomfortable when people try to get too close to me emotionally.' },
        { id: 'oi-q12', text: 'I spend a lot of time correcting the mistakes of others, either out loud or in my head.' },
        { id: 'oi-q13', text: 'I make sure my life looks impressive to others, even if I don\'t feel that way inside.' },
        { id: 'oi-q14', text: 'I find it very difficult to delegate tasks because I believe I can do them better.' },
        { id: 'oi-q15', text: 'I often do the opposite of what people advise, just to show I can\'t be controlled.' },
        { id: 'oi-q16', text: 'If I feel hurt or insulted, my response is often anger and blame rather than sadness.' },
        { id: 'oi-q17', text: 'People would describe me as fiercely independent and self-sufficient.' },
        { id: 'oi-q18', text: 'I am extremely hard on myself if I make even a small mistake.' },
        { id: 'oi-q19', text: 'I enjoy being the center of attention and telling stories where I am the hero.' },
        { id: 'oi-q20', text: 'I tend to "over-prepare" for situations to ensure nothing goes wrong.' },
        { id: 'oi-q21', text: 'I feel contempt for people I see as "weak" or "needy."' },
        { id: 'oi-q22', text: 'I am quick to point out why a problem is someone else\'s fault, not mine.' },
        { id: 'oi-q23', text: 'I avoid situations where I might have to rely on others.' },
        { id: 'oi-q24', text: 'My self-worth is tied almost entirely to my achievements and performance.' },
        { id: 'oi-q25', text: 'I feel entitled to special treatment that others don\'t receive.' },
        { id: 'oi-q26', text: 'I am often preoccupied with the potential for betrayal or being taken advantage of.' },
        { id: 'oi-q27', text: 'I have a rebellious streak and don\'t like to conform to expectations.' },
        { id: 'oi-q28', text: 'I get into power struggles with others to ensure I come out on top.' },
        { id: 'oi-q29', text: 'I keep my feelings to myself because I believe they are a sign of weakness.' },
        { id: 'oi-q30', text: 'I get angry and defensive when things don\'t go according to my plan.' },
    ]
  }
];

export const LIKERT_SCALE_YSQ: { value: number; label: string }[] = [
  { value: 1, label: 'Completely untrue of me' },
  { value: 2, label: 'Mostly untrue of me' },
  { value: 3, label: 'Slightly more true than untrue' },
  { value: 4, label: 'Moderately true of me' },
  { value: 5, label: 'Mostly true of me' },
  { value: 6, label: 'Describes me perfectly' },
];

export const LIKERT_SCALE_YPI: { value: number; label: string }[] = [
  { value: 1, label: 'Completely untrue' },
  { value: 2, label: 'Mostly untrue' },
  { value: 3, label: 'Slightly more true than untrue' },
  { value: 4, label: 'Moderately true' },
  { value: 5, label: 'Mostly true' },
  { value: 6, label: 'Describes them perfectly' },
];

export const LIKERT_SCALE_SMI: { value: number; label: string }[] = [
    { value: 1, label: 'Never or almost never' },
    { value: 2, label: 'Rarely' },
    { value: 3, label: 'Sometimes' },
    { value: 4, label: 'Fairly often' },
    { value: 5, label: 'Often' },
    { value: 6, label: 'Very often / All the time' },
];

export const LIKERT_SCALE_OI: { value: number; label: string }[] = [
    { value: 1, label: 'Never true of me' },
    { value: 2, label: 'Rarely true of me' },
    { value: 3, label: 'Sometimes true of me' },
    { value: 4, label: 'Often true of me' },
    { value: 5, label: 'Very often true of me' },
    { value: 6, label: 'Describes me perfectly' },
];