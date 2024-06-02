import { severity_type } from '@prisma/client';

export interface SourceInfo {
	path: string;
	packages: PackageWithSeverity[];
}

export interface PackageWithSeverity {
	name: string;
	ecosystem: string;
	severity: { id: string; severity: severity_type };
}
