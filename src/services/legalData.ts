
// Real legal framework data sourced from actual international and national law
export interface LegalFramework {
  id: string;
  name: string;
  jurisdiction: string;
  type: 'constitutional' | 'statutory' | 'international' | 'common_law' | 'civil_law';
  source: string;
  articles: LegalArticle[];
  effective_date: string;
  language: string;
}

export interface LegalArticle {
  article_number: string;
  title: string;
  text: string;
  scope: string[];
  precedents?: string[];
}

// Real international legal frameworks
export const internationalLegalFrameworks: LegalFramework[] = [
  {
    id: 'udhr-1948',
    name: 'Universal Declaration of Human Rights',
    jurisdiction: 'international',
    type: 'international',
    source: 'United Nations General Assembly Resolution 217 A (III)',
    effective_date: '1948-12-10',
    language: 'en',
    articles: [
      {
        article_number: 'Article 1',
        title: 'Equality and Dignity',
        text: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.',
        scope: ['human_rights', 'equality', 'dignity']
      },
      {
        article_number: 'Article 7',
        title: 'Equality Before Law',
        text: 'All are equal before the law and are entitled without any discrimination to equal protection of the law.',
        scope: ['legal_equality', 'non_discrimination', 'due_process']
      },
      {
        article_number: 'Article 8',
        title: 'Right to Remedy',
        text: 'Everyone has the right to an effective remedy by the competent national tribunals for acts violating the fundamental rights granted him by the constitution or by law.',
        scope: ['remedy', 'access_to_justice', 'legal_protection']
      }
    ]
  },
  {
    id: 'iccpr-1966',
    name: 'International Covenant on Civil and Political Rights',
    jurisdiction: 'international',
    type: 'international',
    source: 'UN Treaty Series, vol. 999, p. 171',
    effective_date: '1976-03-23',
    language: 'en',
    articles: [
      {
        article_number: 'Article 14',
        title: 'Fair Trial Rights',
        text: 'All persons shall be equal before the courts and tribunals. In the determination of any criminal charge against him, or of his rights and obligations in a suit at law, everyone shall be entitled to a fair and public hearing by a competent, independent and impartial tribunal established by law.',
        scope: ['due_process', 'fair_trial', 'judicial_independence']
      }
    ]
  }
];

// Real national legal frameworks (examples from major jurisdictions)
export const nationalLegalFrameworks: Record<string, LegalFramework[]> = {
  'US': [
    {
      id: 'us-constitution-14th',
      name: 'U.S. Constitution - Fourteenth Amendment',
      jurisdiction: 'US',
      type: 'constitutional',
      source: 'U.S. Constitution, Amendment XIV (1868)',
      effective_date: '1868-07-09',
      language: 'en',
      articles: [
        {
          article_number: 'Section 1',
          title: 'Equal Protection Clause',
          text: 'No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States; nor shall any State deprive any person of life, liberty, or property, without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.',
          scope: ['due_process', 'equal_protection', 'civil_rights']
        }
      ]
    }
  ],
  'DE': [
    {
      id: 'gg-article-3',
      name: 'Grundgesetz Article 3 - Equality',
      jurisdiction: 'DE',
      type: 'constitutional',
      source: 'Basic Law for the Federal Republic of Germany (Grundgesetz)',
      effective_date: '1949-05-23',
      language: 'de',
      articles: [
        {
          article_number: 'Article 3',
          title: 'Equality before the law',
          text: 'All persons shall be equal before the law. Men and women shall have equal rights. No person shall be favoured or disfavoured because of sex, parentage, race, language, homeland and origin, faith or religious or political opinions.',
          scope: ['equality', 'non_discrimination', 'gender_equality']
        }
      ]
    }
  ],
  'GH': [
    {
      id: 'gh-constitution-ch5',
      name: 'Constitution of Ghana - Chapter 5',
      jurisdiction: 'GH',
      type: 'constitutional',
      source: 'Constitution of the Republic of Ghana, 1992',
      effective_date: '1993-01-07',
      language: 'en',
      articles: [
        {
          article_number: 'Article 17',
          title: 'Equality and Freedom from Discrimination',
          text: 'All persons shall be equal before the law. A person shall not be discriminated against on grounds of gender, race, colour, ethnic origin, religion, creed or social or economic status.',
          scope: ['equality', 'non_discrimination', 'fundamental_rights']
        }
      ]
    }
  ]
};

export const getApplicableLaw = (jurisdiction: string, category: string): LegalFramework[] => {
  const nationalLaws = nationalLegalFrameworks[jurisdiction] || [];
  const applicableInternational = internationalLegalFrameworks.filter(framework =>
    framework.articles.some(article => 
      article.scope.some(scope => scope.includes(category.toLowerCase()))
    )
  );
  
  return [...nationalLaws, ...applicableInternational];
};

export const findRelevantArticles = (jurisdiction: string, injusticeType: string): LegalArticle[] => {
  const applicableLaws = getApplicableLaw(jurisdiction, injusticeType);
  return applicableLaws.flatMap(law => 
    law.articles.filter(article =>
      article.scope.some(scope => 
        scope.includes(injusticeType.toLowerCase()) || 
        scope.includes('equality') || 
        scope.includes('due_process')
      )
    )
  );
};
