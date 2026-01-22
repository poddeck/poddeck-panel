import client from "../client";

export type Audit = {
  raw: string;
  controls: AuditControl[];
  totals: AuditTotals;
};

export type AuditControl = {
  id: string;
  version: string;
  detected_version: string;
  text: string;
  node_type: string;
  tests: AuditTest[];
  totals: AuditTotals;
};

export type AuditTest = {
  section: string;
  type: string;
  description: string;
  results: AuditResult[];
  totals: AuditTotals;
};

export type AuditResult = {
  test_number: string;
  test_description: string;
  audit: string;
  audit_env: string;
  audit_config: string;
  type: string;
  remediation: string;
  test_info: string;
  status: string;
  actual_value: string;
  scored: string;
  is_multiple: boolean;
  expected_result: string;
  reason: string;
};

export type AuditTotals = {
  total_pass: number;
  total_fail: number;
  total_warn: number;
  total_info: number;
};

export type AuditPerformResponse = {
  success: boolean;
  audit: Audit;
}

export type AuditFindResponse = {
  success: boolean;
  audit: Audit;
}

export const AuditApi = {
  Perform: "/audit/perform/",
  Find: "/audit/find/"
} as const;

const perform = () => client.get<AuditPerformResponse>({url: AuditApi.Perform});

const find = () => client.get<AuditFindResponse>({url: AuditApi.Find});

export default {
  perform,
  find
};