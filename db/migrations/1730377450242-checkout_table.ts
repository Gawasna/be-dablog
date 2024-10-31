import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckoutTable1730377450242 implements MigrationInterface {
    name = 'CheckoutTable1730377450242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`fk_posts_author_id\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`fk_posts_category_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`status\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`image_path\` \`image_path\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`updated_at\` \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`category_id\` \`category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`status\` \`status\` enum ('public', 'hidden') NOT NULL DEFAULT 'public'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`refresh_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_312c63be865c81b922e39c2475e\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_852f266adc5d67c40405c887b49\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_852f266adc5d67c40405c887b49\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_312c63be865c81b922e39c2475e\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('admin', 'user') NULL DEFAULT ''user''`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`refresh_token\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`status\` \`status\` enum ('public', 'hidden') NULL DEFAULT ''public''`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`category_id\` \`category_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`updated_at\` \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`image_path\` \`image_path\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`fk_posts_category_id\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`fk_posts_author_id\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

}
