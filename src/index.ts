import { Command } from 'commander';
import chalk from 'chalk';
import { analyze } from './run/analyze.js';
import 'dotenv/config';

const program = new Command();

program
  .name('aem-clientlib-agent')
  .description('Analyze an AEM page and client libraries, correlate with repo usage, and propose recommendations')
  .version('0.1.0');

program
  .command('analyze')
  .requiredOption('--path <contentPath>', 'AEM content path, e.g. /content/site/en/page')
  .option('--clientlibs <names>', 'Comma-separated clientlib category names')
  .option('--repo <dir>', 'Repository root to scan (defaults to current working directory)')
  .option('--aem-url <url>', 'AEM base URL (defaults to AEM_URL env var)')
  .option('--aem-user <user>', 'AEM username (defaults to AEM_USER env var)')
  .option('--aem-pass <pass>', 'AEM password (defaults to AEM_PASS env var)')
  .option('--out <dir>', 'Output directory for reports (default: ./report)', './report')
  .action(async (opts) => {
    try {
      const resolved = {
        ...opts,
        aemUrl: opts.aemUrl ?? process.env.AEM_URL,
        aemUser: opts.aemUser ?? process.env.AEM_USER,
        aemPass: opts.aemPass ?? process.env.AEM_PASS,
      };
      await analyze(resolved);
    } catch (err) {
      console.error(chalk.red((err as Error).message));
      process.exitCode = 1;
    }
  });

program
  .command('optimize')
  .description('Automatically optimize client libraries and generate comprehensive reports')
  .requiredOption('--path <contentPath>', 'AEM content path for homepage, e.g. /content/wknd/us/en')
  .requiredOption('--project <name>', 'Project name (e.g. wknd)')
  .option('--repo <dir>', 'Repository root to scan (defaults to current working directory)')
  .option('--aem-url <url>', 'AEM base URL (defaults to AEM_URL env var)')
  .option('--aem-user <user>', 'AEM username (defaults to AEM_USER env var)')
  .option('--aem-pass <pass>', 'AEM password (defaults to AEM_PASS env var)')
  .option('--out <dir>', 'Output directory for optimization (default: ./optimization-output)', './optimization-output')
  .option('--base-lib <name>', 'Base client library name (default: base)')
  .option('--templates', 'Generate implementation templates', false)
  .option('--guide', 'Generate implementation guide', true)
  .action(async (opts) => {
    try {
      const { optimize } = await import('./run/optimize.js');
      const resolved = {
        ...opts,
        aemUrl: opts.aemUrl ?? process.env.AEM_URL,
        aemUser: opts.aemUser ?? process.env.AEM_USER,
        aemPass: opts.aemPass ?? process.env.AEM_PASS,
      };
      await optimize(resolved);
    } catch (err) {
      console.error(chalk.red((err as Error).message));
      process.exitCode = 1;
    }
  });

program.parseAsync();