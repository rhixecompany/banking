export interface HealthChecks {
  database: boolean;
  redis?: boolean;
}

export function checkDatabase(): Promise<boolean>;
export function checkRedis(): Promise<boolean | undefined>;
