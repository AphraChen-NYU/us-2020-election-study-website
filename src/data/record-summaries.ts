import type { OutcomeRow, OutcomeTable } from "@/data/outcome-measures";

export type ComponentSourceField = "questionsUsed" | "method";

export interface CuratedComponent {
  label: string;
  sourceField: ComponentSourceField;
  sourceItem: string;
}

export type CuratedMethodTagTone =
  | "analysis"
  | "rotation"
  | "aggregation"
  | "transformation"
  | "coding"
  | "validation"
  | "restriction"
  | "selfReport"
  | "general";

export interface CuratedMethodTag {
  label: string;
  tone: CuratedMethodTagTone;
}

export interface CuratedRecordSummary {
  components: CuratedComponent[];
  methods?: CuratedMethodTag[];
  excludedMethodTagTerms?: string[];
  methodTagReplacements?: Record<string, string>;
}

const CF = "Chronological Feed (Guess et al., 2023)";
const AD = "Ad Experimental (Allcott et al., working paper)";
const DE = "Deactivation (Allcott et al., 2024)";
const LM = "Likeminded (Nyhan et al., 2023)";
const RS = "Reshares (Guess et al., 2023)";
const UN = "Untrustworthy (Bergeron-Boutin et al., working paper)";

export function recordSummaryKey(tableId: string, paper: string) {
  return `${tableId}::${paper}`;
}

function fromQuestions(...labels: string[]): CuratedRecordSummary {
  return {
    components: labels.map((label, index) => ({
      label,
      sourceField: "questionsUsed",
      sourceItem: String(index + 1),
    })),
  };
}

function mixed(components: CuratedComponent[]): CuratedRecordSummary {
  return { components };
}

const affectivePolarization = [
  "Feeling-thermometer difference: preferred-party supporters vs. other-party supporters",
  "Feeling-thermometer difference: people running for office for the preferred party vs. the other party",
  "Perceived-smartness difference: preferred-party supporters vs. other-party supporters",
];

const detailedIssueOpinions = [
  "IMMIG: Civilian-refugee admissions",
  "HEALTH: Repeal of the Affordable Care Act",
  "UNEMPLOY: $600-per-week supplemental unemployment benefit",
  "COVID: Public face-mask requirement",
  "FOREIGN: Ban on Chinese-owned apps",
  "POLICE: Reallocation of police funding to social services",
  "BLACKWHITE[A-D]: Perceived racial fairness across institutions",
  "SEXISM1_2[A,B]: Attitudes about sexism and sexual-harassment allegations",
];

const politicalParticipation = [
  "Attended a protest or rally",
  "Contributed money to a political candidate or organization",
  "Signed an online petition",
  "Tried to persuade someone how to vote",
  "Posted political messages online",
  "Discussed politics with someone they know",
];

const onPlatformEngagementFull = [
  "Engagement with content classified as political or civic",
  "Interest in, attendance at, or creation of political/civic events",
  "Engagement with the Voting Information Center or Voter Hub",
  "Engagement with Town Hall",
  "Petition clicks or shares",
  "Donations to civic or political causes",
  "Constituent-badge activation",
  "Engagement with politicians and candidates, including Messenger contacts",
];

const votePreferenceLikeminded = [
  "Presidential vote for the ideologically congenial party candidate",
  "House vote for the ideologically congenial party candidate",
  "Feeling thermometer for the ideologically congenial presidential candidate",
  "Feeling thermometer for the ideologically uncongenial presidential candidate",
];

const votePreferenceUntrustworthy = [
  "Presidential vote for the self-identified congenial-party candidate",
  "House vote for the self-identified congenial-party candidate",
  "Feeling thermometer for the self-identified congenial-party presidential candidate",
  "Feeling thermometer for the self-identified uncongenial-party presidential candidate",
];

const democraticStandards = [
  "Government noninterference with journalists and news organizations",
  "Government protection of unpopular speech and expression",
  "Elections free from foreign influence",
  "Equal voting opportunity for all adult citizens",
  "Elections conducted without fraud",
  "Voter knowledge about candidates and issues",
];

const traditionalMediaSources = [
  "Trust in political information from local news",
  "Trust in political information from national newspapers",
  "Trust in political information from national network television news",
  "Trust in political information from MSNBC",
  "Trust in political information from CNN",
  "Trust in political information from Fox News",
];

const electionKnowledgePolicies = [
  "Medicaid coverage for undocumented immigrants",
  "$15 federal minimum wage",
  "U.S. withdrawal from the World Health Organization",
  "Fossil-fuel extraction in the Arctic National Wildlife Refuge",
  "Replacing the Electoral College with a national popular vote",
  "Eliminating taxes on U.S.-based corporations",
];

const newsKnowledgeEvents = [
  "Whether France lifted all COVID-related restrictions",
  "Whether Donald Trump stopped public rallies because of COVID risks",
  "Whether agents foiled a militia plot to kidnap Governor Gretchen Whitmer",
  "Whether Derek Chauvin was promoted after killing George Floyd",
  "Whether Pope Francis supported same-sex civil unions",
  "Whether debate microphones were muted during each candidate's allotted time",
  "Whether Amy Coney Barrett became the newest Supreme Court justice",
];

const factKnowledgeClaims = [
  "Claim that Hunter Biden's laptop proves Joe Biden took foreign bribes",
  "Claim that the FBI director identified white supremacists as the greatest domestic terrorist threat",
  "Claim that Amy Coney Barrett said women need a man's permission to own property",
  "Claim that the U.S. government planned to force COVID-19 vaccination",
  "Claim that masks are ineffective at preventing COVID-19 transmission",
  "Claim that millions of fraudulent ballots were cast in the 2020 presidential election",
  "Claim that Donald Trump held a Bible upside-down in front of a church",
  "Claim that most rural counties were in the COVID-19 red zone in October",
  "Claim that Anthony Fauci initially did not recommend public mask-wearing",
  "Claim that Donald Trump arranged a payment to an adult-film actor before the 2016 election",
  "Claim that Joe Biden is a pedophile",
];

export const curatedRecordSummaries: Record<string, CuratedRecordSummary> = {
  // A1.1 - Affective polarization
  [recordSummaryKey("a1-1", CF)]: fromQuestions(...affectivePolarization),
  [recordSummaryKey("a1-1", AD)]: fromQuestions(...affectivePolarization),
  [recordSummaryKey("a1-1", DE)]: fromQuestions(...affectivePolarization),
  [recordSummaryKey("a1-1", LM)]: fromQuestions(...affectivePolarization),
  [recordSummaryKey("a1-1", RS)]: fromQuestions(...affectivePolarization),
  [recordSummaryKey("a1-1", UN)]: fromQuestions(...affectivePolarization),

  // A1.2 - Issue polarization
  [recordSummaryKey("a1-2", CF)]: {
    ...fromQuestions("Issue opinions: immigration, healthcare, unemployment, COVID-19 restrictions, racial discrimination, and gender discrimination"),
    excludedMethodTagTerms: ["factor analysis"],
  },
  [recordSummaryKey("a1-2", AD)]: fromQuestions(...detailedIssueOpinions),
  [recordSummaryKey("a1-2", DE)]: fromQuestions(...detailedIssueOpinions),
  [recordSummaryKey("a1-2", LM)]: fromQuestions("Issue opinions: immigration, healthcare, unemployment, COVID-19, foreign policy, and police funding"),
  [recordSummaryKey("a1-2", RS)]: fromQuestions("Issue opinions: immigration, healthcare, unemployment, COVID-19 restrictions, racial discrimination, and gender discrimination"),
  [recordSummaryKey("a1-2", UN)]: fromQuestions("Issue opinions: immigration, healthcare, unemployment, COVID-19, racial fairness, police funding, and sexism/#MeToo"),

  // A1.3 - Perceived polarization
  [recordSummaryKey("a1-3", CF)]: fromQuestions(
    "Perceived ideological distance between supporters of the two parties",
    "Perceived ideological distance between candidates from the two parties",
    "Perceived ideological distance between same- and other-party people seen on Facebook/Instagram",
  ),
  [recordSummaryKey("a1-3", AD)]: fromQuestions(
    "Perceived ideological difference: own-party vs. other-party supporters",
    "Perceived ideological difference: own-party vs. other-party candidates",
  ),
  [recordSummaryKey("a1-3", DE)]: fromQuestions(
    "Perceived ideological difference: own-party vs. other-party supporters",
    "Perceived ideological difference: own-party vs. other-party candidates",
  ),
  [recordSummaryKey("a1-3", LM)]: fromQuestions(
    "Absolute perceived ideological difference: Democratic vs. Republican supporters",
    "Absolute perceived ideological difference: Democratic vs. Republican candidates",
    "Absolute perceived ideological difference: Democratic vs. Republican supporters seen on Facebook",
  ),
  [recordSummaryKey("a1-3", RS)]: fromQuestions(
    "Perceived ideological distance between supporters of the two parties",
    "Perceived ideological distance between candidates from the two parties",
    "Perceived ideological distance between same- and other-party people seen on Facebook",
  ),

  // A2.1 - Platform usage (the PDF's Questions used cells are blank)
  [recordSummaryKey("a2-1", CF)]: fromQuestions(),
  [recordSummaryKey("a2-1", AD)]: fromQuestions(),
  [recordSummaryKey("a2-1", LM)]: fromQuestions(),
  [recordSummaryKey("a2-1", RS)]: fromQuestions(),
  [recordSummaryKey("a2-1", UN)]: fromQuestions(),

  // A2.2 - General participation
  [recordSummaryKey("a2-2", CF)]: { ...fromQuestions(...politicalParticipation), excludedMethodTagTerms: ["binary coding"] },
  [recordSummaryKey("a2-2", AD)]: { ...fromQuestions(...politicalParticipation), excludedMethodTagTerms: ["binary coding"] },
  [recordSummaryKey("a2-2", DE)]: { ...fromQuestions(...politicalParticipation), excludedMethodTagTerms: ["binary coding"] },
  [recordSummaryKey("a2-2", LM)]: { ...fromQuestions("Six binary questions covering different forms of political engagement"), excludedMethodTagTerms: ["binary coding"] },
  [recordSummaryKey("a2-2", UN)]: { ...fromQuestions(...politicalParticipation), excludedMethodTagTerms: ["binary coding"] },

  // A2.3 - Political contributions
  [recordSummaryKey("a2-3", AD)]: {
    ...mixed([
      { label: "Self-reported contribution amount in the month before the election", sourceField: "questionsUsed", sourceItem: "Self-reported 1" },
      { label: "Validated total campaign contributions during the 2020 election period", sourceField: "questionsUsed", sourceItem: "Validated 1" },
      { label: "Validated campaign contributions during the 30 days before the election", sourceField: "questionsUsed", sourceItem: "Validated 2" },
    ]),
    excludedMethodTagTerms: ["binned contributions into"],
  },
  [recordSummaryKey("a2-3", DE)]: {
    ...mixed([
      { label: "Self-reported indicator of any political contribution", sourceField: "questionsUsed", sourceItem: "Self-reported 1" },
      { label: "Self-reported contribution amount in the month before the election", sourceField: "questionsUsed", sourceItem: "Self-reported 2" },
      { label: "Validated total campaign contributions during the 2020 election period", sourceField: "questionsUsed", sourceItem: "Validated 1" },
      { label: "Validated campaign contributions during the 30 days before the election", sourceField: "questionsUsed", sourceItem: "Validated 2" },
    ]),
    methods: [
      { label: "Self-reported measure", tone: "selfReport" },
      { label: "Validated against administrative records", tone: "validation" },
    ],
  },

  // A2.4 - On-platform political engagement
  [recordSummaryKey("a2-4", CF)]: {
    ...fromQuestions(...onPlatformEngagementFull),
    methods: [
      { label: "PCA", tone: "analysis" },
      { label: "Varimax rotation", tone: "rotation" },
      { label: "Index of on-platform political engagement", tone: "aggregation" },
    ],
  },
  [recordSummaryKey("a2-4", AD)]: fromQuestions(
    "Engagement with content classified as civic",
    "Views of or clicks on Voter Hub",
    "Engagement with political figures",
    "Interest in civic events (Facebook only)",
    "Petition clicks (Facebook only)",
    "Donations to civic causes (Facebook only)",
    "Constituent-badge activation (Facebook only)",
  ),
  [recordSummaryKey("a2-4", LM)]: {
    ...fromQuestions(...onPlatformEngagementFull),
    methods: [
      { label: "Exploratory factor analysis", tone: "analysis" },
      { label: "Varimax rotation", tone: "rotation" },
      { label: "The average of standardized measures", tone: "aggregation" },
    ],
  },

  // A2.5 - Turnout
  [recordSummaryKey("a2-5", CF)]: fromQuestions("Self-reported voting in the 2020 presidential election"),
  [recordSummaryKey("a2-5", AD)]: fromQuestions("Self-reported 2020 election turnout", "Validated turnout from matched voter-profile data"),
  [recordSummaryKey("a2-5", DE)]: fromQuestions("Self-reported 2020 election turnout", "Validated turnout from matched voter-profile data"),
  [recordSummaryKey("a2-5", LM)]: fromQuestions("Self-reported 2020 general-election turnout", "Validated 2020 turnout from survey-vendor voter records"),
  [recordSummaryKey("a2-5", UN)]: fromQuestions("Self-reported 2020 general-election turnout", "Validated turnout from vendor-matched voter-file data"),

  // A2.6 - Vote preference and candidate ranking
  [recordSummaryKey("a2-6", CF)]: {
    ...fromQuestions(
      "Self-reported feeling thermometer for Donald Trump",
      "Party-line presidential voting based on vote choice and party identification",
      "Party-line down-ballot voting based on state-office choices and party identification",
    ),
    methods: [
      { label: "Self-reported measures", tone: "selfReport" },
      { label: "binary coding for presidential voting", tone: "coding" },
      { label: "sum of votes for downballot voting", tone: "aggregation" },
    ],
  },
  [recordSummaryKey("a2-6", AD)]: {
    ...fromQuestions(
      "Self-reported vote for Donald Trump",
      "Trump favorability from approval and Trump-vs.-Biden thermometer ratings",
      "Republican voting across Senate, governor, and House races",
      "Incumbent voting across Senate, governor, and House races",
      "Straight-ticket voting across multiple offices",
    ),
    methodTagReplacements: {
      "Average of standardized measures": "Trump favorability: (a) average of standardized values; (b) self-reported approval coded 1–5; (c) absolute difference between thermometer ratings",
    },
  },
  [recordSummaryKey("a2-6", DE)]: {
    ...fromQuestions(
      "Self-reported vote for Donald Trump",
      "Trump favorability from approval and Trump-vs.-Biden thermometer ratings",
      "Republican voting across Senate, governor, and House races",
      "Incumbent voting across Senate, governor, and House races",
      "Straight-ticket voting across multiple offices",
    ),
    methodTagReplacements: {
      "Average of standardized measures": "Trump favorability: (a) average of standardized values; (b) self-reported approval coded 1–5; (c) absolute difference between thermometer ratings",
    },
  },
  [recordSummaryKey("a2-6", LM)]: fromQuestions(...votePreferenceLikeminded),
  [recordSummaryKey("a2-6", RS)]: {
    ...fromQuestions(
      "Party-line presidential voting based on vote choice and party identification",
      "Party-line down-ballot voting based on state-office choices and party identification",
    ),
    methods: [
      { label: "Binary coding for party-line presidential voting", tone: "coding" },
      { label: "Sum of votes for party-line downballot voting", tone: "aggregation" },
    ],
  },
  [recordSummaryKey("a2-6", UN)]: fromQuestions(...votePreferenceUntrustworthy),

  // A3.1 - Election legitimacy
  [recordSummaryKey("a3-1", CF)]: fromQuestions("Belief about the winner of the 2020 presidential election", "Perceived election irregularities", "Confidence in election officials", "Perceived accuracy of election results and mail-in voting"),
  [recordSummaryKey("a3-1", RS)]: fromQuestions("Belief about the winner of the 2020 presidential election", "Perceived election irregularities", "Confidence in election officials", "Perceived accuracy of election results and mail-in voting"),

  // A3.2 - Party-congenial election misconduct and outcomes
  [recordSummaryKey("a3-2", LM)]: fromQuestions("Party-congenial coding of the perceived 2020 election winner", "Party-congenial coding of perceived illegal-voting frequency", "Party-congenial coding of whether illegal voting changed the election outcome"),
  [recordSummaryKey("a3-2", UN)]: fromQuestions("Party-congenial coding of the perceived 2020 election winner", "Party-congenial coding of perceived illegal-voting frequency", "Party-congenial coding of whether illegal voting changed the election outcome"),

  // A3.3 - Respect for election norms
  [recordSummaryKey("a3-3", LM)]: fromQuestions("Party-congenial coding of whether Donald Trump should concede to Joe Biden"),
  [recordSummaryKey("a3-3", UN)]: fromQuestions("Party-congenial coding of whether Donald Trump should concede to Joe Biden"),

  // A3.4 - Confidence in elections
  [recordSummaryKey("a3-4", LM)]: fromQuestions("Party-congenial confidence in election officials", "Party-congenial perceived accuracy of the 2020 vote count", "Party-congenial trust in mail-ballot counting accuracy"),
  [recordSummaryKey("a3-4", UN)]: fromQuestions("Party-congenial confidence in election officials", "Party-congenial perceived accuracy of the 2020 vote count", "Party-congenial trust in mail-ballot counting accuracy"),

  // A3.5 - Democratic performance
  [recordSummaryKey("a3-5", AD)]: fromQuestions(...democraticStandards),
  [recordSummaryKey("a3-5", DE)]: fromQuestions(...democraticStandards),
  [recordSummaryKey("a3-5", LM)]: fromQuestions("Six statements assessing whether the United States meets democratic standards"),
  [recordSummaryKey("a3-5", UN)]: fromQuestions("Three statements assessing whether the United States meets democratic standards"),

  // A3.6 - Confidence in institutions
  [recordSummaryKey("a3-6", CF)]: fromQuestions("Confidence in the executive branch, Congress, police, Supreme Court, local and state government, and large corporations"),
  [recordSummaryKey("a3-6", RS)]: fromQuestions("Confidence in the executive branch, Congress, police, Supreme Court, local and state government, and large corporations"),

  // A3.7 - Trust in political information from media
  [recordSummaryKey("a3-7", CF)]: fromQuestions("Trust in political information from local news, national newspapers, network television, MSNBC, and CNN"),
  [recordSummaryKey("a3-7", AD)]: fromQuestions(...traditionalMediaSources),
  [recordSummaryKey("a3-7", DE)]: fromQuestions(...traditionalMediaSources),
  [recordSummaryKey("a3-7", RS)]: fromQuestions("Trust in political information from local news, national newspapers, network television, MSNBC, and CNN"),
  [recordSummaryKey("a3-7", UN)]: fromQuestions("Trust in political information from local news, national newspapers, and network television news"),

  // A3.8 - Trust in political information from social media
  [recordSummaryKey("a3-8", CF)]: fromQuestions("Trust in political information from Facebook, Instagram, and Twitter"),
  [recordSummaryKey("a3-8", AD)]: fromQuestions("Trust in political information from Facebook", "Trust in political information from Instagram"),
  [recordSummaryKey("a3-8", DE)]: fromQuestions("Trust in political information from Facebook", "Trust in political information from Instagram"),
  [recordSummaryKey("a3-8", RS)]: fromQuestions("Trust in political information from Facebook, Instagram, and Twitter"),

  // A4.1 - Election knowledge
  [recordSummaryKey("a4-1", CF)]: fromQuestions("Correct identification of policy positions endorsed by Donald Trump, Joe Biden, or neither"),
  [recordSummaryKey("a4-1", AD)]: fromQuestions(...electionKnowledgePolicies),
  [recordSummaryKey("a4-1", DE)]: fromQuestions(...electionKnowledgePolicies),
  [recordSummaryKey("a4-1", LM)]: fromQuestions("Proportion correct on a six-item candidate-policy-position battery"),
  [recordSummaryKey("a4-1", RS)]: fromQuestions("Correct identification of policy positions endorsed by Donald Trump, Joe Biden, or neither"),
  [recordSummaryKey("a4-1", UN)]: fromQuestions("Proportion correct on a six-item candidate-policy-position battery"),

  // A4.2 - News knowledge
  [recordSummaryKey("a4-2", CF)]: fromQuestions("Correct identification of whether seven recent news events occurred"),
  [recordSummaryKey("a4-2", AD)]: fromQuestions(...newsKnowledgeEvents),
  [recordSummaryKey("a4-2", DE)]: fromQuestions(...newsKnowledgeEvents),
  [recordSummaryKey("a4-2", LM)]: fromQuestions("Proportion correct on a seven-item current-events knowledge battery"),
  [recordSummaryKey("a4-2", RS)]: fromQuestions("Correct identification of whether seven recent news events occurred"),
  [recordSummaryKey("a4-2", UN)]: mixed([
    { label: "Certainty that each of seven campaign-period events did or did not occur", sourceField: "questionsUsed", sourceItem: "Research Question version 1" },
    { label: "Proportion correct on a seven-item current-events knowledge battery", sourceField: "questionsUsed", sourceItem: "Additional Outcomes version 1" },
  ]),

  // A4.3 - Fact knowledge
  [recordSummaryKey("a4-3", AD)]: fromQuestions(...factKnowledgeClaims),
  [recordSummaryKey("a4-3", DE)]: fromQuestions(...factKnowledgeClaims),

  // A4.4 - Knowledge index
  [recordSummaryKey("a4-4", AD)]: fromQuestions("Election knowledge: candidate policy-position identification", "News knowledge: accuracy about recent events", "Fact knowledge: accuracy about circulating true and false claims"),
  [recordSummaryKey("a4-4", DE)]: fromQuestions("Election knowledge: candidate policy-position identification", "News knowledge: accuracy about recent events", "Fact knowledge: accuracy about circulating true and false claims"),

  // A4.5 - Factual discernment
  [recordSummaryKey("a4-5", CF)]: fromQuestions("Belief accuracy across six true and ten false claims circulating online"),
  [recordSummaryKey("a4-5", RS)]: fromQuestions("Belief accuracy across six true and ten false claims circulating online"),
  [recordSummaryKey("a4-5", LM)]: fromQuestions("Wave 4 belief accuracy across partisan, COVID-related, and candidate claims", "Wave 5 belief accuracy across six false and three true-but-plausibly-false election claims"),
  [recordSummaryKey("a4-5", UN)]: fromQuestions(
    "Conservative-congenial false claims about Hunter Biden's laptop and Joe Biden",
    "Liberal-congenial false claim about Amy Coney Barrett and women's property ownership",
    "COVID-related false claims about masks and compulsory vaccination",
    "False claim attributed to Donald Trump about fraudulent 2020 ballots",
    "False claim attributed to Joe Biden about Donald Trump holding a Bible upside-down",
    "True liberal-congenial claims about white-supremacist terrorism and Donald Trump's pre-2016 payment",
    "True conservative-congenial claim about Anthony Fauci's early mask guidance",
    "True COVID-related claim about rural counties in the red zone",
  ),

  // A4.6 - Beliefs in false claims
  [recordSummaryKey("a4-6", LM)]: fromQuestions("Wave 4 belief in partisan, COVID-related, and candidate false claims", "Wave 5 belief in six false election-related claims"),
  [recordSummaryKey("a4-6", UN)]: fromQuestions(
    "Conservative-congenial false claims about Hunter Biden's laptop and Joe Biden",
    "Liberal-congenial false claim about Amy Coney Barrett and women's property ownership",
    "COVID-related false claims about masks and compulsory vaccination",
    "False claim attributed to Donald Trump about fraudulent 2020 ballots",
    "False claim attributed to Joe Biden about Donald Trump holding a Bible upside-down",
  ),

  // A4.7 - Pro-attitudinal knowledge and false claims
  [recordSummaryKey("a4-7", LM)]: fromQuestions("Wave 4 pro-attitudinal accuracy across partisan, COVID-related, and candidate claims", "Wave 5 pro-attitudinal accuracy across six false and three true-but-plausibly-false election claims"),
  [recordSummaryKey("a4-7", UN)]: fromQuestions("True and false claim subset congenial to liberal participants", "True and false claim subset congenial to conservative participants"),
};

export function getCuratedRecordSummary(table: OutcomeTable, row: OutcomeRow) {
  return curatedRecordSummaries[recordSummaryKey(table.id, row.paper)];
}
