import {MigrationInterface, QueryRunner} from 'typeorm';

export class UsersAndProducts1508076536681 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "barcode" character varying NOT NULL, "name" character varying NOT NULL, "price" numeric(12,2) NOT NULL, "maker" character varying NOT NULL, "model" character varying NOT NULL, CONSTRAINT "uk_product_barcode" UNIQUE ("barcode"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "address" character varying NOT NULL, "fiscalNumber" character varying NOT NULL, "creditCardType" character varying NOT NULL, "creditCardNumber" character varying NOT NULL, "creditCardExpiration" character varying NOT NULL, "creditCardCvv" character varying NOT NULL, "publicKey" character varying NOT NULL, PRIMARY KEY("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
