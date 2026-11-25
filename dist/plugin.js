import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { definePlugin } from 'sanity';
import { buildStyles } from './styles.js';
/**
 * Adds Uplift's form rules to the Studio: the parts of the UX that theme
 * tokens cannot reach, such as the hierarchy between a field's title and its
 * description, or the gap between array items.
 *
 * Pair it with `upliftTheme()` on the config's `theme` option.
 */
export const uplift = definePlugin((options) => {
    const css = buildStyles(options ?? {});
    function UpliftLayout(props) {
        return (_jsxs(_Fragment, { children: [css ? _jsx("style", { "data-uplift": "", children: css }) : null, props.renderDefault(props)] }));
    }
    return {
        name: '@mozestudio/sanity-uplift',
        studio: { components: { layout: UpliftLayout } },
    };
});
//# sourceMappingURL=plugin.js.map