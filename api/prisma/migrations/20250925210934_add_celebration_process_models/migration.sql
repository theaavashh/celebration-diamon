-- CreateTable
CREATE TABLE "celebration_processes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "celebration_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "celebration_process_steps" (
    "id" TEXT NOT NULL,
    "celebrationProcessId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "celebration_process_steps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "celebration_process_steps" ADD CONSTRAINT "celebration_process_steps_celebrationProcessId_fkey" FOREIGN KEY ("celebrationProcessId") REFERENCES "celebration_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
