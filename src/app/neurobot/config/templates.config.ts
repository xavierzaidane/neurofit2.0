import { TemplateConfig } from "../types";

export const templatesConfig: TemplateConfig[] = [
  // Writing
  {
    id: "rewrite-msg",
    category: "Writing",
    title: "Rewrite my message",
    icon: "Pencil",
    promptBody: "Please rewrite the following message to make it more [Tone (e.g. professional, friendly, persuasive, concise)]:\n\n\"[Insert your draft message here]\"",
    placeholders: ["Tone", "Insert your draft message here"]
  },
  {
    id: "translate-text",
    category: "Writing",
    title: "Translate text",
    icon: "Languages",
    promptBody: "Translate the following text into [Target Language]:\n\n\"[Text to translate]\"",
    placeholders: ["Target Language", "Text to translate"]
  },
  {
    id: "summarize-text",
    category: "Writing",
    title: "Summarize text",
    icon: "FileText",
    promptBody: "Summarize this text in [Format (e.g. 3 bullet points, a single paragraph, key takeaways)]:\n\n\"[Paste text here]\"",
    placeholders: ["Format", "Paste text here"]
  },
  {
    id: "fix-grammar",
    category: "Writing",
    title: "Fix grammar & tone",
    icon: "SpellCheck",
    promptBody: "Correct all spelling and grammar mistakes in the text below, and adjust the tone to sound [Desired Tone]:\n\n\"[Paste text here]\"",
    placeholders: ["Desired Tone", "Paste text here"]
  },
  {
    id: "continue-writing",
    category: "Writing",
    title: "Continue writing",
    icon: "Activity",
    promptBody: "Continue writing the next paragraphs for this draft, matching the style, vocabulary, and tone:\n\n\"[Your draft writing]\"",
    placeholders: ["Your draft writing"]
  },

  // Professional
  {
    id: "draft-email",
    category: "Professional",
    title: "Draft an email",
    icon: "Mail",
    promptBody: "Write a professional email to [Recipient (e.g. client, boss, team)] regarding [Subject/Purpose]. Make sure to cover the following key points:\n- [Key point 1]\n- [Key point 2]\n\nInclude a polite greeting and sign-off.",
    placeholders: ["Recipient", "Subject/Purpose", "Key point 1", "Key point 2"]
  },
  {
    id: "meeting-agenda",
    category: "Professional",
    title: "Write a meeting agenda",
    icon: "Calendar",
    promptBody: "Create a detailed meeting agenda for a [Duration (e.g. 30-minute, 1-hour)] meeting on the topic of '[Meeting Topic]'. Include time allocations for each section and objectives.",
    placeholders: ["Duration", "Meeting Topic"]
  },
  {
    id: "project-update",
    category: "Professional",
    title: "Create a project update",
    icon: "ClipboardList",
    promptBody: "Draft a concise project status update for '[Project Name]'. Outline what was accomplished this week, current blockers, and key goals for next week:\n\nProgress:\nBlockers:\nNext steps:",
    placeholders: ["Project Name"]
  },
  {
    id: "job-desc",
    category: "Professional",
    title: "Write a job description",
    icon: "UserPlus",
    promptBody: "Write an appealing job description for the role of '[Job Title]'. Include the company overview, core responsibilities, key requirements/qualifications, and benefits.",
    placeholders: ["Job Title"]
  },

  // Social
  {
    id: "write-caption",
    category: "Social",
    title: "Write a caption",
    icon: "Instagram",
    promptBody: "Create 3 variations of engaging captions (with hashtags) for a social media post about [Topic/Event] aimed at [Target Audience]. Tone should be [Tone].",
    placeholders: ["Topic/Event", "Target Audience", "Tone"]
  },
  {
    id: "birthday-msg",
    category: "Social",
    title: "Draft a birthday message",
    icon: "Gift",
    promptBody: "Draft a warm, [Tone (e.g. funny, heartfelt, short)] birthday message for my [Relationship (e.g. friend, colleague, sibling)] named [Name].",
    placeholders: ["Tone", "Relationship", "Name"]
  },
  {
    id: "reply-comment",
    category: "Social",
    title: "Reply to a comment",
    icon: "MessageSquare",
    promptBody: "Draft a polite and engaging response to this comment on my post about [Post Topic]:\n\nComment: \"[Paste comment here]\"",
    placeholders: ["Post Topic", "Paste comment here"]
  },
  {
    id: "announcement-post",
    category: "Social",
    title: "Write an announcement",
    icon: "Megaphone",
    promptBody: "Write a community announcement message about [What is being announced]. Explain why it matters and what actions members should take next.",
    placeholders: ["What is being announced"]
  },

  // Utility
  {
    id: "explain-code",
    category: "Utility",
    title: "Explain this code",
    icon: "Code",
    promptBody: "Explain how this code works in plain English, highlighting any potential bugs or performance bottlenecks:\n\n```[Language]\n[Insert your code here]\n```",
    placeholders: ["Language", "Insert your code here"]
  },
  {
    id: "convert-format",
    category: "Utility",
    title: "Convert data format",
    icon: "RefreshCw",
    promptBody: "Convert the following data from [Source Format (e.g. CSV, JSON, XML)] to [Target Format]:\n\n```\n[Insert source data here]\n```",
    placeholders: ["Source Format", "Target Format", "Insert source data here"]
  },
  {
    id: "brainstorm-ideas",
    category: "Utility",
    title: "Brainstorm ideas",
    icon: "Lightbulb",
    promptBody: "Generate 10 creative ideas or approaches for [Objective/Topic] considering [Constraints/Target].",
    placeholders: ["Objective/Topic", "Constraints/Target"]
  },
  {
    id: "make-checklist",
    category: "Utility",
    title: "Make a checklist",
    icon: "CheckSquare",
    promptBody: "Create a comprehensive, step-by-step checklist for [Task/Goal] ordered by phase or priority.",
    placeholders: ["Task/Goal"]
  }
];
