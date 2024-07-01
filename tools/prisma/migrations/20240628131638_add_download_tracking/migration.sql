-- CreateTable
CREATE TABLE "DownloadTracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "downloadTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFreeDownload" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DownloadTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DownloadTracking_userId_idx" ON "DownloadTracking"("userId");

-- AddForeignKey
ALTER TABLE "DownloadTracking" ADD CONSTRAINT "DownloadTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
