import { severity_type } from '@prisma/client';

export interface SourceInfo {
	path: string;
	packages: PackageWithVulnerability[];
}

export interface PackageWithVulnerability {
	name: string;
	version: string;
	ecosystem: string;
	severity: { id: string; severity: severity_type };
}
