/* eslint-disable quotes */
'use strict';

module.exports = class initial1507998208886 {

    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "barcode" text NOT NULL, "name" text NOT NULL, "price" money NOT NULL, "maker" text NOT NULL, "model" text NOT NULL, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "address" text NOT NULL, "fiscal_number" text NOT NULL, "credit_card_type" text NOT NULL, "credit_card_number" text NOT NULL, "credit_card_expiration" date NOT NULL, "credit_card_cvv" text NOT NULL, "public_key" text NOT NULL, PRIMARY KEY("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }
};

