import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { definePlugin } from 'sanity';
import { useTheme } from 'styled-components';
import { buildTokenBridge } from './bridge.js';
import { buildStyles } from './styles.js';
/**
 * Adds Uplift's rules to the Studio: the token bridge, and the parts of the UX
 * that theme tokens cannot reach, such as the hierarchy between a field's title
 * and its description, or the room between array items.
 *
 * Pair it with `upliftTheme()` on the config's `theme` option.
 */
export const uplift = definePlugin((options) => {
    const { bridge = true, ...styleOptions } = options ?? {};
    function UpliftLayout(props) {
        const theme = useTheme()?.sanity?.v2;
        const css = useMemo(() => [
            bridge && theme ? buildTokenBridge(theme) : '',
            buildStyles(styleOptions, { space: theme?.space, text: theme?.font.text.sizes }),
        ]
            .filter(Boolean)
            .join('\n\n'), [theme]);
        return (_jsxs(_Fragment, { children: [css ? _jsx("style", { "data-uplift": "", children: css }) : null, props.renderDefault(props)] }));
    }
    return {
        name: '@mozestudio/sanity-uplift',
        studio: { components: { layout: UpliftLayout } },
    };
});
//# sourceMappingURL=plugin.js.map