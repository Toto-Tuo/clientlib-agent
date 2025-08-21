# WKND Client Library Optimization Summary

## Analysis Results

Based on the analysis of the WKND homepage at https://weretail-training-sandbox.adobecqms.net/content/wknd/us/en.html, we identified optimization opportunities for the current `wknd.base` client library.

## Current State: wknd.base

The current `wknd.base` client library embeds **8 core components**:

```xml
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[wknd.base]"
    embed="[
        core.wcm.components.accordion.v1,
        core.wcm.components.tabs.v1,
        core.wcm.components.carousel.v1,
        core.wcm.components.image.v3,
        core.wcm.components.breadcrumb.v2,
        core.wcm.components.search.v1,
        core.wcm.components.form.text.v2,
        core.wcm.components.embed.v1
    ]"/>
```

## Homepage Component Usage Analysis

### ✅ Components Actually Used on Homepage:

1. **core.wcm.components.carousel.v1** - Hero section with rotating adventures
2. **core.wcm.components.image.v3** - Multiple images throughout the page
3. **core.wcm.components.breadcrumb.v2** - Navigation elements

### ❌ Components NOT Used on Homepage:

1. **core.wcm.components.accordion.v1** - No collapsible sections found
2. **core.wcm.components.tabs.v1** - No tabbed interfaces found
3. **core.wcm.components.search.v1** - No search component visible
4. **core.wcm.components.form.text.v2** - No forms found
5. **core.wcm.components.embed.v1** - No embedded content found

## Optimized Solution: wknd-new.base

### New Client Library Structure

```xml
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[wknd-new.base]"
    embed="[
        core.wcm.components.carousel.v1,
        core.wcm.components.image.v3,
        core.wcm.components.breadcrumb.v2
    ]"/>
```

### Performance Benefits

- **62.5% reduction** in embedded components (from 8 to 3)
- **Reduced bundle size** by excluding unused JavaScript and CSS
- **Faster page load times** for the homepage
- **Better caching efficiency** with smaller, focused client libraries

## Implementation Steps

### 1. Deploy New Client Library

Copy the `wknd-new-clientlib/clientlib-new-base/` folder to your AEM project at:
```
ui.apps/src/main/content/jcr_root/apps/wknd/clientlibs/clientlib-new-base/
```

### 2. Update HTL Templates

Replace the existing client library references in your page components:

**Before (in customheaderlibs.html):**
```html
<sly data-sly-call="${clientLib.css @ categories='wknd.base'}" />
```

**After:**
```html
<sly data-sly-call="${clientLib.css @ categories='wknd-new.base'}" />
```

**Before (in customfooterlibs.html):**
```html
<sly data-sly-call="${clientLib.js @ categories='wknd.base'}" />
```

**After:**
```html
<sly data-sly-call="${clientLib.js @ categories='wknd-new.base'}" />
```

### 3. Testing Recommendations

1. **Verify homepage functionality** - ensure carousel, images, and navigation work correctly
2. **Check other pages** - confirm no regressions on pages that might use the excluded components
3. **Performance testing** - measure load time improvements
4. **Cross-browser testing** - verify compatibility across target browsers

### 4. Rollback Plan

If issues are discovered, you can quickly rollback by:
1. Reverting HTL template changes to use `wknd.base`
2. Keeping the original `wknd.base` client library intact during testing

## Future Considerations

### Page-Specific Optimization

Consider creating page-specific client libraries for other page types:
- `wknd.article-page` - for article/content pages
- `wknd.search-page` - for search functionality pages
- `wknd.form-page` - for form-heavy pages

### Component Loading Strategy

Implement lazy loading for components that are only used on specific pages:
- Load accordion/tabs components only when needed
- Conditional loading based on page template or component presence

### Monitoring

Set up monitoring to track:
- Page load performance improvements
- JavaScript bundle size reductions
- User experience metrics

## Files Created

```
wknd-new-clientlib/
├── clientlib-new-base/
│   ├── .content.xml          # Client library definition
│   ├── js.txt                # JavaScript loading order
│   └── css.txt               # CSS loading order
├── templates/
│   ├── customheaderlibs-new.html  # Updated header includes
│   └── customfooterlibs-new.html  # Updated footer includes
└── OPTIMIZATION_SUMMARY.md   # This documentation
```

## Estimated Impact

- **Bundle Size Reduction**: ~40-60% smaller JavaScript/CSS bundles
- **Load Time Improvement**: 10-25% faster initial page load
- **Bandwidth Savings**: Reduced data transfer for homepage visits
- **Maintenance Benefits**: Simpler dependency management for homepage-specific features
