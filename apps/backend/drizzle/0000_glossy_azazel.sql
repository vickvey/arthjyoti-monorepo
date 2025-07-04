CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`color` text DEFAULT 'white',
	`user_id` text NOT NULL,
	`createdAt` text(24),
	`updatedAt` text(24),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_user_id_unique` ON `categories` (`name`,`user_id`);--> statement-breakpoint
CREATE INDEX `categories_user_id_idx` ON `categories` (`user_id`);--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`expiresAt` text(24) NOT NULL,
	`user_id` text NOT NULL,
	`createdAt` text(24),
	`updatedAt` text(24),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_tokens_token_unique` ON `refresh_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`type` text DEFAULT 'expenditure',
	`description` text NOT NULL,
	`currency` text,
	`date` text(24),
	`user_id` text NOT NULL,
	`category_id` text NOT NULL,
	`createdAt` text(24),
	`updatedAt` text(24),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `transactions_user_id_idx` ON `transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `transactions_category_id_idx` ON `transactions` (`category_id`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE INDEX `transactions_user_category_idx` ON `transactions` (`user_id`,`category_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'standard' NOT NULL,
	`createdAt` text(24),
	`updatedAt` text(24)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);