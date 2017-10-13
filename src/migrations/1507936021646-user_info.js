/* eslint-disable quotes */
'use strict';

module.exports = class user_info1507936021646  {

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "address" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "fiscal_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "credit_card_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "credit_card_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "credit_card_expiration" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "credit_card_cvv" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "public_key" character varying NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "public_key"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "credit_card_cvv"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "credit_card_expiration"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "credit_card_number"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "credit_card_type"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "fiscal_number"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "address"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "name"`);
    }

};
