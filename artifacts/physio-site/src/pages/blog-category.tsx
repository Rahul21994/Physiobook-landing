import "@/journal.css";
import { useParams, Link } from "wouter";
import { motion } from "@/lib/motion";
import { journalDiscoveryIndex as blogPosts } from "@/lib/blog-index";
import { ArrowLeft, ArrowRight, BookOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentAttribution } from "@/components/ContentAttribution";
import { ContextualLinks } from "@/components/ContextualLinks";
import { getArticleServiceLink } from "@/lib/contextual-links";

function slugifyCategory(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Inline styles — Tailwind purges dynamic class strings assembled at runtime.
const categoryStyle: Record<string, { coverClass: string; iconClass: string }> = {
  "Neuro Rehabilitation":           { coverClass: "journal-category-cover-neuro", iconClass: "journal-category-icon-neuro" },
  "Ortho Rehabilitation":           { coverClass: "journal-category-cover-ortho", iconClass: "journal-category-icon-ortho" },
  "Occupational Therapy":           { coverClass: "journal-category-cover-occupation", iconClass: "journal-category-icon-occupation" },
  "Cardiopulmonary Rehabilitation": { coverClass: "journal-category-cover-cardio", iconClass: "journal-category-icon-cardio" },
  "Pulmonary Rehabilitation":       { coverClass: "journal-category-cover-pulmonary", iconClass: "journal-category-icon-pulmonary" },
  "Homecare Guide":                 { coverClass: "journal-category-cover-home", iconClass: "journal-category-icon-home" },
  "City Guide":                     { coverClass: "journal-category-cover-city", iconClass: "journal-category-icon-city" },
};
const defaultStyle = { coverClass: "journal-category-cover-default", iconClass: "journal-category-icon-default" };
const categoryCopy: Record<string, { intro: string; practical: string; topics: string[] }> = {
  "Neuro Rehabilitation": {
    intro: "Neurological rehabilitation is usually built around repeated practice, safe movement, and meaningful daily goals. These guides explain how physiotherapy can support people living with stroke, Parkinson’s disease, brain injury, and other neurological conditions at home.",
    practical: "Use these articles to understand assessment, positioning, transfers, balance, walking practice, fatigue, and family-supported exercise. They are general education rather than a diagnosis; a physiotherapist should adapt any programme to the person’s medical history, current ability, home environment, and safety needs.",
    topics: ["Stroke and Parkinson’s movement support", "Balance, gait, and transfer practice", "Family guidance for safe home rehabilitation"],
  },
  "Ortho Rehabilitation": {
    intro: "Orthopaedic rehabilitation guides cover the practical side of recovering movement after injury, surgery, or persistent pain. They explain how physiotherapy may progress from symptom-aware mobility to strength, balance, and confident everyday function.",
    practical: "Read these articles for general information about knee and hip replacement recovery, shoulder and ankle injuries, back pain, fractures, and osteoarthritis. Recovery varies between people, so exercise choice, loading, and timelines should be reviewed with an appropriately qualified clinician.",
    topics: ["Post-surgery mobility and strengthening", "Pain-aware exercise and pacing", "Return to walking, work, and activity"],
  },
  "Occupational Therapy": {
    intro: "Occupational therapy and functional rehabilitation focus on helping a person participate in everyday life. These guides connect movement practice with dressing, bathing, cooking, work, communication with carers, and other tasks that make independence meaningful.",
    practical: "The information is intended to help families ask useful questions and prepare for an assessment. A clinician can identify barriers in the home, suggest graded practice, and coordinate equipment or support when needed rather than relying on a generic exercise list.",
    topics: ["Daily-living skills and independence", "Home routines and caregiver support", "Task-focused practice after illness or injury"],
  },
  "Cardiopulmonary Rehabilitation": {
    intro: "Cardiopulmonary rehabilitation combines safe activity, breathing control, pacing, and monitoring for people whose heart or lung condition limits daily function. These guides explain the role of rehabilitation after cardiac events, surgery, hospitalisation, or reduced exercise tolerance.",
    practical: "Use them to learn what an assessment may consider, how activity can be graded, and why warning symptoms matter. The advice is educational and does not replace medical clearance or a personalised plan, especially for people with new breathlessness, chest symptoms, dizziness, or unstable health.",
    topics: ["Breathing control and energy conservation", "Gradual endurance and strength work", "Safety checks before increasing activity"],
  },
  "Pulmonary Rehabilitation": {
    intro: "Pulmonary rehabilitation supports people who feel breathless, deconditioned, or limited by a respiratory condition. The journal explains how physiotherapy may combine breathing strategies, pacing, posture, mobility, and carefully graded exercise.",
    practical: "These articles can help patients and families understand the purpose of a pulmonary assessment and the importance of monitoring symptoms. They are not a substitute for a doctor’s advice; new or worsening breathing difficulty requires appropriate medical attention before exercise is increased.",
    topics: ["Breathing exercises and pacing", "Activity planning around fatigue", "Safe progression for everyday mobility"],
  },
  "Homecare Guide": {
    intro: "Homecare physiotherapy works best when the plan fits the person’s space, routine, support network, and recovery goals. These guides explain how to choose a service, prepare for an assessment, communicate concerns, and practise safely between visits.",
    practical: "Read them before booking to understand what a home session may include, how online consultation differs, and why confirmation of availability matters. Goswami Rehab confirms the appropriate professional, scope, price, and appointment details before care begins.",
    topics: ["Preparing for a home assessment", "Home visits versus online consultation", "Questions to ask before starting care"],
  },
  "Nutrition & Clinical Guidance": {
    intro: "Nutrition affects energy, hydration, healing, daily function, and how confidently a person can take part in recovery. These guides use familiar Indian household foods and plain clinical language to explain what general nutrition guidance can and cannot answer.",
    practical: "Read them for safer questions about eating after stroke, swallowing concerns, weight change, fat loss, supplements, medicines, diabetes, kidney disease, and rehabilitation. The articles do not prescribe one menu, calorie target, texture, fluid amount, or exercise programme. Individual advice may need a doctor, dietitian, swallowing specialist, pharmacist, or physiotherapist.",
    topics: ["Swallowing, hydration, and nutrition after stroke", "Indian household food patterns and flexible fat loss", "Medicines, kidney disease, diabetes, and safety boundaries"],
  },
  "City Guide": {
    intro: "The city guides explain how home physiotherapy can be coordinated when travelling to a clinic is difficult. Each article highlights common rehabilitation needs, what families can expect from an initial conversation, and how to request local availability.",
    practical: "Coverage depends on the city, locality, professional availability, and the type of care needed. Use the location pages to review the areas served, then send an online booking request so the team can confirm the right next step within 24 hours.",
    topics: ["Home physiotherapy by city", "Local availability and booking steps", "Stroke, surgery, and complex-case support"],
  },
  "Functional Rehabilitation": {
    intro: "Functional rehabilitation connects physiotherapy with the activities that matter in everyday life: getting out of a chair, walking across a room, using stairs, reaching, carrying, and returning to work or hobbies. These guides explain how movement practice can be shaped around real tasks rather than isolated exercises.",
    practical: "Read these articles to understand goal setting, graded activity, balance, strength, pacing, and confidence after illness or injury. The right starting point depends on assessment findings, symptoms, medical advice, and the support available at home. A clinician can adapt the plan as ability changes.",
    topics: ["Task-focused movement practice", "Strength, balance, and confidence", "Goals for everyday independence"],
  },
  "Sports Rehabilitation": {
    intro: "Sports rehabilitation guides cover the measured return to running, cycling, training, and competition after injury. They describe how physiotherapy can review movement, strength, workload, symptoms, and sport-specific demands before activity is increased.",
    practical: "Use these articles for general planning ideas such as progressive loading, warm-ups, recovery, balance, and return-to-sport criteria. A calendar alone cannot determine readiness, and a persistent or worsening symptom deserves assessment. Training should be adjusted to the person, the injury, and the demands of the activity.",
    topics: ["Progressive loading after injury", "Running and cycling return plans", "Strength and movement checks"],
  },
  "Women's Health": {
    intro: "Women’s health physiotherapy may address movement and function during pregnancy, after childbirth, and across changes that affect the pelvic floor, abdomen, spine, or daily activity. These guides offer practical education while recognising that symptoms and recovery needs are individual.",
    practical: "Articles can help readers prepare for questions about pain, continence, pelvic pressure, breathing, lifting, exercise, and return to valued activities. A qualified clinician can assess the person’s history and choose appropriate, respectful care. New, severe, or unexplained symptoms should be medically reviewed.",
    topics: ["Pelvic-floor and core support", "Pregnancy and postnatal movement", "Safe return to exercise"],
  },
  "Orthopaedic Rehabilitation": {
    intro: "Orthopaedic rehabilitation helps people rebuild movement and confidence after musculoskeletal injury, surgery, or a period of reduced activity. These guides explain how physiotherapy may combine symptom-aware mobility, strength, balance, and practice of the tasks a person needs at home.",
    practical: "The articles are general education about assessment, pacing, joint protection, walking, lifting, and gradual loading. Recovery timelines vary with the diagnosis, procedure, healing, medication, and medical instructions. A physiotherapist should adapt exercise selection and progression after reviewing the individual.",
    topics: ["Recovery after injury or surgery", "Mobility and progressive strengthening", "Pacing everyday activity"],
  },
  "Paediatric Rehabilitation": {
    intro: "Paediatric rehabilitation supports children whose movement, strength, coordination, balance, or participation needs extra attention. These guides focus on practical, age-appropriate activity and the role of families, schools, carers, and clinicians in making goals meaningful.",
    practical: "Use the articles as a starting point for conversations, not as a substitute for a child-specific assessment. A clinician can consider development, communication, sensory needs, fatigue, equipment, positioning, and the child’s interests while working with the wider care team. Plans should be safe, encouraging, and reviewed regularly.",
    topics: ["Play-based movement goals", "Family and school participation", "Development-aware support"],
  },
};

export default function BlogCategory() {
  const params = useParams<{ name: string }>();
  const slug = params.name ?? "";

  // Reverse-lookup the exact category name from its slug
  const allCategories = Array.from(new Set(blogPosts.map((p) => p.category)));
  const category = allCategories.find((c) => slugifyCategory(c) === slug);
  const posts = category ? blogPosts.filter((p) => p.category === category) : [];

  if (!category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          This category doesn't exist or has been renamed.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/blog">Back to Journal</Link>
        </Button>
      </div>
    );
  }

  const style = categoryStyle[category] ?? defaultStyle;

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <Link
            href="/blog"
            className="inline-flex items-center text-foreground hover:text-primary transition-colors font-medium mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>

          <motion.div
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-primary font-medium mb-4"
          >
            <Tag className="w-5 h-5" />
            <span>Category</span>
          </motion.div>

          <motion.h1
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4"
          >
            {category}
          </motion.h1>

          <motion.p
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {posts.length} article{posts.length !== 1 ? "s" : ""} from our specialist team
          </motion.p>
          <ContentAttribution testId="category-attribution" className="mt-5" />
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>{categoryCopy[category]?.intro}</p>
            <p>{categoryCopy[category]?.practical}</p>
          </div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-3">
            {(categoryCopy[category]?.topics ?? []).map((topic) => (
              <li key={topic} className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                {topic}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            When reading a guide, note the questions you would like to discuss with a
            clinician and avoid increasing exercise suddenly because an article sounds
            encouraging. For a home visit, keep a clear area for movement and share
            relevant medical information. For online care, use a private, well-lit
            space and have any reports or medication details nearby. Stop and seek
            appropriate medical advice for new, severe, or unexplained symptoms.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The journal is written for patients, families, and caregivers who want a
            clearer starting point before they book. Bring the guide’s questions to an
            assessment, and tell the clinician what feels difficult in real life so
            the plan can focus on useful, safe progress.
          </p>
        </div>

        {/* Article grid */}
        <motion.div
          suppressHydrationWarning
          initial={false}
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div
              suppressHydrationWarning
              key={post.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="group flex flex-col h-full bg-background rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                {/* Coloured cover */}
                <div
                  className={`w-full h-44 flex-shrink-0 flex items-center justify-center overflow-hidden ${style.coverClass}`}
                >
                  <BookOpen
                    className={`w-14 h-14 opacity-40 ${style.iconClass}`}
                  />
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                      {post.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground mb-6 flex-1 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                    <span className="text-sm font-medium text-foreground">{post.author}</span>
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <ContextualLinks
          relatedPosts={posts.slice(0, 1)}
          serviceLink={posts[0] ? getArticleServiceLink(posts[0]) : undefined}
          title="Find the right next step"
          intro="Start with one focused guide, then compare the related care option or send a booking request when you are ready."
          sourceRoute={`/blog/category/${slug}`}
          testId="category-contextual-links"
        />

        {/* All categories row */}
        <div className="mt-20 pt-12 border-t border-border">
          <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Other Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {allCategories
              .filter((c) => c !== category)
              .map((c) => (
                <Link
                  key={c}
                  href={`/blog/category/${slugifyCategory(c)}`}
                  className="px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors"
                >
                  {c}
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
