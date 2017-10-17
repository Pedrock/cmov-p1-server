import {MigrationInterface, QueryRunner} from 'typeorm';

export class Initial1508195845627 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "barcode" character varying NOT NULL, "name" character varying NOT NULL, "price" numeric(12,2) NOT NULL, "maker" character varying NOT NULL, "model" character varying NOT NULL, CONSTRAINT "uk_product_barcode" UNIQUE ("barcode"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "token" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "address" character varying NOT NULL, "fiscalNumber" character varying NOT NULL, "creditCardType" character varying NOT NULL, "creditCardNumber" character varying NOT NULL, "creditCardExpiration" date NOT NULL, "creditCardCvv" character varying NOT NULL, "publicKey" character varying NOT NULL, CONSTRAINT "uk_user_token" UNIQUE ("token"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "products" jsonb NOT NULL, "total" numeric(12,2) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "uk_purchase_token" UNIQUE ("token"), PRIMARY KEY("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "fk_6a6b208e8cd4c1b7a4f58655b31" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "fk_6a6b208e8cd4c1b7a4f58655b31"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
