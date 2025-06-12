-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "persona_card_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_cards" (
    "persona_card_id" TEXT NOT NULL,
    "persona_card_name" TEXT NOT NULL,
    "persona_philosophy" TEXT NOT NULL,
    "persona_meaning" TEXT NOT NULL,

    CONSTRAINT "persona_cards_pkey" PRIMARY KEY ("persona_card_id")
);

-- CreateTable
CREATE TABLE "persona_moodboards" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "snapshot_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "persona_moodboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_vibes" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "color_boldness" INTEGER NOT NULL,
    "type_temperament" INTEGER NOT NULL,
    "spacing_airiness" INTEGER NOT NULL,
    "motion_drama" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "persona_vibes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_keywords" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "persona_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screens" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_queries" (
    "id" TEXT NOT NULL,
    "screen_id" TEXT NOT NULL,
    "design_master_id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "product_type" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "age_group" TEXT NOT NULL,
    "brand_personality" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_results" (
    "id" TEXT NOT NULL,
    "query_id" TEXT NOT NULL,
    "feedback_summary" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_masters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "style_summary" TEXT NOT NULL,
    "userful_for" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,

    CONSTRAINT "design_masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyzer_results" (
    "id" TEXT NOT NULL,
    "feedback_result_id" TEXT NOT NULL,
    "point_id" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "feedback_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analyzer_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "select_analyzers" (
    "id" TEXT NOT NULL,
    "point_id" TEXT NOT NULL,
    "subtopic_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "feedback_query_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "select_analyzers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyzer_subtopics" (
    "id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "analyzer_subtopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyzer_points" (
    "id" TEXT NOT NULL,
    "subtopic_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "analyzer_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyzer_topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "analyzer_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "stripe_price_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_model" BOOLEAN NOT NULL,
    "max_projects" INTEGER NOT NULL,
    "max_queries" INTEGER NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_sub_id" TEXT NOT NULL,
    "auto_renew" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_features" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_features" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subscription_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "personas_user_id_key" ON "personas"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "features_slug_key" ON "features"("slug");

-- AddForeignKey
ALTER TABLE "personas" ADD CONSTRAINT "personas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personas" ADD CONSTRAINT "personas_persona_card_id_fkey" FOREIGN KEY ("persona_card_id") REFERENCES "persona_cards"("persona_card_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_moodboards" ADD CONSTRAINT "persona_moodboards_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_vibes" ADD CONSTRAINT "persona_vibes_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_keywords" ADD CONSTRAINT "persona_keywords_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_queries" ADD CONSTRAINT "feedback_queries_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "screens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_queries" ADD CONSTRAINT "feedback_queries_design_master_id_fkey" FOREIGN KEY ("design_master_id") REFERENCES "design_masters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_results" ADD CONSTRAINT "feedback_results_query_id_fkey" FOREIGN KEY ("query_id") REFERENCES "feedback_queries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyzer_results" ADD CONSTRAINT "analyzer_results_feedback_result_id_fkey" FOREIGN KEY ("feedback_result_id") REFERENCES "feedback_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyzer_results" ADD CONSTRAINT "analyzer_results_point_id_fkey" FOREIGN KEY ("point_id") REFERENCES "analyzer_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "select_analyzers" ADD CONSTRAINT "select_analyzers_point_id_fkey" FOREIGN KEY ("point_id") REFERENCES "analyzer_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "select_analyzers" ADD CONSTRAINT "select_analyzers_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "analyzer_subtopics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "select_analyzers" ADD CONSTRAINT "select_analyzers_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "analyzer_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "select_analyzers" ADD CONSTRAINT "select_analyzers_feedback_query_id_fkey" FOREIGN KEY ("feedback_query_id") REFERENCES "feedback_queries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyzer_subtopics" ADD CONSTRAINT "analyzer_subtopics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "analyzer_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyzer_points" ADD CONSTRAINT "analyzer_points_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "analyzer_subtopics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_features" ADD CONSTRAINT "subscription_features_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_features" ADD CONSTRAINT "subscription_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
