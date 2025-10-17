-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "TaskStaff" DROP CONSTRAINT "TaskStaff_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskStaff" DROP CONSTRAINT "TaskStaff_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task_Category" DROP CONSTRAINT "Task_Category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Task_Category" DROP CONSTRAINT "Task_Category_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Task_User" DROP CONSTRAINT "Task_User_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Task_User" DROP CONSTRAINT "Task_User_userCompId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "User_Competition" DROP CONSTRAINT "User_Competition_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "User_Competition" DROP CONSTRAINT "User_Competition_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "User_Competition" DROP CONSTRAINT "User_Competition_userId_fkey";

-- DropForeignKey
ALTER TABLE "User_Family" DROP CONSTRAINT "User_Family_familyId_fkey";

-- DropForeignKey
ALTER TABLE "User_Family" DROP CONSTRAINT "User_Family_userCompId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationStaff" DROP CONSTRAINT "VerificationStaff_compId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationStaff" DROP CONSTRAINT "VerificationStaff_userId_fkey";

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "isInternal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clubName" TEXT;

-- AlterTable
ALTER TABLE "User_Competition" ADD COLUMN     "clubName" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Competition" ADD CONSTRAINT "User_Competition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Competition" ADD CONSTRAINT "User_Competition_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Competition" ADD CONSTRAINT "User_Competition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Family" ADD CONSTRAINT "User_Family_userCompId_fkey" FOREIGN KEY ("userCompId") REFERENCES "User_Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Family" ADD CONSTRAINT "User_Family_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Category" ADD CONSTRAINT "Task_Category_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Category" ADD CONSTRAINT "Task_Category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_User" ADD CONSTRAINT "Task_User_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_User" ADD CONSTRAINT "Task_User_userCompId_fkey" FOREIGN KEY ("userCompId") REFERENCES "User_Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStaff" ADD CONSTRAINT "TaskStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStaff" ADD CONSTRAINT "TaskStaff_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationStaff" ADD CONSTRAINT "VerificationStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationStaff" ADD CONSTRAINT "VerificationStaff_compId_fkey" FOREIGN KEY ("compId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
