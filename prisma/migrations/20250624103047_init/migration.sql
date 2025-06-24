-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TypingSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "windowTitle" TEXT,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "totalKeys" INTEGER NOT NULL DEFAULT 0,
    "totalWords" INTEGER NOT NULL DEFAULT 0,
    "totalChars" INTEGER NOT NULL DEFAULT 0,
    "wpm" REAL NOT NULL DEFAULT 0,
    "cpm" REAL NOT NULL DEFAULT 0,
    "accuracy" REAL NOT NULL DEFAULT 0,
    "platform" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TypingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KeyEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "keyCode" INTEGER NOT NULL,
    "keyName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interval" INTEGER,
    "appName" TEXT NOT NULL,
    "windowTitle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KeyEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TypingSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalTypingTime" INTEGER NOT NULL DEFAULT 0,
    "totalKeys" INTEGER NOT NULL DEFAULT 0,
    "totalWords" INTEGER NOT NULL DEFAULT 0,
    "totalChars" INTEGER NOT NULL DEFAULT 0,
    "avgWpm" REAL NOT NULL DEFAULT 0,
    "avgCpm" REAL NOT NULL DEFAULT 0,
    "avgAccuracy" REAL NOT NULL DEFAULT 0,
    "avgSessionTime" REAL NOT NULL DEFAULT 0,
    "bestWpm" REAL NOT NULL DEFAULT 0,
    "bestAccuracy" REAL NOT NULL DEFAULT 0,
    "longestSession" INTEGER NOT NULL DEFAULT 0,
    "mostActiveApp" TEXT,
    "mostActiveHour" INTEGER,
    "mostActiveDay" INTEGER,
    "recentWpmTrend" TEXT,
    "recentTimeTrend" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appName" TEXT NOT NULL,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "totalKeys" INTEGER NOT NULL DEFAULT 0,
    "avgWpm" REAL NOT NULL DEFAULT 0,
    "avgAccuracy" REAL NOT NULL DEFAULT 0,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "TypingSession_userId_idx" ON "TypingSession"("userId");

-- CreateIndex
CREATE INDEX "TypingSession_startTime_idx" ON "TypingSession"("startTime");

-- CreateIndex
CREATE INDEX "TypingSession_appName_idx" ON "TypingSession"("appName");

-- CreateIndex
CREATE INDEX "KeyEvent_sessionId_idx" ON "KeyEvent"("sessionId");

-- CreateIndex
CREATE INDEX "KeyEvent_timestamp_idx" ON "KeyEvent"("timestamp");

-- CreateIndex
CREATE INDEX "KeyEvent_appName_idx" ON "KeyEvent"("appName");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AppStats_appName_key" ON "AppStats"("appName");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_key_key" ON "Settings"("key");
