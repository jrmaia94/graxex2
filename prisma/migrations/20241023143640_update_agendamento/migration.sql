-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentMethod" TEXT;
