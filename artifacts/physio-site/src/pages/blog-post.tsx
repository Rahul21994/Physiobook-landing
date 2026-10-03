import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import type { BlogPost } from "@/lib/data";
import { blogIndex, journalDiscoveryIndex } from "@/lib/blog-index";
import { getRuntimeBlogPost } from "@/lib/blog-post-runtime";
import { getCityBySlug } from "@/lib/cities";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Tag,
  User,
} from "lucide-react";
import { motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  parseArticleBlocks,
  parseInlineMarkdown,
  type ArticleBlock,
} from "@/lib/article-markdown";
import { getJournalImagePath, getJournalWebpImagePath } from "@/components/JournalTileArt";
import { ContentAttribution } from "@/components/ContentAttribution";
import { BLOG_AUTHOR_PROFILE, BLOG_REVIEWER_PROFILE } from "@/lib/content-profiles";
import { Helmet } from "react-helmet-async";
import { ContextualLinks } from "@/components/ContextualLinks";
import {
  getArticleServiceLink,
  getRelatedJournalPosts,
} from "@/lib/contextual-links";
import "@/journal.css";

type ArticlePathway = { href: string; label: string };

function getBlogArticleTitle(post: Pick<BlogPost, "title">): string {
  return post.title.replace(/\s+/g, " ").trim();
}

function getBlogAuthorProfile(post: Pick<BlogPost, "authorProfile">) {
  return post.authorProfile ?? BLOG_AUTHOR_PROFILE;
}

const categoryPathways: Array<{ match: string[]; pathway: ArticlePathway }> = [
  {
    match: ["neuro", "stroke", "parkinson", "brain", "spinal"],
    pathway: { href: "/stroke-rehab", label: "stroke and neurological rehabilitation" },
  },
  {
    match: ["cardio", "pulmonary", "copd", "breathing", "heart"],
    pathway: { href: "/services/cardiopulmonary-rehabilitation", label: "cardiopulmonary service overview" },
  },
  {
    match: ["knee", "joint", "orthop", "arthritis"],
    pathway: { href: "/knee-pain", label: "knee pain physiotherapy" },
  },
  {
    match: ["back", "neck", "sciatica", "posture"],
    pathway: { href: "/back-pain", label: "back pain physiotherapy" },
  },
  {
    match: ["surgery", "fracture", "replacement", "post-op"],
    pathway: { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
  },
  {
    match: ["pain", "injury", "running", "cycling", "sports"],
    pathway: { href: "/services/pain-management-physiotherapy", label: "pain-management physiotherapy" },
  },
];

const focusedArticlePathways: Record<string, ArticlePathway> = {
  "hip-fracture-rehabilitation-home-bengaluru": {
    href: "/post-surgery-rehab",
    label: "post-surgery rehabilitation after hip fracture",
  },
  "ankle-sprain-rehabilitation-guide": {
    href: "/services/clinical-assessment-evaluation",
    label: "clinical assessment for ankle recovery",
  },
  "returning-to-running-after-acl-injury-gurugram": {
    href: "/sports-injury-rehabilitation",
    label: "sports rehabilitation for a measured return to running",
  },
  "tennis-elbow-recovery-racquet-gym-gurugram": {
    href: "/sports-injury-rehabilitation",
    label: "sports rehabilitation for racquet and gym activity",
  },
  "neck-pain-cervical-stiffness-physiotherapy": {
    href: "/neck-pain",
    label: "neck pain physiotherapy",
  },
  "sciatica-physiotherapy-treatment-guide": {
    href: "/sciatica",
    label: "sciatica physiotherapy",
  },
  "knee-osteoarthritis-physiotherapy-guide": {
    href: "/arthritis-osteoarthritis",
    label: "arthritis and osteoarthritis care",
  },
  "parkinsons-physiotherapy-guide": {
    href: "/parkinsons-rehab",
    label: "Parkinson’s rehabilitation",
  },
  "copd-physiotherapy-management": {
    href: "/services/clinical-assessment-evaluation",
    label: "clinical assessment for breathing rehabilitation",
  },
  "frozen-shoulder-physiotherapy-treatment": {
    href: "/services/pain-management-physiotherapy",
    label: "pain-management physiotherapy for shoulder recovery",
  },
  "guillain-barre-syndrome-recovery": {
    href: "/services/clinical-assessment-evaluation",
    label: "clinical assessment for neurological rehabilitation",
  },
  "neurological-physiotherapy-brain-injury": {
    href: "/services/clinical-assessment-evaluation",
    label: "clinical assessment for brain-injury recovery",
  },
  "skin-inflammation-vasculitis-diet-guide": {
    href: "/nutritionist-dietitian-online",
    label: "nutritional consultation for recovery support",
  },
};

const focusedJournalLinks: Record<string, ArticlePathway[]> = {
  "ankle-sprain-rehabilitation-guide": [
    { href: "/blog/plantar-fasciitis-physiotherapy-guide", label: "plantar-foot recovery guide" },
  ],
  "frozen-shoulder-physiotherapy-treatment": [
    { href: "/blog/rotator-cuff-surgery-rehabilitation", label: "shoulder rehabilitation guide" },
  ],
  "plantar-fasciitis-physiotherapy-guide": [
    { href: "/blog/ankle-sprain-rehabilitation-guide", label: "ankle recovery guide" },
  ],
  "physiotherapist-at-home-bengaluru": [
    { href: "/blog/hip-fracture-rehabilitation-home-bengaluru", label: "Bengaluru hip-fracture recovery guide" },
  ],
  "physiotherapist-at-home-delhi": [
    { href: "/blog/pelvic-floor-physiotherapy-after-childbirth-delhi", label: "Delhi women’s health guide" },
  ],
  "physiotherapist-at-home-jaipur": [
    { href: "/blog/physiotherapist-at-home-india-guide", label: "India home-physiotherapy guide" },
  ],
  "physiotherapist-at-home-india-guide": [
    { href: "/blog/physiotherapist-at-home-jaipur", label: "Jaipur home-physiotherapy guide" },
  ],
};

const nutritionContents = [
  ["What the guide answers", "nutrition-guide-answers"],
  ["Skin inflammation and vasculitis", "what-blood-vessel-inflammation-means"],
  ["Symptoms and assessment", "symptoms-outside-the-skin-that-change-the-urgency"],
  ["Nutrition support and cautions", "what-dietary-changes-can-reasonably-support"],
  ["When rehabilitation fits", "how-rehabilitation-fits-and-where-it-does-not"],
  ["Urgent and prompt care", "safety-and-when-to-seek-medical-advice"],
] as const;

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}

type JournalTheme = {
  className: string;
  kicker: string;
  imageAlt: string;
  imageCaption: string;
};

function getJournalTheme(post: BlogPost): JournalTheme {
  if (post.slug === "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1") {
    return {
      className: "journal-orthopaedic-header",
      kicker: "An orthopaedic guide to lower-back and leg symptoms",
      imageAlt: "Representative movement and lower-back artwork for a lumbar disc guide",
      imageCaption: "Representative editorial image · not a patient photograph",
    };
  }

  if (post.presentation === "nutrition-guidance") {
    return {
      className: "journal-nutrition-header",
      kicker: "A practical clinical guide",
      imageAlt: "Representative still life of balanced foods for a nutrition and recovery guide",
      imageCaption: "Representative editorial image · not a patient photograph",
    };
  }

  if (post.category.toLowerCase().includes("neuro")) {
    return {
      className: "journal-neuro-header",
      kicker: "Practical rehabilitation guidance",
      imageAlt: "Representative neuro-rehabilitation artwork",
      imageCaption: "Representative editorial image · not a patient photograph",
    };
  }

  if (post.category.toLowerCase().includes("city")) {
    return {
      className: "journal-city-header",
      kicker: "Local care guidance from Goswami Rehab",
      imageAlt: "Representative home physiotherapy artwork",
      imageCaption: "Representative editorial image · not a patient photograph",
    };
  }

  return {
    className: "journal-clinical-header",
    kicker: "Evidence-aware rehabilitation guidance",
    imageAlt: `Representative artwork for ${post.category.toLowerCase()}`,
    imageCaption: "Representative editorial image · not a patient photograph",
  };
}

function ArticleContents({ headings }: { headings: Array<{ text: string; id: string }> }) {
  if (headings.length === 0) return null;

  return (
    <nav className="journal-contents not-prose" aria-label="In this guide">
      <div className="journal-contents-heading">
        <BookOpen aria-hidden="true" className="h-4 w-4" />
        <span>In this guide</span>
      </div>
      <ol className="journal-contents-list">
        {headings.map(({ text, id }) => (
          <li key={id}>
            <a href={`#${id}`}>{text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function GeneralArticleBlocks({
  post,
  headings,
  articlePathways,
}: {
  post: BlogPost;
  headings: Array<{ text: string; id: string }>;
  articlePathways: ArticlePathway[];
}) {
  const isLumbar = post.slug === "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1";

  if (isLumbar) {
    return (
      <div className="journal-article-tools not-prose" aria-label="Lumbar guide tools">
        <section className="journal-at-a-glance journal-orthopaedic-glance">
          <div>
            <p className="journal-tool-eyebrow">At a glance</p>
            <h2>Symptoms can guide questions, not confirm a disc level</h2>
          </div>
          <p>
            L3–L4, L4–L5, and L5–S1 patterns can overlap. Assessment, strength testing,
            symptom history, and urgent warning signs matter more than trying to match pain
            to one level on an MRI report.
          </p>
        </section>

        <ArticleContents headings={headings} />

        <section className="journal-comparison-card" aria-labelledby="lumbar-levels-heading">
          <div className="journal-tool-heading">
            <p className="journal-tool-eyebrow">Compare carefully</p>
            <h2 id="lumbar-levels-heading">Common lumbar levels and what they may affect</h2>
          </div>
          <div className="journal-comparison-grid">
            <div>
              <strong>L3–L4</strong>
              <span>Front of the thigh and knee can be relevant, but symptoms vary.</span>
            </div>
            <div>
              <strong>L4–L5</strong>
              <span>Outer leg or top of the foot may be involved in some nerve-root patterns.</span>
            </div>
            <div>
              <strong>L5–S1</strong>
              <span>Back of the leg or outer foot may be involved in some presentations.</span>
            </div>
          </div>
          <p className="journal-tool-note">
            These are broad patterns, not a self-diagnosis tool. Pain can be referred,
            multiple levels can coexist, and other conditions can feel similar.
          </p>
        </section>

        <section className="journal-safety-panel" aria-labelledby="lumbar-warning-heading">
          <CircleAlert aria-hidden="true" className="journal-safety-icon" />
          <div>
            <p className="journal-tool-eyebrow">Get urgent medical help</p>
            <h2 id="lumbar-warning-heading">Do not wait for routine physiotherapy if warning signs appear</h2>
            <p>
              New bladder or bowel changes, numbness around the saddle area, rapidly
              worsening weakness, severe symptoms after major trauma, fever with severe
              back pain, or unexplained weight loss need prompt medical assessment.
            </p>
          </div>
        </section>

        <div className="journal-do-dont-grid">
          <section className="journal-do-card">
            <CheckCircle2 aria-hidden="true" />
            <div>
              <p className="journal-tool-eyebrow">Do</p>
              <h2>Prepare for an assessment</h2>
              <ul>
                <li>Note when symptoms began, what changes them, and whether strength or walking has changed.</li>
                <li>Bring scan reports and a medication list if they are available.</li>
                <li>Use comfortable movement within tolerable limits unless a clinician has given different advice.</li>
              </ul>
            </div>
          </section>
          <section className="journal-dont-card">
            <ShieldCheck aria-hidden="true" />
            <div>
              <p className="journal-tool-eyebrow">Don’t</p>
              <h2>Chase a level from pain alone</h2>
              <ul>
                <li>Do not force stretches or exercises that clearly worsen leg symptoms or weakness.</li>
                <li>Do not treat one MRI finding as the complete explanation of your symptoms.</li>
                <li>Do not delay urgent review while trying a home programme.</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="journal-detail-grid">
          <details className="journal-detail-card">
            <summary>What happens in a careful consultation?</summary>
            <div>
              <p>A clinician reviews symptoms, movement, strength, sensation, reflexes, function, and relevant medical history.</p>
              <p>The plan may include education, pacing, graded activity, and referral or medical review when the findings call for it.</p>
            </div>
          </details>
          <details className="journal-detail-card">
            <summary>When can home physiotherapy help?</summary>
            <div>
              <p>After appropriate screening, home visits can support movement confidence, everyday activity, and an individualised rehabilitation plan.</p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-article-tools not-prose" aria-label="Article guide">
      <section className="journal-at-a-glance">
        <div>
          <p className="journal-tool-eyebrow">At a glance</p>
          <h2>What this guide can help you understand</h2>
        </div>
        <p>{post.excerpt}</p>
      </section>

      <ArticleContents headings={headings} />

      <div className="journal-detail-grid">
        <details className="journal-detail-card">
          <summary>What should you bring to a consultation?</summary>
          <div>
            <p>Share your main concern, when it started, what affects it, current medicines, and any reports or precautions you have been given.</p>
            <Link href="/services/clinical-assessment-evaluation">See our clinical assessment approach</Link>
          </div>
        </details>
        <details className="journal-detail-card">
          <summary>When should you pause and seek medical advice?</summary>
          <div>
            <p>Pause routine exercise and seek medical advice for sudden severe change, new neurological symptoms, breathing difficulty, chest pain, major injury, or feeling acutely unwell.</p>
            <p>This guide is educational and does not replace diagnosis or urgent care.</p>
          </div>
        </details>
      </div>
    </div>
  );
}

function NutritionContents({ items }: { items: ReadonlyArray<readonly [string, string]> }) {
  return (
    <nav className="nutrition-contents" aria-label="In this guide">
      <p className="nutrition-eyebrow">In this guide</p>
      <ol className="journal-contents-list">
        {items.map(([label, id]) => (
          <li key={id}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function VasculitisNutritionBlocks() {
  return (
    <div className="nutrition-journal-tools not-prose" aria-label="Article guide">
      <section className="nutrition-quick-answer">
        <div>
          <p className="nutrition-eyebrow">Quick answer</p>
          <h2 id="nutrition-guide-answers">Food can support health, not diagnose vasculitis</h2>
        </div>
        <p>
          Skin inflammation has many possible causes. Eat enough, keep food varied, and
          check medicines or supplements with a clinician. Do not delay medical care while
          testing a diet.
        </p>
      </section>

      <NutritionContents items={nutritionContents} />

      <div className="nutrition-tool-grid">
        <details className="nutrition-detail-card">
          <summary>How can lookalike conditions differ?</summary>
          <div>
            <p><strong>Eczema and contact dermatitis:</strong> itch, dryness, scaling, cracking, or oozing may follow an irritant or exposure.</p>
            <p><strong>Hives:</strong> raised itchy areas often move or fade, while painful or bruise-like changes need review.</p>
            <p><strong>Infection or medicine reaction:</strong> warmth, fever, rapid spread, blisters, peeling, mouth or eye involvement need medical attention.</p>
            <p><strong>Vasculitis:</strong> non-blanching spots, ulcers, pain, or organ symptoms require clinical assessment rather than a photo-based label.</p>
          </div>
        </details>
        <details className="nutrition-detail-card">
          <summary>What is a safer nutrition starting point?</summary>
          <div>
            <p>Choose practical meals with protein, fibre, vegetables or fruit, and enough energy. Keep the pattern culturally familiar and compatible with kidney, liver, swallowing, medication, or allergy advice.</p>
            <p>Record timing and symptoms if useful, but treat a food diary as a conversation aid—not proof that a food caused inflammation.</p>
            <Link href="/nutritionist-dietitian-online">Ask about nutritional consultation</Link>
          </div>
        </details>
      </div>

      <section className="nutrition-warning-panel">
        <div className="nutrition-warning-icon" aria-hidden="true">!</div>
        <div>
          <p className="nutrition-eyebrow">Safety first</p>
          <h2>Do not wait for a food experiment</h2>
          <p>Seek urgent medical help for rapidly spreading purpura, dark or blistering skin, severe pain, fever with marked illness, breathing or eye symptoms, new weakness or confusion, severe abdominal pain, blood in stool or urine, or markedly reduced urine.</p>
        </div>
      </section>

      <div className="nutrition-do-dont-grid">
        <section className="nutrition-do-card">
          <p className="nutrition-eyebrow">Do</p>
          <h2>Support the clinical plan</h2>
          <ul>
            <li>Share all medicines, supplements, and herbal products.</li>
            <li>Keep meals adequate and varied unless your clinician advises otherwise.</li>
            <li>Ask which specialist should coordinate the next step.</li>
          </ul>
        </section>
        <section className="nutrition-dont-card">
          <p className="nutrition-eyebrow">Don’t</p>
          <h2>Self-treat a diagnosis</h2>
          <ul>
            <li>Do not stop prescribed medicine or start megadose supplements.</li>
            <li>Do not use broad elimination diets without supervision.</li>
            <li>Do not book routine exercise care instead of urgent assessment.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function StrokeNutritionBlocks() {
  const contents = [
    ["Swallowing safety comes first", "swallowing-safety-comes-first"],
    ["What a balanced plan may include", "what-a-balanced-plan-may-include"],
    ["Medical conditions and medicines change the advice", "medical-conditions-and-medicines-change-the-advice"],
    ["Making meals easier at home", "making-meals-easier-at-home"],
    ["When to seek prompt help", "when-to-seek-prompt-help"],
  ] as const;

  return (
    <div className="nutrition-journal-tools not-prose" aria-label="Article guide">
      <section className="nutrition-quick-answer">
        <div>
          <p className="nutrition-eyebrow">Quick answer</p>
          <h2 id="nutrition-guide-answers">After a stroke, swallowing safety comes before a diet rule</h2>
        </div>
        <p>
          There is no single post-stroke menu, fluid target, calorie target, or food texture
          that is right for everyone. Follow the swallowing and nutrition plan from the
          person’s clinical team, then build familiar meals around it.
        </p>
      </section>

      <NutritionContents items={contents} />

      <div className="nutrition-tool-grid">
        <details className="nutrition-detail-card">
          <summary>Why can swallowing change after stroke?</summary>
          <div>
            <p>
              A stroke can affect the muscles, timing, sensation, attention, or posture
              involved in swallowing. Some people cough or choke; others may have silent
              aspiration without an obvious cough.
            </p>
            <p>
              Ask the treating team what was assessed, what food and drink forms are safe,
              and who to contact if the person’s swallowing changes.
            </p>
          </div>
        </details>
        <details className="nutrition-detail-card">
          <summary>What should families not decide alone?</summary>
          <div>
            <p>
              Do not independently choose thickened fluids, a pureed diet, tube feeding,
              fasting, or high-dose supplements from an online guide. Texture and fluid
              decisions should follow an individual assessment.
            </p>
            <p>
              A swallowing specialist, dietitian, doctor, nurse, or rehabilitation team may
              each have a different part of the plan.
            </p>
          </div>
        </details>
      </div>

      <section className="nutrition-warning-panel">
        <div className="nutrition-warning-icon" aria-hidden="true">!</div>
        <div>
          <p className="nutrition-eyebrow">Safety first</p>
          <h2>Stop and ask for review when meals no longer feel safe</h2>
          <p>
            Coughing or choking during meals, a wet or gurgly voice, food staying in the
            mouth, breathlessness after eating or drinking, repeated chest infections,
            dehydration, or a rapid decline in intake should be discussed promptly with the
            treating team. Severe breathing difficulty or acute neurological change needs
            emergency care.
          </p>
        </div>
      </section>

      <div className="nutrition-do-dont-grid">
        <section className="nutrition-do-card">
          <p className="nutrition-eyebrow">Do</p>
          <h2>Make the clinical plan practical</h2>
          <ul>
            <li>Keep the person positioned and supervised as instructed during meals.</li>
            <li>Use the food and drink consistency recommended after assessment.</li>
            <li>Share medicines, diabetes readings, kidney advice, weight changes, and appetite concerns.</li>
          </ul>
        </section>
        <section className="nutrition-dont-card">
          <p className="nutrition-eyebrow">Don’t</p>
          <h2>Turn a general guide into a prescription</h2>
          <ul>
            <li>Do not assume a cough-free meal proves that swallowing is safe.</li>
            <li>Do not force fluids, food, supplements, or exercises if the person is distressed or unsafe.</li>
            <li>Do not delay medical or swallowing review while testing a new diet.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function FatLossNutritionBlocks() {
  const contents = [
    ["A sustainable pattern beats a quick fix", "a-sustainable-pattern-beats-a-quick-fix"],
    ["A flexible Indian plate", "a-flexible-indian-plate"],
    ["Portions, progress, and plateaus", "portions-progress-and-plateaus"],
    ["Movement, sleep, and rehabilitation", "movement-sleep-and-rehabilitation"],
    ["When to ask for individual help", "when-to-ask-for-individual-help"],
  ] as const;

  return (
    <div className="nutrition-journal-tools not-prose" aria-label="Article guide">
      <section className="nutrition-quick-answer">
        <div>
          <p className="nutrition-eyebrow">Quick answer</p>
          <h2 id="nutrition-guide-answers">Fat loss is usually built from repeatable habits, not one perfect diet</h2>
        </div>
        <p>
          A useful plan fits your health, food access, culture, movement ability, medicines,
          sleep, and daily routine. It should support health even if weight changes slowly
          or not at all.
        </p>
      </section>

      <NutritionContents items={contents} />

      <div className="nutrition-tool-grid">
        <details className="nutrition-detail-card">
          <summary>Do I need to remove rice, roti, or a whole food group?</summary>
          <div>
            <p>
              Not automatically. Rice, roti, dosa, idli, poha, millets, potatoes, and other
              staple foods can fit different patterns. The useful question is how the whole
              meal, portion, preparation, and repeatable routine fit your goals and health.
            </p>
            <p>
              Broad elimination plans, detoxes, and very restrictive fasts can reduce
              nutrition and are not a universal solution.
            </p>
          </div>
        </details>
        <details className="nutrition-detail-card">
          <summary>Can physiotherapy make me lose weight?</summary>
          <div>
            <p>
              Physiotherapy may support function, mobility, strength, confidence, and
              participation. It is not a promise of fat loss and should not replace nutrition,
              medical, or weight-management care.
            </p>
            <p>
              Activity should be increased around ability, pain, disability, rehabilitation
              status, and medical advice.
            </p>
          </div>
        </details>
      </div>

      <section className="nutrition-warning-panel">
        <div className="nutrition-warning-icon" aria-hidden="true">!</div>
        <div>
          <p className="nutrition-eyebrow">Safety first</p>
          <h2>Rapid change is not the same as healthy progress</h2>
          <p>
            Seek individual advice for unexplained weight loss, fainting, repeated vomiting,
            severe weakness, eating-disorder concerns, pregnancy, a recent operation, or
            significant kidney, liver, heart, diabetes, or medication-related issues. New
            chest pain, severe breathlessness, or an acute neurological symptom needs urgent
            medical care.
          </p>
        </div>
      </section>

      <div className="nutrition-do-dont-grid">
        <section className="nutrition-do-card">
          <p className="nutrition-eyebrow">Do</p>
          <h2>Build a pattern you can repeat</h2>
          <ul>
            <li>Keep meals varied and include filling foods that suit your household.</li>
            <li>Notice portions, drinks, fried or packaged foods, sleep, movement, and stress without moralising them.</li>
            <li>Review the plan when progress plateaus instead of starting a harsher diet.</li>
          </ul>
        </section>
        <section className="nutrition-dont-card">
          <p className="nutrition-eyebrow">Don’t</p>
          <h2>Chase no fixed number</h2>
          <ul>
            <li>Do not promise a weekly weight-loss rate or a specific body shape.</li>
            <li>Do not assign calorie, protein, or exercise targets without individual context.</li>
            <li>Do not stop prescribed medicines or blame yourself when weight is affected by illness or treatment.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function NutritionArticleBlocks({ post }: { post: BlogPost }) {
  if (post.slug === "diet-requirements-after-stroke") return <StrokeNutritionBlocks />;
  if (post.slug === "diet-and-fat-loss") return <FatLossNutritionBlocks />;
  return <VasculitisNutritionBlocks />;
}

function NutritionPhysiotherapyBoundary({ post }: { post: BlogPost }) {
  const isStroke = post.slug === "diet-requirements-after-stroke";
  const isFatLoss = post.slug === "diet-and-fat-loss";

  if (isStroke) {
    return (
      <section className="nutrition-physio-boundary not-prose" aria-labelledby="nutrition-physio-heading">
        <p className="nutrition-eyebrow">Where rehabilitation fits</p>
        <h2 id="nutrition-physio-heading">Physiotherapy supports function alongside the swallowing and nutrition plan</h2>
        <p>
          After the medical team has set the person’s precautions, physiotherapy may support
          sitting balance, transfers, walking, arm use, fatigue management, and everyday
          participation. Swallowing assessment, food texture, fluid thickness, and nutrition
          prescriptions remain with the appropriate clinical team.
        </p>
        <p>
          Homecare can make practice relevant to the person’s kitchen, bathroom, stairs, and
          caregiver routine. It does not replace urgent medical review or a swallowing
          assessment.
        </p>
      </section>
    );
  }

  if (isFatLoss) {
    return (
      <section className="nutrition-physio-boundary not-prose" aria-labelledby="nutrition-physio-heading">
        <p className="nutrition-eyebrow">Where rehabilitation fits</p>
        <h2 id="nutrition-physio-heading">Physiotherapy can make movement more achievable, not promise fat loss</h2>
        <p>
          A physiotherapist may help with pain, strength, balance, mobility, confidence,
          pacing, and a gradual return to meaningful activity. The plan should reflect
          disability, current fitness, medical conditions, and the person’s own goals.
        </p>
        <p>
          Physiotherapy does not replace a doctor, registered dietitian, or weight-management
          service when medicines, metabolic conditions, eating concerns, or unexplained
          weight change need individual review.
        </p>
      </section>
    );
  }

  return (
    <section className="nutrition-physio-boundary not-prose" aria-labelledby="nutrition-physio-heading">
      <p className="nutrition-eyebrow">Where physiotherapy fits</p>
      <h2 id="nutrition-physio-heading">Rehabilitation supports function alongside nutrition care</h2>
      <p>
        Once the medical team has clarified the condition and precautions, physiotherapy may support
        sitting balance, transfers, walking, strength, meal preparation, daily activity, pacing,
        and a gradual return to routine.
      </p>
      <p>
        Physiotherapy does not prescribe food, fluid, supplements, or medicines and does not replace
        medical, nutrition, swallowing, or urgent care. Individual restrictions remain with the
        responsible clinical team.
      </p>
    </section>
  );
}

function getArticlePathways(post: BlogPost): ArticlePathway[] {
  const citySlug = (post as BlogPost & { citySlug?: string }).citySlug;
  const city = citySlug ? getCityBySlug(citySlug) : undefined;
  const locationPathway: ArticlePathway = city
    ? {
        href: `/physiotherapist-at-home/${city.slug}`,
        label: `Home physiotherapy in ${city.slug === "gurgaon" ? "Gurugram (Gurgaon)" : city.name}`,
      }
    : {
        href: "/cities",
        label: "Browse all 45 listed cities for home physiotherapy",
      };

  return hasAuthoredMarkdownLink(post.content, locationPathway.href) ? [] : [locationPathway];
}

function hasAuthoredMarkdownLink(content: string, href: string): boolean {
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\[[^\\]]+\\]\\(${escapedHref}\\/?(?:[?#][^)]*)?\\)`).test(content);
}

function getArticleServiceContextualLink(post: BlogPost) {
  const contextualLink = getArticleServiceLink(post);
  const articleText = `${post.slug} ${post.title} ${post.category}`.toLowerCase();
  const topicPathway =
    focusedArticlePathways[post.slug] ??
    categoryPathways.find(({ match }) => match.some((term) => articleText.includes(term)))?.pathway;

  if (!topicPathway || topicPathway.href === contextualLink.href) return contextualLink;

  return {
    ...contextualLink,
    href: topicPathway.href,
    label: topicPathway.label,
    description: `Review assessment and care options relevant to “${post.title}.”`,
  };
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug ?? "";
  const summary = blogIndex.find((candidate) => candidate.slug === slug);
  const [post, setPost] = useState<BlogPost | null>(() => getRuntimeBlogPost(slug) ?? null);

  useEffect(() => {
    const bootstrappedPost = getRuntimeBlogPost(slug);
    if (bootstrappedPost) {
      setPost(bootstrappedPost);
      return;
    }
    if (!summary) return;

    let cancelled = false;
    void import("@/lib/data").then(({ blogPosts }) => {
      if (!cancelled) {
        setPost(blogPosts.find((candidate) => candidate.slug === slug) ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug, summary]);

  if (!summary) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">The article you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="rounded-full">
          <Link href="/blog">Back to Journal</Link>
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4" aria-busy="true">
        <p className="text-muted-foreground">Loading this Journal article…</p>
      </div>
    );
  }

  const relatedPosts = getRelatedJournalPosts(post, journalDiscoveryIndex);
  const recentPosts = [...relatedPosts, ...journalDiscoveryIndex]
    .filter((p, index, posts) => p.id !== post.id && posts.findIndex((candidate) => candidate.id === p.id) === index)
    .sort((a, b) => {
      const aIsRelated = a.category === post.category;
      const bIsRelated = b.category === post.category;
      if (aIsRelated !== bIsRelated) return aIsRelated ? -1 : 1;
      return b.isoDate.localeCompare(a.isoDate);
    })
    .slice(0, 3);
  const categories = Array.from(new Set(journalDiscoveryIndex.map((p) => p.category)));
  const articlePathways = getArticlePathways(post);
  const articleServiceLink = getArticleServiceContextualLink(post);
  const isNutritionArticle = post.presentation === "nutrition-guidance";
  const isSpecialNutritionArticle = [
    "skin-inflammation-vasculitis-diet-guide",
    "diet-requirements-after-stroke",
    "diet-and-fat-loss",
  ].includes(post.slug);
  const isLumbarArticle = post.slug === "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1";
  const authorProfile = getBlogAuthorProfile(post);
  const articleBlocks = parseArticleBlocks(post.content);
  const articleHeadings = articleBlocks
    .filter((block): block is Extract<typeof block, { type: "heading" }> => block.type === "heading" && block.level === 2)
    .map((block) => ({ text: block.text, id: headingId(block.text) }));
  const articleSections: Array<{
    heading?: Extract<ArticleBlock, { type: "heading" }>;
    number?: number;
    blocks: ArticleBlock[];
  }> = [];
  let sectionNumber = 0;
  for (const block of articleBlocks) {
    if (block.type === "heading" && block.level === 2) {
      sectionNumber += 1;
      articleSections.push({ heading: block, number: sectionNumber, blocks: [] });
      continue;
    }

    const currentSection = articleSections.at(-1);
    if (currentSection) {
      currentSection.blocks.push(block);
    } else {
      articleSections.push({ blocks: [block] });
    }
  }
  const journalTheme = getJournalTheme(post);

  function slugifyCategory(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function renderInlineMarkdown(text: string) {
    return parseInlineMarkdown(text).map((token, index) => {
      if (token.type === "link") {
        return (
          <Link key={index} href={token.href} className="text-primary underline hover:text-primary/80">
            {token.label}
          </Link>
        );
      }
      if (token.type === "strong") return <strong key={index}>{token.value}</strong>;
      if (token.type === "emphasis") return <em key={index}>{token.value}</em>;
      return <span key={index}>{token.value}</span>;
    });
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <Helmet>
        <meta name="author" content={authorProfile.name} />
        <meta name="reviewed-by" content={BLOG_REVIEWER_PROFILE.name} />
      </Helmet>
      {/* Article Header */}
      <div className={`journal-article-header ${journalTheme.className}`}>
        <div className="container mx-auto px-4 md:px-6 journal-article-header-inner">
          <motion.div 
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="journal-article-header-copy"
          >
            <Link href="/blog" className="journal-back-link">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Link>
            
            <div className="journal-header-meta">
              <span className="journal-category-pill">
                {post.category}
              </span>
              <span className="journal-header-kicker">
                <Stethoscope aria-hidden="true" className="h-4 w-4" />
                {journalTheme.kicker}
              </span>
            </div>

            <h1 className="journal-article-title">
              {getBlogArticleTitle(post)}
            </h1>

             <div className="journal-article-byline">
               <ContentAttribution
                 authorProfile={authorProfile}
                 testId="article"
                 showCredentials
               />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                 <span>
                      Publication date:{" "}
                   <time
                     dateTime={post.isoDate}
                     itemProp="datePublished"
                     aria-label={`Published on ${post.date}`}
                        className="journal-article-publication-date"
                        data-testid="article-publication-date"
                   >
                     {post.date}
                   </time>
                 </span>
              </div>
            </div>

            <p className="journal-header-disclosure">
              {isNutritionArticle
                 ? post.slug === "diet-requirements-after-stroke"
                   ? "Educational information only. This guide does not assess swallowing or prescribe a post-stroke diet, and it does not replace medical, nutrition, speech and swallowing, or physiotherapy care."
                   : post.slug === "diet-and-fat-loss"
                     ? "Educational information only. This guide does not prescribe a weight-loss plan or promise fat loss, and it does not replace medical, nutrition, or physiotherapy care."
                 : "Educational information only. This guide does not prescribe an individual diet or replace medical, nutrition, swallowing, or physiotherapy care."
                : "Educational information only. This journal does not diagnose conditions or replace advice from your doctor, surgeon, or treating physiotherapist. Individual rehabilitation plans and outcomes vary."}
            </p>

            <Button
              asChild
              variant="booking"
              className="rounded-full whitespace-nowrap"
            >
              <Link
              href="/booking"
              className="journal-header-booking"
              data-cta="article-header-booking"
              onClick={() =>
                trackEvent("article_booking_cta_click", {
                  route: "blog-post",
                  article: post.slug,
                  placement: "article-header",
                })
              }
            >
                Book a consultation
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <div className="journal-article-header-art" aria-label={journalTheme.imageAlt}>
            <picture className="block h-full w-full">
              <source
                type="image/webp"
                srcSet={getJournalWebpImagePath(post.slug, post.image)}
              />
              <img
                src={getJournalImagePath(post.slug, post.image)}
                alt={journalTheme.imageAlt}
                width="900"
                height="540"
                fetchPriority="high"
              />
            </picture>
            <div className="journal-article-header-caption">
              <span>Journal visual</span>
              <strong>
                {isLumbarArticle
                  ? "Understand the pattern before choosing the next step"
                  : isNutritionArticle
                     ? "Nutrition can support recovery without replacing clinical assessment"
                    : "Practical guidance for a safer next step"}
              </strong>
              <small>{journalTheme.imageCaption}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="container mx-auto px-4 md:px-6 mt-16">
        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
          
          {/* Article Body */}
          <motion.article 
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:w-2/3 journal-prose"
          >
            {isSpecialNutritionArticle ? (
              <NutritionArticleBlocks post={post} />
            ) : (
              <GeneralArticleBlocks
                post={post}
                headings={articleHeadings}
                articlePathways={articlePathways}
              />
            )}
            <div className="journal-article-sections">
              {articleSections.map((section, sectionIndex) => {
                const isIntroduction = !section.heading;
                const headingTarget = section.heading ? headingId(section.heading.text) : undefined;
                return (
                  <section
                    key={headingTarget ?? `intro-${sectionIndex}`}
                    className={isIntroduction ? "journal-article-intro" : "journal-article-section"}
                    aria-labelledby={headingTarget}
                  >
                    {section.heading && (
                      <h2 id={headingTarget} className="journal-section-heading">
                        <span className="journal-section-number" aria-hidden="true">
                          {String(section.number).padStart(2, "0")}
                        </span>
                        <span>{renderInlineMarkdown(section.heading.text)}</span>
                      </h2>
                    )}
                    {section.blocks.map((block, blockIndex) => {
                      if (block.type === "heading") {
                        return (
                          <h3 key={`${sectionIndex}-${blockIndex}`} id={headingId(block.text)}>
                            {renderInlineMarkdown(block.text)}
                          </h3>
                        );
                      }
                      if (block.type === "list") {
                        const List = block.ordered ? "ol" : "ul";
                        return (
                          <List
                            key={`${sectionIndex}-${blockIndex}`}
                            className={`journal-structured-list ${
                              block.ordered ? "journal-ordered-list" : "journal-unordered-list"
                            }`}
                          >
                            {block.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
                            ))}
                          </List>
                        );
                      }
                      return (
                        <p
                          key={`${sectionIndex}-${blockIndex}`}
                          className={isIntroduction && blockIndex === 0 ? "journal-lede" : undefined}
                        >
                          {renderInlineMarkdown(block.text)}
                        </p>
                      );
                    })}
                  </section>
                );
              })}
            </div>

             {articlePathways.length > 0 && (
               <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
                  Local coverage:{" "}
                 {articlePathways.map((pathway, pathwayIndex) => (
                   <span key={pathway.href}>
                     {pathwayIndex > 0 ? " and " : ""}
                     <Link
                       href={pathway.href}
                       className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
                     >
                       {pathway.label}
                     </Link>
                   </span>
                 ))}
                 .
               </p>
             )}

             {focusedJournalLinks[post.slug] && (
               <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                 Continue with{" "}
                 {focusedJournalLinks[post.slug].map((pathway, pathwayIndex) => (
                   <span key={pathway.href}>
                     {pathwayIndex > 0 ? " or " : ""}
                     <Link
                       href={pathway.href}
                       className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
                     >
                       {pathway.label}
                     </Link>
                   </span>
                 ))}
                 .
               </p>
             )}

            {isNutritionArticle && <NutritionPhysiotherapyBoundary post={post} />}

             {post.sources && post.sources.length > 0 && (
               <section
                 aria-labelledby="article-sources-heading"
                 className="mt-12 rounded-2xl border border-border bg-accent/10 p-6 sm:p-8 not-prose"
               >
                 <h2
                   id="article-sources-heading"
                   className="font-serif text-2xl font-bold text-foreground mb-2"
                 >
                   Clinical sources &amp; further reading
                 </h2>
                 <p className="text-sm leading-relaxed text-muted-foreground mb-5">
                   These public resources provide general clinical guidance. They do not replace an
                   assessment or an individual treatment plan.
                 </p>
                 <ul className="space-y-3">
                   {post.sources.map((source) => (
                     <li key={source.url}>
                          <a
                         href={source.url}
                         target="_blank"
                         rel="noopener noreferrer"
                            onClick={() =>
                              trackEvent("article_source_click", {
                                route: "blog-post",
                                article: post.slug,
                                source: source.publisher,
                              })
                            }
                         className="group inline-flex items-start gap-2 text-sm leading-relaxed text-primary underline decoration-primary/40 underline-offset-4 hover:text-primary/80"
                       >
                         <span>
                           <span className="font-semibold">{source.title}</span>
                           <span className="block text-muted-foreground no-underline">
                             {source.publisher}
                           </span>
                         </span>
                         <ExternalLink
                           aria-hidden="true"
                           className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                         />
                       </a>
                     </li>
                   ))}
                 </ul>
               </section>
             )}

            <ContextualLinks
              relatedPosts={relatedPosts}
              serviceLink={
                hasAuthoredMarkdownLink(post.content, articleServiceLink.href)
                  ? undefined
                  : articleServiceLink
              }
              sourceRoute={`/blog/${post.slug}`}
              testId="article-contextual-links"
            />

            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-accent/10 p-8 rounded-2xl">
              <div>
                <h3 className="font-serif font-bold text-xl m-0 text-foreground">Need professional advice?</h3>
                <p className="text-sm mt-1 m-0 text-muted-foreground">Book an assessment with our expert team.</p>
              </div>
              <Button
                asChild
                variant="booking"
                className="rounded-full whitespace-nowrap"
              >
                <Link
                 href="/booking"
                 onClick={() =>
                   trackEvent("article_booking_cta_click", {
                     route: "blog-post",
                     article: post.slug,
                     placement: "article-footer",
                   })
                 }
               >
                  Book a consultation
                </Link>
              </Button>
            </div>
          </motion.article>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
            <div>
                <h2 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                About the Author
                </h2>
              <div className="bg-accent/20 p-6 rounded-2xl border border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-2xl font-bold mb-4">
                  {authorProfile.name.charAt(0)}
                </div>
                <h3 className="font-bold text-foreground mb-2">{authorProfile.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {authorProfile.bio} Goswami Rehab serves patients across India, including Delhi NCR.
                </p>
                 <Link
                   href="/about"
                   className="inline-flex mt-4 text-sm font-semibold text-primary hover:underline"
                   onClick={() =>
                     trackEvent("article_author_profile_click", {
                       route: "blog-post",
                       article: post.slug,
                       placement: "sidebar",
                     })
                   }
                 >
                  Read the full profile
                </Link>
              </div>
            </div>

            <div>
                <h2 className="font-serif font-bold text-xl mb-6">Recent Articles</h2>
              <div className="space-y-6">
                {recentPosts.map((recent) => (
                  <Link
                    key={recent.id}
                    href={`/blog/${recent.slug}`}
                    className="group block"
                    onClick={() =>
                      trackEvent("article_related_click", {
                        route: "blog-post",
                        article: post.slug,
                        related_article: recent.slug,
                      })
                    }
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-20 h-20 bg-accent rounded-xl flex-shrink-0 group-hover:opacity-80 transition-opacity" />
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-snug mb-2">
                          {recent.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">{recent.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
                <h2 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Categories
                </h2>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/blog/category/${slugifyCategory(cat)}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors border border-transparent hover:border-border"
                  >
                    <span className="text-sm font-medium">{cat}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}