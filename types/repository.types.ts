import { repo_status } from '@prisma/client';
import { VulnerabiliesCount } from './vulnerabilities.types';

export interface RepositoryInfo {
	id: string;
	name: string;
	description: string;
	status: repo_status;
	severity: VulnerabiliesCount;
}
