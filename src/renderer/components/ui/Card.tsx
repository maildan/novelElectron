'use client';

import React, { ReactNode, ReactElement } from 'react';
import { Logger } from '../../shared/logger';
import * as React from "react"

import { cn } from "@/lib/utils"

const CARD_STYLES = {
  base: 'rounded-lg bg-white dark:bg-slate-800 shadow p-6',
};

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }): ReactElement => {
  React.useEffect(() => {
    Logger.info('Card', '카드 렌더링 완료');
    return () => {
      Logger.info('Card', '카드 언마운트');
    };
  }, []);

  return (
    <section className={[CARD_STYLES.base, className].join(' ')} aria-label="카드">
      {children}
    </section>
  );
};

// TODO: Loop 프로젝트 strict 타입/스타일/로깅/접근성/IPC 규칙에 맞게 리팩터링 필요

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

// TODO: Loop 프로젝트 strict 타입/스타일/로깅/접근성/IPC 규칙에 맞게 리팩터링 필요 