// Template generators for different optimization scenarios

export interface TemplateConfig {
  projectName: string;
  baseLibrary: string;
  siteLibrary: string;
  outputDir: string;
}

export class TemplateGenerator {
  private config: TemplateConfig;
  
  constructor(config: TemplateConfig) {
    this.config = config;
  }
  
  generateHeaderTemplate(): string {
    return `<!--/*
    ${this.config.projectName.toUpperCase()} - Optimized Header Client Libraries
    Generated on: ${new Date().toISOString()}
    
    This template loads optimized client libraries for improved performance:
    - ${this.config.siteLibrary}: Site-level components and styling
    - ${this.config.baseLibrary}: Core component functionality (loaded via dependencies)
*/-->

<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

<!-- External fonts and resources -->
<link href="//fonts.googleapis.com/css?family=Source+Sans+Pro:400,600|Asar&display=swap" rel="stylesheet">

<!-- Optimized client library CSS -->
<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html"
     data-sly-call="\${clientLib.css @ categories='${this.config.siteLibrary}'}"/>

<!-- Context Hub (if required) -->
<sly data-sly-resource="\${'contexthub' @ resourceType='granite/contexthub/components/contexthub'}"/>`;
  }
  
  generateFooterTemplate(): string {
    return `<!--/*
    ${this.config.projectName.toUpperCase()} - Optimized Footer Client Libraries
    Generated on: ${new Date().toISOString()}
    
    This template loads optimized JavaScript for improved performance:
    - ${this.config.siteLibrary}: Site-level interactions and functionality
    - ${this.config.baseLibrary}: Core component functionality (loaded via dependencies)
*/-->

<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html">
    <!-- Optimized client library JavaScript -->
    <sly data-sly-call="\${clientLib.js @ categories='${this.config.siteLibrary}'}"/>
</sly>`;
  }
  
  generateConditionalTemplate(): string {
    return `<!--/*
    ${this.config.projectName.toUpperCase()} - Conditional Client Library Loading
    Generated on: ${new Date().toISOString()}
    
    This template demonstrates conditional loading for different page types:
    - Homepage: Optimized libraries
    - Other pages: Full libraries (fallback)
*/-->

<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html">
    <!-- Load optimized libraries for homepage -->
    <sly data-sly-test="\${currentPage.path == '${this.config.projectName === 'wknd' ? '/content/wknd/us/en' : '/content/' + this.config.projectName + '/home'}'}">
        <sly data-sly-call="\${clientLib.css @ categories='${this.config.siteLibrary}'}" data-sly-unwrap/>
    </sly>
    
    <!-- Load full libraries for other pages -->
    <sly data-sly-test="\${currentPage.path != '${this.config.projectName === 'wknd' ? '/content/wknd/us/en' : '/content/' + this.config.projectName + '/home'}'}">
        <sly data-sly-call="\${clientLib.css @ categories='${this.config.projectName}.base'}" data-sly-unwrap/>
    </sly>
</sly>`;
  }
  
  generateRollbackTemplate(): string {
    return `<!--/*
    ${this.config.projectName.toUpperCase()} - Rollback Template
    Generated on: ${new Date().toISOString()}
    
    Use this template to quickly rollback to original client libraries
    if issues are encountered with the optimized versions.
*/-->

<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html">
    <!-- Original client library references -->
    <sly data-sly-call="\${clientLib.css @ categories='${this.config.projectName}.base'}"/>
    <!-- Add other original libraries as needed -->
</sly>`;
  }
}
