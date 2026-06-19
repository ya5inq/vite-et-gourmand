export interface PageContentInterface {
  id: string;
  page: string;
  section: string;
  /** Arbitrary JSON content for the section (jsonb column). */
  content: Record<string, unknown>;
  updatedAt: Date;
  /** Staff member who last updated the section (null when seeded). */
  updatedBy: string | null;
}
