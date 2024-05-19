import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1711712554460 implements MigrationInterface {
    name = 'Migration1711712554460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth_roles" ("role_id" varchar(256) PRIMARY KEY NOT NULL, "role_name" varchar(32) NOT NULL, "sort_order" integer NOT NULL DEFAULT (0), "is_deleted" boolean NOT NULL DEFAULT (false), "created_at" datetime DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "created_by_id" varchar, "updated_by_id" varchar)`);
        await queryRunner.query(`CREATE TABLE "auth_login_user_roles" ("account" varchar(256) NOT NULL, "role_id" varchar(256) NOT NULL, "sort_order" integer NOT NULL DEFAULT (0), "is_deleted" boolean NOT NULL DEFAULT (false), "created_at" datetime DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "created_by_id" varchar, "updated_by_id" varchar, PRIMARY KEY ("account", "role_id"))`);
        await queryRunner.query(`CREATE TABLE "auth_login_users" ("account" varchar(256) PRIMARY KEY NOT NULL, "username" varchar(256) NOT NULL, "password" varchar(256) NOT NULL, "enabled" boolean NOT NULL, "account_non_expired" boolean NOT NULL, "account_non_locked" boolean NOT NULL, "credentials_non_expired" boolean NOT NULL, "sort_order" integer NOT NULL DEFAULT (0), "is_deleted" boolean NOT NULL DEFAULT (false), "created_at" datetime DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "created_by_id" varchar, "updated_by_id" varchar)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth_login_users"`);
        await queryRunner.query(`DROP TABLE "auth_login_user_roles"`);
        await queryRunner.query(`DROP TABLE "auth_roles"`);
    }

}
