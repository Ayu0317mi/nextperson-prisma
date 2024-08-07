/*
  Warnings:

  - Added the required column `dob` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL;
