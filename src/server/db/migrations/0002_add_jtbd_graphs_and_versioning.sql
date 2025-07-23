CREATE TABLE `aggregated_graph_local_graphs` (
	`id` text PRIMARY KEY NOT NULL,
	`local_graph_id` text NOT NULL,
	`aggregated_graph_version_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`local_graph_id`) REFERENCES `local_graphs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`aggregated_graph_version_id`) REFERENCES `aggregated_graph_versions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `aggregated_graph_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`aggregated_graph_id` text NOT NULL,
	`board_id` text NOT NULL,
	`version` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`aggregated_graph_id`) REFERENCES `aggregated_graphs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `aggregated_graphs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `aggregated_job_local_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`aggregated_job_id` text NOT NULL,
	`local_job_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`aggregated_job_id`) REFERENCES `aggregated_jobs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`local_job_id`) REFERENCES `local_jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `aggregated_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`aggregated_graph_version_id` text NOT NULL,
	`parent_job_id` text,
	`name` text NOT NULL,
	`data` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`aggregated_graph_version_id`) REFERENCES `aggregated_graph_versions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_job_id`) REFERENCES `aggregated_jobs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `local_graphs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`board_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `local_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`local_graph_id` text NOT NULL,
	`parent_job_id` text,
	`name` text NOT NULL,
	`data` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`local_graph_id`) REFERENCES `local_graphs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_job_id`) REFERENCES `local_jobs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `board_discussion` (
	`id` text PRIMARY KEY NOT NULL,
	`board_node_id` text NOT NULL,
	`topic_starter_id` text NOT NULL,
	`is_resolved` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`board_node_id`) REFERENCES `board_nodes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_starter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `board_discussion_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`discussion_id` text NOT NULL,
	`author_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`discussion_id`) REFERENCES `board_discussion`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `board_nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`board_id` text NOT NULL,
	`related_type` text NOT NULL,
	`related_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `board_sticky_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`board_node_id` text NOT NULL,
	`content` text NOT NULL,
	`color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`board_node_id`) REFERENCES `board_nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `boards` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
