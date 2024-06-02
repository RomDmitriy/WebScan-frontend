import { repo_status } from '@prisma/client';
import { Severity } from './severity.types';

export interface RepositoryInfo {
	id: string;
	name: string;
	description: string;
	status: repo_status;
	severity: Severity;
}
