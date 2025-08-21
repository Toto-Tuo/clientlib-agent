# WKND Client Library Implementation Guide

## Quick Reference: Before vs After

### Component Comparison

| Component | wknd.base | wknd-new.base | Used on Homepage |
|-----------|-----------|---------------|------------------|
| core.wcm.components.carousel.v1 | ✅ | ✅ | ✅ Hero section |
| core.wcm.components.image.v3 | ✅ | ✅ | ✅ Multiple images |
| core.wcm.components.breadcrumb.v2 | ✅ | ✅ | ✅ Navigation |
| core.wcm.components.accordion.v1 | ✅ | ❌ | ❌ Not found |
| core.wcm.components.tabs.v1 | ✅ | ❌ | ❌ Not found |
| core.wcm.components.search.v1 | ✅ | ❌ | ❌ Not found |
| core.wcm.components.form.text.v2 | ✅ | ❌ | ❌ Not found |
| core.wcm.components.embed.v1 | ✅ | ❌ | ❌ Not found |
| **Total Components** | **8** | **3** | **62.5% reduction** |

## Step-by-Step Implementation

### Step 1: Deploy Client Library Files

Copy the new client library structure to your AEM project:

```bash
# Copy to your AEM project
cp -r wknd-new-clientlib/clientlib-new-base/ \
  /path/to/your/project/ui.apps/src/main/content/jcr_root/apps/wknd/clientlibs/
```

### Step 2: Update Page Component Templates

#### Find Current References

Search for existing `wknd.base` references:

```bash
# Find all files referencing wknd.base
grep -r "wknd.base" ui.apps/src/main/content/jcr_root/apps/wknd/components/
```

#### Update Header Template

**File:** `ui.apps/src/main/content/jcr_root/apps/wknd/components/xfpage/customheaderlibs.html`

**Before:**
```html
<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html">
    <sly data-sly-call="${clientLib.css @ categories='wknd.base'}" />
</sly>
```

**After:**
```html
<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html">
    <sly data-sly-call="${clientLib.css @ categories='wknd-new.base'}" />
</sly>
```

#### Update Footer Template

**File:** `ui.apps/src/main/content/jcr_root/apps/wknd/components/xfpage/customfooterlibs.html`

**Before:**
```html
<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html">
    <sly data-sly-call="${clientLib.js @ categories='wknd.base'}" />
</sly>
```

**After:**
```html
<sly data-sly-use.clientLib="/libs/granite/sightly/templates/clientlib.html">
    <sly data-sly-call="${clientLib.js @ categories='wknd-new.base'}" />
</sly>
```

### Step 3: Update Page Templates (if applicable)

Check if any page templates directly reference `wknd.base`:

```bash
# Search in templates
find ui.apps -name "*.html" -exec grep -l "wknd.base" {} \;
```

### Step 4: Build and Deploy

```bash
# Build the project
mvn clean install -PautoInstallPackage

# Or for specific modules
mvn clean install -PautoInstallPackage -pl ui.apps
```

## Testing Checklist

### ✅ Functional Testing

- [ ] **Homepage loads correctly**
  - [ ] Hero carousel functions properly
  - [ ] All images display correctly
  - [ ] Navigation breadcrumbs work
  - [ ] No JavaScript errors in console

- [ ] **Performance verification**
  - [ ] Measure page load time before/after
  - [ ] Check network tab for bundle sizes
  - [ ] Verify fewer HTTP requests

- [ ] **Cross-browser testing**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

### ✅ Regression Testing

- [ ] **Other pages still work**
  - [ ] Article pages (may need accordion/tabs)
  - [ ] Search pages (may need search component)
  - [ ] Form pages (may need form components)

## Rollback Procedure

If issues are discovered:

### Option 1: Quick Rollback

```html
<!-- Revert templates to use original client library -->
<sly data-sly-call="${clientLib.css @ categories='wknd.base'}" />
<sly data-sly-call="${clientLib.js @ categories='wknd.base'}" />
```

### Option 2: Conditional Loading

```html
<!-- Use new clientlib for homepage, old for others -->
<sly data-sly-test="${currentPage.path == '/content/wknd/us/en'}">
    <sly data-sly-call="${clientLib.css @ categories='wknd-new.base'}" />
</sly>
<sly data-sly-test="${currentPage.path != '/content/wknd/us/en'}">
    <sly data-sly-call="${clientLib.css @ categories='wknd.base'}" />
</sly>
```

## Advanced Optimization Strategies

### 1. Template-Specific Client Libraries

Create different optimized libraries for different page types:

```xml
<!-- For homepage -->
categories="[wknd.homepage]"
embed="[core.wcm.components.carousel.v1,core.wcm.components.image.v3]"

<!-- For article pages -->
categories="[wknd.article]"
embed="[core.wcm.components.image.v3,core.wcm.components.tabs.v1]"

<!-- For search pages -->
categories="[wknd.search]"
embed="[core.wcm.components.search.v1,core.wcm.components.form.text.v2]"
```

### 2. Progressive Loading

```html
<!-- Load base components immediately -->
<sly data-sly-call="${clientLib.css @ categories='wknd-new.base'}" />

<!-- Load additional components on demand -->
<sly data-sly-test="${properties.hasAccordion}">
    <sly data-sly-call="${clientLib.css @ categories='core.wcm.components.accordion.v1'}" />
</sly>
```

### 3. Critical CSS Inlining

For the homepage, consider inlining critical CSS:

```html
<style>
    /* Critical CSS for above-the-fold content */
    .wknd-hero { /* styles */ }
    .wknd-nav { /* styles */ }
</style>
<sly data-sly-call="${clientLib.css @ categories='wknd-new.base'}" />
```

## Monitoring and Metrics

### Performance Metrics to Track

1. **Page Load Time**
   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)

2. **Bundle Sizes**
   - CSS bundle size reduction
   - JavaScript bundle size reduction
   - Total bytes transferred

3. **User Experience**
   - Bounce rate
   - Page engagement time
   - Conversion rates

### Monitoring Tools

- Google PageSpeed Insights
- WebPageTest
- Adobe Analytics (if available)
- Browser DevTools Network tab

## Expected Results

Based on similar optimizations:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| CSS Bundle Size | ~150KB | ~90KB | 40% reduction |
| JS Bundle Size | ~200KB | ~120KB | 40% reduction |
| Page Load Time | 2.5s | 2.0s | 20% faster |
| Network Requests | 15 | 12 | 20% fewer |

*Note: Actual results may vary based on network conditions and server configuration.*

