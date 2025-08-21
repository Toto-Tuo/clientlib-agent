import chalk from 'chalk';
import { collectPageAndTemplateData } from '../sources/aem.js';
import { analyzeRepository } from '../sources/repo.js';
import { correlateFindings } from '../sources/correlation.js';
import { ClientLibOptimizer, OptimizationConfig } from '../automation/optimizer.js';
import { renderReport } from '../sources/report.js';

export interface OptimizeOptions {
  path: string;
  project: string;
  repo?: string;
  aemUrl?: string;
  aemUser?: string;
  aemPass?: string;
  out: string;
  baseLib?: string;
  templates: boolean;
  guide: boolean;
}

export async function optimize(opts: OptimizeOptions): Promise<void> {
  console.log(chalk.blue.bold('🚀 AUTOMATED CLIENT LIBRARY OPTIMIZATION'));
  console.log(chalk.gray('='.repeat(50)));
  
  const repoRoot = opts.repo ?? process.cwd();
  
  console.log(chalk.blue('\n📋 Configuration:'));
  console.log(chalk.gray(`  Project: ${opts.project}`));
  console.log(chalk.gray(`  Homepage: ${opts.path}`));
  console.log(chalk.gray(`  Repository: ${repoRoot}`));
  console.log(chalk.gray(`  Output: ${opts.out}`));
  console.log(chalk.gray(`  AEM URL: ${opts.aemUrl || 'Not specified'}`));
  
  try {
    // Step 1: Collect AEM data
    console.log(chalk.blue('\n📊 Step 1: Analyzing AEM homepage...'));
    const aemData = await collectPageAndTemplateData({
      baseUrl: opts.aemUrl,
      username: opts.aemUser,
      password: opts.aemPass,
      contentPath: opts.path,
    });
    
    console.log(chalk.green(`✅ Found ${aemData.page.componentsUsed.length} components on page`));
    
    // Step 2: Analyze repository
    console.log(chalk.blue('\n🔍 Step 2: Scanning repository for client libraries...'));
    const repoData = await analyzeRepository({ repoRoot });
    
    console.log(chalk.green(`✅ Found ${repoData.clientlibs.length} client libraries`));
    console.log(chalk.green(`✅ Found ${repoData.htlInclusions.length} HTL inclusions`));
    
    // Step 3: Correlate data
    console.log(chalk.blue('\n🔗 Step 3: Correlating component usage...'));
    const correlatedData = correlateFindings(aemData, repoData);
    
    // Step 4: Generate optimization
    console.log(chalk.blue('\n⚡ Step 4: Generating optimizations...'));
    
    const optimizationConfig: OptimizationConfig = {
      projectName: opts.project,
      homepage: {
        path: opts.path,
        url: opts.aemUrl
      },
      outputDir: opts.out,
      baseClientLib: opts.baseLib || 'base',
      generateImplementationGuide: opts.guide,
      generateTemplates: opts.templates
    };
    
    const optimizer = new ClientLibOptimizer(optimizationConfig);
    const result = await optimizer.optimize(aemData, repoData);
    
    // Step 5: Generate summary report
    console.log(chalk.blue('\n📄 Step 5: Generating analysis summary...'));
    // Generate analysis summary for reference
    const { generateRecommendation } = await import('../sources/recommender.js');
    const recommendation = await generateRecommendation({ aemData, repoData, correlated: correlatedData });
    await renderReport({ 
      outputDir: opts.out, 
      aemData, 
      repoData, 
      correlated: correlatedData, 
      recommendation 
    });
    
    // Step 6: Display results
    console.log(chalk.green.bold('\n🎉 OPTIMIZATION COMPLETE!'));
    console.log(chalk.gray('='.repeat(50)));
    
    console.log(chalk.yellow('\n📊 Optimization Results:'));
    console.log(chalk.green(`  ✅ Base library: ${result.baseLibOptimization.reduction}% component reduction`));
    console.log(chalk.green(`  ✅ Site library: ${result.siteLibOptimization.components.length} site-level components`));
    console.log(chalk.green(`  ✅ Reports generated: ${result.files.reports.length} files`));
    console.log(chalk.green(`  ✅ Client libraries: ${result.files.clientlibs.length} optimized libraries`));
    
    if (result.files.templates.length > 0) {
      console.log(chalk.green(`  ✅ Templates: ${result.files.templates.length} implementation templates`));
    }
    
    console.log(chalk.yellow('\n📁 Generated Files:'));
    result.files.reports.forEach(file => {
      console.log(chalk.gray(`  📊 ${file}`));
    });
    result.files.clientlibs.forEach(file => {
      console.log(chalk.gray(`  📦 ${file}`));
    });
    result.files.templates.forEach(file => {
      console.log(chalk.gray(`  📝 ${file}`));
    });
    
    console.log(chalk.blue('\n🚀 Next Steps:'));
    console.log(chalk.white('  1. Review the optimization reports'));
    console.log(chalk.white('  2. Copy client libraries to your AEM project'));
    console.log(chalk.white('  3. Update page templates'));
    console.log(chalk.white('  4. Test and deploy'));
    console.log(chalk.white('  5. Monitor performance improvements'));
    
    console.log(chalk.yellow(`\n📖 For detailed instructions, see: ${opts.out}/IMPLEMENTATION_GUIDE.md`));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Optimization failed:'));
    console.error(chalk.red(`   ${(error as Error).message}`));
    
    if (process.env.DEBUG) {
      console.error(chalk.gray('\nDebug stack trace:'));
      console.error(chalk.gray((error as Error).stack));
    }
    
    throw error;
  }
}
