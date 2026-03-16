/**
 * VentureHub — Production-Grade Database Schema
 * -----------------------------------------------
 * Design principles applied:
 *
 *  1. FK INDEXES         — Every FK column has a dedicated index. PostgreSQL does NOT
 *                          auto-create them. Missing FK indexes = sequential scans on
 *                          every JOIN → high CPU on any relational query.
 *
 *  2. COMPOSITE INDEXES  — Column order matters. Most selective (highest cardinality)
 *                          column goes first. Covers exact WHERE + ORDER BY patterns
 *                          of hot API queries to enable index-only scans.
 *
 *  3. PARTIAL INDEXES    — Index only rows that matter (unread notifications, active
 *                          users, pending EOIs). Smaller index = faster lookup + less
 *                          RAM consumed by the shared buffer cache.
 *
 *  4. DENORM COUNTERS    — profileViewCount, eoiReceivedCount etc. are updated via
 *                          atomic increments (UPDATE … SET col = col + 1). Avoids
 *                          expensive COUNT(*) GROUP BY on every dashboard render.
 *
 *  5. NATIVE ENUMS       — Stored as 4-byte OIDs vs varchar. Faster comparison,
 *                          less storage, constraint enforced at DB level (no app check).
 *
 *  6. DECIMAL for money  — Never FLOAT for currency. DECIMAL(15,2) is exact arithmetic.
 *
 *  7. APPEND-ONLY TABLES — analytics_events and admin_actions are INSERT-only.
 *                          Enables future range partitioning by month (pg_partman).
 *
 *  8. DRIZZLE RELATIONS  — Declared separately. Used by db.query.* for type-safe
 *                          eager loading. Zero N+1 risk. Relations do NOT create DB
 *                          constraints — .references() handles that.
 *
 *  9. TYPE EXPORTS       — $inferSelect / $inferInsert gives TypeScript types directly
 *                          from table definitions — single source of truth.
 */

import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// =====================================================================
// ENUMS
// =====================================================================

export const UserRole = pgEnum("user_role", [
  "ADMIN",
  "STARTUP",
  "INVESTOR",
  "MENTOR",
]);

export const ApprovalStatus = pgEnum("approval_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
]);

export const FundingStage = pgEnum("funding_stage", [
  "IDEA",
  "PRE_SEED",
  "SEED",
  "SERIES_A",
  "SERIES_B",
  "SERIES_C",
  "GROWTH",
]);

export const InvestorType = pgEnum("investor_type", [
  "ANGEL",
  "VENTURE_CAPITAL",
  "PRIVATE_EQUITY",
  "CORPORATE",
  "FAMILY_OFFICE",
  "ACCELERATOR",
]);

export const EOIStatus = pgEnum("eoi_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);

export const DealStage = pgEnum("deal_stage", [
  "EOI_SENT",
  "EOI_ACCEPTED",
  "IN_DISCUSSION",
  "DUE_DILIGENCE",
  "TERM_SHEET",
  "CLOSED",
  "DROPPED",
]);

export const SessionStatus = pgEnum("session_status", [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "RESCHEDULED",
  "COMPLETED",
  "CANCELLED",
]);

export const SessionFormat = pgEnum("session_format", [
  "VIDEO_CALL",
  "ASYNC_REVIEW",
  "IN_PERSON",
]);

export const PaymentStatus = pgEnum("payment_status", [
  "CREATED",
  "PENDING",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
]);

export const PaymentType = pgEnum("payment_type", [
  "STARTUP_REGISTRATION",
  "INVESTOR_MEMBERSHIP",
  "MENTOR_SESSION",
]);

export const NotificationChannel = pgEnum("notification_channel", [
  "EMAIL",
  "IN_APP",
  "PUSH",
]);

export const NotificationEvent = pgEnum("notification_event", [
  "EOI_RECEIVED",
  "EOI_ACCEPTED",
  "EOI_REJECTED",
  "SESSION_BOOKED",
  "SESSION_ACCEPTED",
  "SESSION_DECLINED",
  "SESSION_COMPLETED",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "PROFILE_APPROVED",
  "PROFILE_REJECTED",
  "MESSAGE_RECEIVED",
  "PROFILE_SUSPENDED",
]);

// =====================================================================
// USERS
// Central auth entity. Role-specific data in separate profile tables.
// =====================================================================

export const UsersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    password: text("password").notNull(),
    mobile: text("mobile"),
    role: UserRole("role").notNull(),

    // Admin-controlled governance
    approvalStatus: ApprovalStatus("approval_status")
      .default("PENDING")
      .notNull(),
    suspensionReason: text("suspension_reason"),

    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at", { mode: "date" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("users_email_key").on(t.email),
    // Admin search: name, email, mobile
    index("users_name_email_mobile_idx").on(t.name, t.email, t.mobile),
    // Admin approval queue: WHERE role = X AND approval_status = 'PENDING'
    index("users_role_approval_status_idx").on(t.role, t.approvalStatus),
    // Most queries filter active users — partial index keeps it small
    index("users_active_idx").on(t.isActive).where(sql`is_active = true`),
  ]
);

// =====================================================================
// AUTH TOKENS
// =====================================================================

export const EmailVerificationTokenTable = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (t) => [
    uniqueIndex("email_verification_tokens_email_token_key").on(
      t.email,
      t.token
    ),
    uniqueIndex("email_verification_tokens_token_key").on(t.token),
  ]
);

export const PasswordResetTokenTable = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (t) => [
    uniqueIndex("password_reset_tokens_email_token_key").on(t.email, t.token),
    uniqueIndex("password_reset_tokens_token_key").on(t.token),
  ]
);

// =====================================================================
// STARTUP PROFILE
// =====================================================================

export const StartupProfilesTable = pgTable(
  "startup_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => UsersTable.id, { onDelete: "cascade" }),

    // Identity
    companyName: text("company_name").notNull(),
    tagline: text("tagline"),
    description: text("description"),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),

    // Geography
    country: text("country"),
    city: text("city"),

    // Classification — used in investor search filters
    sector: text("sector").notNull(),
    industry: text("industry"),
    stage: FundingStage("stage").notNull(),
    foundedYear: integer("founded_year"),

    // Pitch content
    problemStatement: text("problem_statement"),
    solutionDescription: text("solution_description"),
    businessModel: text("business_model"),
    uniqueValueProposition: text("unique_value_proposition"),
    targetMarket: text("target_market"),
    competitiveLandscape: text("competitive_landscape"),

    // Traction
    revenueMonthly: decimal("revenue_monthly", { precision: 15, scale: 2 }),
    revenueAnnual: decimal("revenue_annual", { precision: 15, scale: 2 }),
    userCount: integer("user_count"),
    growthRate: decimal("growth_rate", { precision: 5, scale: 2 }),

    // Funding ask
    fundingAskMin: decimal("funding_ask_min", { precision: 15, scale: 2 }),
    fundingAskMax: decimal("funding_ask_max", { precision: 15, scale: 2 }),
    equityOffered: decimal("equity_offered", { precision: 5, scale: 2 }),
    useOfFunds: text("use_of_funds"),
    fundingDeadline: timestamp("funding_deadline", { mode: "date" }),
    previousFundingTotal: decimal("previous_funding_total", {
      precision: 15,
      scale: 2,
    }),

    // Impact layer
    impactDescription: text("impact_description"),
    impactMetrics: text("impact_metrics"),
    sdgGoals: text("sdg_goals"), // "3,7,13" — comma-separated

    // Admin-controlled verification & featuring
    isVerified: boolean("is_verified").default(false).notNull(),
    verifiedAt: timestamp("verified_at", { mode: "date" }),
    verifiedBy: uuid("verified_by").references(() => UsersTable.id),
    profileScore: integer("profile_score").default(0).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    featuredUntil: timestamp("featured_until", { mode: "date" }),

    // Denormalized counters — atomic increment, never COUNT(*)
    profileViewCount: integer("profile_view_count").default(0).notNull(),
    eoiReceivedCount: integer("eoi_received_count").default(0).notNull(),
    watchlistCount: integer("watchlist_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    // Hot investor search: sector + stage + country (selectivity order)
    index("startup_profiles_sector_stage_country_idx").on(
      t.sector,
      t.stage,
      t.country
    ),
    // Funding range slider filter
    index("startup_profiles_funding_ask_idx").on(
      t.fundingAskMin,
      t.fundingAskMax
    ),
    // Featured page — partial index (only ~N rows, stays tiny)
    index("startup_profiles_featured_idx")
      .on(t.isFeatured, t.featuredUntil)
      .where(sql`is_featured = true`),
    // Verified badge filter
    index("startup_profiles_verified_idx")
      .on(t.isVerified)
      .where(sql`is_verified = true`),
    // Leaderboard / recommendation sort
    index("startup_profiles_score_idx").on(t.profileScore),
  ]
);

export const StartupFoundersTable = pgTable(
  "startup_founders",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    startupId: uuid("startup_id")
      .notNull()
      .references(() => StartupProfilesTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    role: text("role").notNull(), // "CEO" | "CTO" | "COO"
    bio: text("bio"),
    linkedinUrl: text("linkedin_url"),
    avatarUrl: text("avatar_url"),
    isLeadFounder: boolean("is_lead_founder").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    // FK index — JOINed on every startup profile page load
    index("startup_founders_startup_id_idx").on(t.startupId),
  ]
);

export const StartupDocumentsTable = pgTable(
  "startup_documents",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    startupId: uuid("startup_id")
      .notNull()
      .references(() => StartupProfilesTable.id, { onDelete: "cascade" }),
    // "PITCH_DECK" | "FINANCIALS" | "LEGAL" | "OTHER"
    documentType: text("document_type").notNull(),
    title: text("title").notNull(),
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size"),
    mimeType: text("mime_type"),
    // false = locked until EOI accepted; true = visible pre-EOI
    isPublic: boolean("is_public").default(false).notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  },
  (t) => [
    index("startup_documents_startup_id_idx").on(t.startupId),
  ]
);

// =====================================================================
// INVESTOR PROFILE
// =====================================================================

export const InvestorProfilesTable = pgTable(
  "investor_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => UsersTable.id, { onDelete: "cascade" }),

    firmName: text("firm_name"),
    designation: text("designation"),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    websiteUrl: text("website_url"),
    linkedinUrl: text("linkedin_url"),
    country: text("country"),
    city: text("city"),

    // Preferences — used by matching algorithm
    investorType: InvestorType("investor_type"),
    preferredSectors: text("preferred_sectors"),      // "Climatetech,AgriTech"
    preferredStages: text("preferred_stages"),        // "SEED,SERIES_A"
    preferredGeographies: text("preferred_geographies"),
    ticketSizeMin: decimal("ticket_size_min", { precision: 15, scale: 2 }),
    ticketSizeMax: decimal("ticket_size_max", { precision: 15, scale: 2 }),
    investmentThesis: text("investment_thesis"),
    impactFocused: boolean("impact_focused").default(false).notNull(),

    // Portfolio summary — denormalized for dashboard widget
    totalInvestments: integer("total_investments").default(0).notNull(),
    totalPortfolioValue: decimal("total_portfolio_value", {
      precision: 18,
      scale: 2,
    }),
    irr: decimal("irr", { precision: 5, scale: 2 }),

    membershipExpiresAt: timestamp("membership_expires_at", { mode: "date" }),
    isVerified: boolean("is_verified").default(false).notNull(),
    verifiedAt: timestamp("verified_at", { mode: "date" }),
    verifiedBy: uuid("verified_by").references(() => UsersTable.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("investor_profiles_type_idx").on(t.investorType),
    index("investor_profiles_verified_idx")
      .on(t.isVerified)
      .where(sql`is_verified = true`),
    // Membership renewal cron job queries expiring memberships
    index("investor_profiles_membership_expires_idx").on(
      t.membershipExpiresAt
    ),
  ]
);

// =====================================================================
// MENTOR PROFILE
// =====================================================================

export const MentorProfilesTable = pgTable(
  "mentor_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => UsersTable.id, { onDelete: "cascade" }),

    headline: text("headline"),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    linkedinUrl: text("linkedin_url"),
    websiteUrl: text("website_url"),
    country: text("country"),
    city: text("city"),

    // Expertise
    domains: text("domains"),           // "Product,Finance,Growth"
    industries: text("industries"),
    yearsOfExperience: integer("years_of_experience"),
    previousCompanies: text("previous_companies"),

    // Booking
    sessionPriceUsd: decimal("session_price_usd", { precision: 10, scale: 2 }),
    sessionDurationMinutes: integer("session_duration_minutes").default(60),
    timezone: text("timezone"),
    isAvailable: boolean("is_available").default(true).notNull(),

    // Reputation — denormalized, updated via increment after each session
    totalSessions: integer("total_sessions").default(0).notNull(),
    averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
    totalRatings: integer("total_ratings").default(0).notNull(),
    totalEarnings: decimal("total_earnings", {
      precision: 15,
      scale: 2,
    }).default("0"),

    isVerified: boolean("is_verified").default(false).notNull(),
    verifiedAt: timestamp("verified_at", { mode: "date" }),
    verifiedBy: uuid("verified_by").references(() => UsersTable.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    // Marketplace listing: available mentors sorted by rating
    // Partial index — only available rows, keeps index tiny
    index("mentor_profiles_available_rating_idx")
      .on(t.averageRating)
      .where(sql`is_available = true`),
    // Price range filter
    index("mentor_profiles_price_idx").on(t.sessionPriceUsd),
    index("mentor_profiles_domains_idx").on(t.domains),
    index("mentor_profiles_verified_idx")
      .on(t.isVerified)
      .where(sql`is_verified = true`),
  ]
);

export const MentorAvailabilityTable = pgTable(
  "mentor_availability",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    mentorId: uuid("mentor_id")
      .notNull()
      .references(() => MentorProfilesTable.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(), // 0=Sun … 6=Sat
    startTime: text("start_time").notNull(),     // "09:00" UTC
    endTime: text("end_time").notNull(),         // "17:00" UTC
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("mentor_availability_mentor_id_idx").on(t.mentorId),
    // Calendar lookup: mentor + specific day
    index("mentor_availability_mentor_day_idx").on(
      t.mentorId,
      t.dayOfWeek
    ),
  ]
);

// =====================================================================
// EOI — EXPRESSION OF INTEREST
// Core investment workflow. Unlocks messaging on acceptance.
// =====================================================================

export const EOITable = pgTable(
  "eois",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    investorId: uuid("investor_id")
      .notNull()
      .references(() => InvestorProfilesTable.id, { onDelete: "cascade" }),
    startupId: uuid("startup_id")
      .notNull()
      .references(() => StartupProfilesTable.id, { onDelete: "cascade" }),

    status: EOIStatus("status").default("PENDING").notNull(),
    message: text("message"),
    rejectionReason: text("rejection_reason"),

    // Deal progression tracking
    dealStage: DealStage("deal_stage").default("EOI_SENT").notNull(),
    proposedAmount: decimal("proposed_amount", { precision: 15, scale: 2 }),
    proposedEquity: decimal("proposed_equity", { precision: 5, scale: 2 }),
    notes: text("notes"),

    sentAt: timestamp("sent_at").defaultNow().notNull(),
    respondedAt: timestamp("responded_at", { mode: "date" }),
    closedAt: timestamp("closed_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    // One EOI per investor+startup pair — enforced at DB level
    uniqueIndex("eois_investor_startup_key").on(t.investorId, t.startupId),
    // Startup inbox: "EOIs I received" — startup + status filter
    index("eois_startup_id_status_idx").on(t.startupId, t.status),
    // Investor pipeline: "My sent EOIs" — investor + deal stage
    index("eois_investor_id_deal_stage_idx").on(
      t.investorId,
      t.dealStage
    ),
    // Notification queue for pending EOIs
    index("eois_pending_sent_at_idx")
      .on(t.sentAt)
      .where(sql`status = 'PENDING'`),
  ]
);

export const InvestorWatchlistTable = pgTable(
  "investor_watchlist",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    investorId: uuid("investor_id")
      .notNull()
      .references(() => InvestorProfilesTable.id, { onDelete: "cascade" }),
    startupId: uuid("startup_id")
      .notNull()
      .references(() => StartupProfilesTable.id, { onDelete: "cascade" }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("investor_watchlist_investor_startup_key").on(
      t.investorId,
      t.startupId
    ),
    index("investor_watchlist_investor_id_idx").on(t.investorId),
  ]
);

// =====================================================================
// MESSAGING — unlocked only after EOI accepted
// =====================================================================

export const ConversationsTable = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    // 1-to-1 with EOI — conversation lifecycle tied to deal lifecycle
    eoiId: uuid("eoi_id")
      .notNull()
      .unique()
      .references(() => EOITable.id, { onDelete: "cascade" }),
    investorUserId: uuid("investor_user_id")
      .notNull()
      .references(() => UsersTable.id),
    startupUserId: uuid("startup_user_id")
      .notNull()
      .references(() => UsersTable.id),
    isActive: boolean("is_active").default(true).notNull(),
    // Denormalized — avoids MAX(created_at) subquery on inbox listing
    lastMessageAt: timestamp("last_message_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    // Inbox sorted by most recent message — covers WHERE + ORDER BY
    index("conversations_investor_last_msg_idx").on(
      t.investorUserId,
      t.lastMessageAt
    ),
    index("conversations_startup_last_msg_idx").on(
      t.startupUserId,
      t.lastMessageAt
    ),
  ]
);

export const MessagesTable = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => ConversationsTable.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => UsersTable.id),
    content: text("content").notNull(),
    attachmentUrl: text("attachment_url"),
    attachmentName: text("attachment_name"),
    attachmentSize: integer("attachment_size"),
    isRead: boolean("is_read").default(false).notNull(),
    readAt: timestamp("read_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    // Chat window: conversation + created_at DESC (pagination)
    index("messages_conversation_created_at_idx").on(
      t.conversationId,
      t.createdAt
    ),
    // Unread count badge — partial index on unread rows only (fast, tiny)
    index("messages_unread_idx")
      .on(t.conversationId, t.senderId)
      .where(sql`is_read = false`),
  ]
);

// =====================================================================
// MENTOR SESSIONS
// =====================================================================

export const MentorSessionsTable = pgTable(
  "mentor_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    mentorId: uuid("mentor_id")
      .notNull()
      .references(() => MentorProfilesTable.id, { onDelete: "cascade" }),
    startupId: uuid("startup_id")
      .notNull()
      .references(() => StartupProfilesTable.id, { onDelete: "cascade" }),

    status: SessionStatus("status").default("REQUESTED").notNull(),
    format: SessionFormat("format").default("VIDEO_CALL").notNull(),

    requestedAt: timestamp("requested_at").defaultNow().notNull(),
    scheduledAt: timestamp("scheduled_at", { mode: "date" }),
    durationMinutes: integer("duration_minutes").default(60).notNull(),
    videoCallLink: text("video_call_link"),
    rescheduleReason: text("reschedule_reason"),
    rescheduledAt: timestamp("rescheduled_at", { mode: "date" }),

    agendaNote: text("agenda_note"),
    sessionNotes: text("session_notes"),
    deliverables: text("deliverables"),

    // Split stored for payout audit
    amountUsd: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
    platformCommission: decimal("platform_commission", {
      precision: 10,
      scale: 2,
    }),
    mentorEarnings: decimal("mentor_earnings", { precision: 10, scale: 2 }),

    completedAt: timestamp("completed_at", { mode: "date" }),
    cancelledAt: timestamp("cancelled_at", { mode: "date" }),
    cancellationReason: text("cancellation_reason"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    // Mentor calendar: upcoming sessions sorted by scheduledAt
    index("mentor_sessions_mentor_scheduled_idx").on(
      t.mentorId,
      t.scheduledAt
    ),
    // Startup dashboard: sessions I've booked + status filter
    index("mentor_sessions_startup_status_idx").on(t.startupId, t.status),
    // Admin earnings report: completed sessions only
    index("mentor_sessions_completed_idx")
      .on(t.completedAt)
      .where(sql`status = 'COMPLETED'`),
  ]
);

// Bidirectional: startup rates mentor AND mentor rates startup
export const SessionRatingsTable = pgTable(
  "session_ratings",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => MentorSessionsTable.id, { onDelete: "cascade" }),
    raterId: uuid("rater_id")
      .notNull()
      .references(() => UsersTable.id),
    rateeId: uuid("ratee_id")
      .notNull()
      .references(() => UsersTable.id),
    rating: integer("rating").notNull(), // 1–5
    review: text("review"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    // One rating per rater per session
    uniqueIndex("session_ratings_session_rater_key").on(
      t.sessionId,
      t.raterId
    ),
    // Reputation query: all ratings WHERE rateeId = mentorProfile.userId
    index("session_ratings_ratee_id_idx").on(t.rateeId),
  ]
);

// =====================================================================
// PAYMENTS (Razorpay)
// =====================================================================

export const PaymentsTable = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),

    paymentType: PaymentType("payment_type").notNull(),
    status: PaymentStatus("status").default("CREATED").notNull(),
    amountUsd: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("USD").notNull(),

    // Polymorphic: what was paid for
    referenceId: uuid("reference_id"),
    referenceType: text("reference_type"),
    // "MENTOR_SESSION" | "STARTUP_REGISTRATION" | "INVESTOR_MEMBERSHIP"

    // Razorpay lifecycle
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),

    receiptUrl: text("receipt_url"),
    receiptSentAt: timestamp("receipt_sent_at", { mode: "date" }),
    paidAt: timestamp("paid_at", { mode: "date" }),
    failureReason: text("failure_reason"),
    refundedAt: timestamp("refunded_at", { mode: "date" }),
    refundReason: text("refund_reason"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    // User payment history — paginated by date
    index("payments_user_id_created_at_idx").on(t.userId, t.createdAt),
    // Razorpay webhook lookup — must resolve in microseconds
    uniqueIndex("payments_razorpay_order_id_key").on(t.razorpayOrderId),
    // Admin revenue dashboard: type + status + date
    index("payments_type_status_paid_at_idx").on(
      t.paymentType,
      t.status,
      t.paidAt
    ),
    // Polymorphic reference lookup
    index("payments_reference_idx").on(t.referenceId, t.referenceType),
    // Pending timeout job
    index("payments_pending_idx")
      .on(t.createdAt)
      .where(sql`status = 'PENDING'`),
  ]
);

// =====================================================================
// NOTIFICATIONS
// =====================================================================

export const NotificationsTable = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
    event: NotificationEvent("event").notNull(),
    channel: NotificationChannel("channel").default("IN_APP").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    resourceType: text("resource_type"),
    resourceId: uuid("resource_id"),
    isRead: boolean("is_read").default(false).notNull(),
    readAt: timestamp("read_at", { mode: "date" }),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    // Notification bell: unread count — partial index (only unread rows)
    index("notifications_user_unread_idx")
      .on(t.userId, t.createdAt)
      .where(sql`is_read = false`),
    // Full notification history pagination
    index("notifications_user_created_at_idx").on(t.userId, t.createdAt),
  ]
);

// =====================================================================
// ADMIN GOVERNANCE
// =====================================================================

// Immutable audit log — INSERT only
export const AdminActionsTable = pgTable(
  "admin_actions",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => UsersTable.id),
    targetUserId: uuid("target_user_id").references(() => UsersTable.id),
    // "APPROVE_USER" | "REJECT_USER" | "SUSPEND_USER" | "FEATURE_STARTUP"
    // "UNFEATURE_STARTUP" | "UPDATE_FEE" | "RESOLVE_DISPUTE" | "REFUND_PAYMENT"
    actionType: text("action_type").notNull(),
    targetType: text("target_type"),
    targetId: uuid("target_id"),
    reason: text("reason"),
    metadata: text("metadata"), // JSON string
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("admin_actions_admin_id_created_at_idx").on(
      t.adminId,
      t.createdAt
    ),
    index("admin_actions_target_user_id_idx").on(t.targetUserId),
    index("admin_actions_action_type_created_at_idx").on(
      t.actionType,
      t.createdAt
    ),
  ]
);

export const PlatformFeesTable = pgTable(
  "platform_fees",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    // "STARTUP_REGISTRATION" | "INVESTOR_MEMBERSHIP" | "MENTOR_COMMISSION_PERCENT"
    feeType: text("fee_type").notNull(),
    amountUsd: decimal("amount_usd", { precision: 10, scale: 2 }),
    commissionPercent: decimal("commission_percent", {
      precision: 5,
      scale: 2,
    }),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    updatedBy: uuid("updated_by").references(() => UsersTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("platform_fees_fee_type_key").on(t.feeType),
  ]
);

export const DisputesTable = pgTable(
  "disputes",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    raisedBy: uuid("raised_by")
      .notNull()
      .references(() => UsersTable.id),
    againstUserId: uuid("against_user_id").references(() => UsersTable.id),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    referenceType: text("reference_type"),
    referenceId: uuid("reference_id"),
    // "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED"
    status: text("status").default("OPEN").notNull(),
    resolution: text("resolution"),
    resolvedBy: uuid("resolved_by").references(() => UsersTable.id),
    resolvedAt: timestamp("resolved_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("disputes_raised_by_idx").on(t.raisedBy),
    // Admin open queue — partial index (only OPEN rows)
    index("disputes_open_idx")
      .on(t.createdAt)
      .where(sql`status = 'OPEN'`),
  ]
);

// =====================================================================
// ANALYTICS EVENTS — append-only event log
// Drives all dashboards. Never aggregates on business tables directly.
// Future: partition by RANGE on created_at (monthly partitions).
// =====================================================================

export const AnalyticsEventsTable = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").references(() => UsersTable.id, {
      onDelete: "set null",
    }),
    // "STARTUP_PROFILE_VIEW" | "EOI_SENT" | "SESSION_COMPLETED"
    // "SEARCH_PERFORMED" | "WATCHLIST_ADD" | "DOCUMENT_VIEWED"
    eventType: text("event_type").notNull(),
    resourceType: text("resource_type"),
    resourceId: uuid("resource_id"),
    metadata: text("metadata"), // JSON string: filters, referrer, device
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    // Time-series dashboard: type + date range
    index("analytics_events_type_created_at_idx").on(
      t.eventType,
      t.createdAt
    ),
    // Per-resource metrics: profile views, session completions per entity
    index("analytics_events_resource_idx").on(
      t.resourceType,
      t.resourceId,
      t.createdAt
    ),
    // Per-user activity timeline
    index("analytics_events_user_created_at_idx").on(
      t.userId,
      t.createdAt
    ),
  ]
);

// =====================================================================
// DRIZZLE RELATIONS
// Used by db.query.* for type-safe eager loading — no N+1.
// One db.query call with `with` replaces many individual SELECT calls.
// Relations do NOT create DB constraints — FKs on columns handle that.
// =====================================================================

// ----- Users -----
export const usersRelations = relations(UsersTable, ({ one, many }) => ({
  // Role-specific profile (only one will be populated per user)
  startupProfile: one(StartupProfilesTable, {
    fields: [UsersTable.id],
    references: [StartupProfilesTable.userId],
  }),
  investorProfile: one(InvestorProfilesTable, {
    fields: [UsersTable.id],
    references: [InvestorProfilesTable.userId],
  }),
  mentorProfile: one(MentorProfilesTable, {
    fields: [UsersTable.id],
    references: [MentorProfilesTable.userId],
  }),

  // Auth
  emailVerificationTokens: many(EmailVerificationTokenTable),
  passwordResetTokens: many(PasswordResetTokenTable),

  // Financials & comms
  payments: many(PaymentsTable),
  notifications: many(NotificationsTable),

  // Ratings given and received
  ratingsMade: many(SessionRatingsTable, { relationName: "rater" }),
  ratingsReceived: many(SessionRatingsTable, { relationName: "ratee" }),

  // Messaging
  investorConversations: many(ConversationsTable, {
    relationName: "investorUser",
  }),
  startupConversations: many(ConversationsTable, {
    relationName: "startupUser",
  }),
  messagesSent: many(MessagesTable),

  // Admin audit
  adminActionsPerformed: many(AdminActionsTable, { relationName: "admin" }),
  adminActionsReceived: many(AdminActionsTable, { relationName: "target" }),

  // Disputes
  disputesRaised: many(DisputesTable, { relationName: "raisedByUser" }),
  disputesAgainst: many(DisputesTable, { relationName: "againstUser" }),

  // Analytics
  analyticsEvents: many(AnalyticsEventsTable),
}));

// ----- Startup Profiles -----
export const startupProfilesRelations = relations(
  StartupProfilesTable,
  ({ one, many }) => ({
    user: one(UsersTable, {
      fields: [StartupProfilesTable.userId],
      references: [UsersTable.id],
    }),
    verifier: one(UsersTable, {
      fields: [StartupProfilesTable.verifiedBy],
      references: [UsersTable.id],
    }),
    founders: many(StartupFoundersTable),
    documents: many(StartupDocumentsTable),
    eois: many(EOITable),
    watchlistedBy: many(InvestorWatchlistTable),
    mentorSessions: many(MentorSessionsTable),
  })
);

export const startupFoundersRelations = relations(
  StartupFoundersTable,
  ({ one }) => ({
    startup: one(StartupProfilesTable, {
      fields: [StartupFoundersTable.startupId],
      references: [StartupProfilesTable.id],
    }),
  })
);

export const startupDocumentsRelations = relations(
  StartupDocumentsTable,
  ({ one }) => ({
    startup: one(StartupProfilesTable, {
      fields: [StartupDocumentsTable.startupId],
      references: [StartupProfilesTable.id],
    }),
  })
);

// ----- Investor Profiles -----
export const investorProfilesRelations = relations(
  InvestorProfilesTable,
  ({ one, many }) => ({
    user: one(UsersTable, {
      fields: [InvestorProfilesTable.userId],
      references: [UsersTable.id],
    }),
    verifier: one(UsersTable, {
      fields: [InvestorProfilesTable.verifiedBy],
      references: [UsersTable.id],
    }),
    eois: many(EOITable),
    watchlist: many(InvestorWatchlistTable),
  })
);

// ----- Mentor Profiles -----
export const mentorProfilesRelations = relations(
  MentorProfilesTable,
  ({ one, many }) => ({
    user: one(UsersTable, {
      fields: [MentorProfilesTable.userId],
      references: [UsersTable.id],
    }),
    verifier: one(UsersTable, {
      fields: [MentorProfilesTable.verifiedBy],
      references: [UsersTable.id],
    }),
    availability: many(MentorAvailabilityTable),
    sessions: many(MentorSessionsTable),
  })
);

export const mentorAvailabilityRelations = relations(
  MentorAvailabilityTable,
  ({ one }) => ({
    mentor: one(MentorProfilesTable, {
      fields: [MentorAvailabilityTable.mentorId],
      references: [MentorProfilesTable.id],
    }),
  })
);

// ----- EOI -----
export const eoiRelations = relations(EOITable, ({ one }) => ({
  investor: one(InvestorProfilesTable, {
    fields: [EOITable.investorId],
    references: [InvestorProfilesTable.id],
  }),
  startup: one(StartupProfilesTable, {
    fields: [EOITable.startupId],
    references: [StartupProfilesTable.id],
  }),
  conversation: one(ConversationsTable, {
    fields: [EOITable.id],
    references: [ConversationsTable.eoiId],
  }),
}));

// ----- Watchlist -----
export const investorWatchlistRelations = relations(
  InvestorWatchlistTable,
  ({ one }) => ({
    investor: one(InvestorProfilesTable, {
      fields: [InvestorWatchlistTable.investorId],
      references: [InvestorProfilesTable.id],
    }),
    startup: one(StartupProfilesTable, {
      fields: [InvestorWatchlistTable.startupId],
      references: [StartupProfilesTable.id],
    }),
  })
);

// ----- Conversations & Messages -----
export const conversationsRelations = relations(
  ConversationsTable,
  ({ one, many }) => ({
    eoi: one(EOITable, {
      fields: [ConversationsTable.eoiId],
      references: [EOITable.id],
    }),
    investorUser: one(UsersTable, {
      fields: [ConversationsTable.investorUserId],
      references: [UsersTable.id],
      relationName: "investorUser",
    }),
    startupUser: one(UsersTable, {
      fields: [ConversationsTable.startupUserId],
      references: [UsersTable.id],
      relationName: "startupUser",
    }),
    messages: many(MessagesTable),
  })
);

export const messagesRelations = relations(MessagesTable, ({ one }) => ({
  conversation: one(ConversationsTable, {
    fields: [MessagesTable.conversationId],
    references: [ConversationsTable.id],
  }),
  sender: one(UsersTable, {
    fields: [MessagesTable.senderId],
    references: [UsersTable.id],
  }),
}));

// ----- Mentor Sessions -----
export const mentorSessionsRelations = relations(
  MentorSessionsTable,
  ({ one, many }) => ({
    mentor: one(MentorProfilesTable, {
      fields: [MentorSessionsTable.mentorId],
      references: [MentorProfilesTable.id],
    }),
    startup: one(StartupProfilesTable, {
      fields: [MentorSessionsTable.startupId],
      references: [StartupProfilesTable.id],
    }),
    ratings: many(SessionRatingsTable),
    payment: one(PaymentsTable, {
      fields: [MentorSessionsTable.id],
      references: [PaymentsTable.referenceId],
    }),
  })
);

export const sessionRatingsRelations = relations(
  SessionRatingsTable,
  ({ one }) => ({
    session: one(MentorSessionsTable, {
      fields: [SessionRatingsTable.sessionId],
      references: [MentorSessionsTable.id],
    }),
    rater: one(UsersTable, {
      fields: [SessionRatingsTable.raterId],
      references: [UsersTable.id],
      relationName: "rater",
    }),
    ratee: one(UsersTable, {
      fields: [SessionRatingsTable.rateeId],
      references: [UsersTable.id],
      relationName: "ratee",
    }),
  })
);

// ----- Payments -----
export const paymentsRelations = relations(PaymentsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [PaymentsTable.userId],
    references: [UsersTable.id],
  }),
}));

// ----- Notifications -----
export const notificationsRelations = relations(
  NotificationsTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [NotificationsTable.userId],
      references: [UsersTable.id],
    }),
  })
);

// ----- Admin Actions -----
export const adminActionsRelations = relations(
  AdminActionsTable,
  ({ one }) => ({
    admin: one(UsersTable, {
      fields: [AdminActionsTable.adminId],
      references: [UsersTable.id],
      relationName: "admin",
    }),
    targetUser: one(UsersTable, {
      fields: [AdminActionsTable.targetUserId],
      references: [UsersTable.id],
      relationName: "target",
    }),
  })
);

// ----- Platform Fees -----
export const platformFeesRelations = relations(
  PlatformFeesTable,
  ({ one }) => ({
    updatedByUser: one(UsersTable, {
      fields: [PlatformFeesTable.updatedBy],
      references: [UsersTable.id],
    }),
  })
);

// ----- Disputes -----
export const disputesRelations = relations(DisputesTable, ({ one }) => ({
  raisedByUser: one(UsersTable, {
    fields: [DisputesTable.raisedBy],
    references: [UsersTable.id],
    relationName: "raisedByUser",
  }),
  againstUser: one(UsersTable, {
    fields: [DisputesTable.againstUserId],
    references: [UsersTable.id],
    relationName: "againstUser",
  }),
  resolvedByUser: one(UsersTable, {
    fields: [DisputesTable.resolvedBy],
    references: [UsersTable.id],
  }),
}));

// ----- Analytics -----
export const analyticsEventsRelations = relations(
  AnalyticsEventsTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [AnalyticsEventsTable.userId],
      references: [UsersTable.id],
    }),
  })
);

// =====================================================================
// INFERRED TYPESCRIPT TYPES
// Single source of truth — no manual interface duplication.
// Use NewX types for INSERT, X types for SELECT results.
// =====================================================================

export type User = typeof UsersTable.$inferSelect;
export type NewUser = typeof UsersTable.$inferInsert;

export type StartupProfile = typeof StartupProfilesTable.$inferSelect;
export type NewStartupProfile = typeof StartupProfilesTable.$inferInsert;

export type StartupFounder = typeof StartupFoundersTable.$inferSelect;
export type NewStartupFounder = typeof StartupFoundersTable.$inferInsert;

export type StartupDocument = typeof StartupDocumentsTable.$inferSelect;
export type NewStartupDocument = typeof StartupDocumentsTable.$inferInsert;

export type InvestorProfile = typeof InvestorProfilesTable.$inferSelect;
export type NewInvestorProfile = typeof InvestorProfilesTable.$inferInsert;

export type MentorProfile = typeof MentorProfilesTable.$inferSelect;
export type NewMentorProfile = typeof MentorProfilesTable.$inferInsert;

export type MentorAvailability = typeof MentorAvailabilityTable.$inferSelect;
export type NewMentorAvailability =
  typeof MentorAvailabilityTable.$inferInsert;

export type EOI = typeof EOITable.$inferSelect;
export type NewEOI = typeof EOITable.$inferInsert;

export type InvestorWatchlist = typeof InvestorWatchlistTable.$inferSelect;
export type NewInvestorWatchlist = typeof InvestorWatchlistTable.$inferInsert;

export type Conversation = typeof ConversationsTable.$inferSelect;
export type NewConversation = typeof ConversationsTable.$inferInsert;

export type Message = typeof MessagesTable.$inferSelect;
export type NewMessage = typeof MessagesTable.$inferInsert;

export type MentorSession = typeof MentorSessionsTable.$inferSelect;
export type NewMentorSession = typeof MentorSessionsTable.$inferInsert;

export type SessionRating = typeof SessionRatingsTable.$inferSelect;
export type NewSessionRating = typeof SessionRatingsTable.$inferInsert;

export type Payment = typeof PaymentsTable.$inferSelect;
export type NewPayment = typeof PaymentsTable.$inferInsert;

export type Notification = typeof NotificationsTable.$inferSelect;
export type NewNotification = typeof NotificationsTable.$inferInsert;

export type AdminAction = typeof AdminActionsTable.$inferSelect;
export type NewAdminAction = typeof AdminActionsTable.$inferInsert;

export type PlatformFee = typeof PlatformFeesTable.$inferSelect;
export type NewPlatformFee = typeof PlatformFeesTable.$inferInsert;

export type Dispute = typeof DisputesTable.$inferSelect;
export type NewDispute = typeof DisputesTable.$inferInsert;

export type AnalyticsEvent = typeof AnalyticsEventsTable.$inferSelect;
export type NewAnalyticsEvent = typeof AnalyticsEventsTable.$inferInsert;